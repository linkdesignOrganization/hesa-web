import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('NFR-017: XSS Protection and Security Headers', () => {
  test('Security headers are properly set', async ({ request }) => {
    const response = await request.get(`${BASE}/es/`);

    // HSTS
    const hsts = response.headers()['strict-transport-security'];
    expect(hsts).toContain('max-age=31536000');
    expect(hsts).toContain('includeSubDomains');

    // X-Content-Type-Options
    expect(response.headers()['x-content-type-options']).toBe('nosniff');

    // X-XSS-Protection
    expect(response.headers()['x-xss-protection']).toBe('1; mode=block');

    // X-Frame-Options
    expect(response.headers()['x-frame-options']).toBe('DENY');

    // Referrer-Policy
    expect(response.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin');

    // X-DNS-Prefetch-Control
    expect(response.headers()['x-dns-prefetch-control']).toBe('off');
  });

  test('CSP header is properly configured', async ({ request }) => {
    const response = await request.get(`${BASE}/es/`);
    const csp = response.headers()['content-security-policy'];

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("connect-src 'self'");

    // No external tracking domains
    expect(csp).not.toContain('crm-api');
    expect(csp).not.toContain('linkdesign');
  });

  test('Permissions-Policy restricts camera, mic, geolocation', async ({ request }) => {
    const response = await request.get(`${BASE}/es/`);
    const pp = response.headers()['permissions-policy'];

    expect(pp).toContain('camera=()');
    expect(pp).toContain('microphone=()');
    expect(pp).toContain('geolocation=()');
  });

  test('XSS payload in contact form name field does not execute', async ({ page }) => {
    let alertTriggered = false;
    page.on('dialog', async (dialog) => {
      alertTriggered = true;
      await dialog.dismiss();
    });

    await page.goto(`${BASE}/es/contacto`);
    await page.waitForSelector('text=Contactenos', { timeout: 10000 });

    // Try various XSS payloads
    const xssPayloads = [
      '<script>alert(1)</script>',
      '"><img src=x onerror=alert(1)>',
      "';alert(1)//",
      '<svg onload=alert(1)>',
    ];

    for (const payload of xssPayloads) {
      await page.getByRole('textbox', { name: 'Nombre *' }).fill(payload);
      await page.waitForTimeout(200);
    }

    expect(alertTriggered).toBe(false);
  });

  test('XSS payload in distributor form does not execute', async ({ page }) => {
    let alertTriggered = false;
    page.on('dialog', async (dialog) => {
      alertTriggered = true;
      await dialog.dismiss();
    });

    await page.goto(`${BASE}/es/distribuidores`);
    await page.waitForSelector('text=Inicie su Alianza', { timeout: 10000 });

    await page.getByRole('textbox', { name: 'Nombre de la empresa' }).fill('<script>alert("XSS")</script>');
    await page.getByRole('textbox', { name: 'Nombre de contacto' }).fill('"><img src=x onerror=alert(1)>');
    await page.waitForTimeout(500);

    expect(alertTriggered).toBe(false);
  });

  test('XSS payload in product form does not execute', async ({ page }) => {
    let alertTriggered = false;
    page.on('dialog', async (dialog) => {
      alertTriggered = true;
      await dialog.dismiss();
    });

    await page.goto(`${BASE}/admin/productos/crear`);
    await page.waitForSelector('text=Crear Producto', { timeout: 10000 });

    await page.getByRole('textbox', { name: 'Nombre del producto' }).fill('<script>alert("XSS")</script>');
    await page.getByRole('textbox', { name: 'Descripcion' }).fill('"><img src=x onerror=alert(1)>');
    await page.waitForTimeout(500);

    expect(alertTriggered).toBe(false);
  });

  // R4: Advanced XSS payloads
  test('Advanced XSS payloads in contact form do not execute', async ({ page }) => {
    let alertTriggered = false;
    page.on('dialog', async (dialog) => {
      alertTriggered = true;
      await dialog.dismiss();
    });

    await page.goto(`${BASE}/es/contacto`);
    await page.waitForSelector('text=Contactenos', { timeout: 10000 });

    const advancedPayloads = [
      '<img onerror=alert(1) src=x>',
      'javascript:alert(1)',
      "' OR 1=1 --",
      '<svg/onload=alert(1)>',
      '{{constructor.constructor("alert(1)")()}}',
      '<iframe src="javascript:alert(1)">',
      '<body onload=alert(1)>',
      'data:text/html,<script>alert(1)</script>',
    ];

    for (const payload of advancedPayloads) {
      const nameField = page.getByRole('textbox', { name: 'Nombre *' });
      if (await nameField.isVisible({ timeout: 3000 }).catch(() => false)) {
        await nameField.fill(payload);
        await page.waitForTimeout(100);
      }
    }

    expect(alertTriggered).toBe(false);
  });

  test('SQL injection payload in form fields does not cause errors', async ({ page }) => {
    await page.goto(`${BASE}/es/contacto`);
    await page.waitForSelector('text=Contactenos', { timeout: 10000 });

    const sqlPayloads = [
      "' OR 1=1 --",
      "'; DROP TABLE users; --",
      "1' UNION SELECT * FROM users --",
      "admin' --",
    ];

    for (const payload of sqlPayloads) {
      const nameField = page.getByRole('textbox', { name: 'Nombre *' });
      if (await nameField.isVisible({ timeout: 3000 }).catch(() => false)) {
        await nameField.fill(payload);
        // Verificar que el campo acepta el texto sin error
        await expect(nameField).toHaveValue(payload);
      }
    }
  });

  test('CSP script-src blocks inline script execution', async ({ request }) => {
    const response = await request.get(`${BASE}/es/`);
    const csp = response.headers()['content-security-policy'];

    // script-src should be restrictive
    expect(csp).toContain("script-src 'self'");

    // No unsafe-eval allowed
    expect(csp).not.toContain('unsafe-eval');

    // img-src allows data: for inline images but not scripts
    expect(csp).toContain("img-src 'self' data: https:");
  });

  test('No CRM or tracking scripts in JS bundle', async ({ request }) => {
    const response = await request.get(`${BASE}/`);
    const html = await response.text();

    // Find the main JS bundle URL
    const jsMatch = html.match(/src="(main-[^"]+\.js)"/);
    if (jsMatch) {
      const jsResponse = await request.get(`${BASE}/${jsMatch[1]}`);
      const jsContent = await jsResponse.text();

      // No CRM tracking
      expect(jsContent).not.toContain('crm-api');
      expect(jsContent).not.toContain('linkdesign.cr');
      expect(jsContent).not.toContain('CrmTracking');
    }
  });
});
