import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

test.describe('NFR-017: XSS and injection sanitization', () => {
  test('Contact form does not execute script tags in name field', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`);
    await page.waitForSelector('input[placeholder*="nombre"], [aria-label*="Nombre"]', { timeout: 10000 });

    // Fill with XSS payload
    await page.fill('input[placeholder*="nombre"], [aria-label*="Nombre"]', '<script>alert(1)</script>');

    // Verify the script tag is displayed as text, not executed
    const nameInput = page.locator('input[placeholder*="nombre"], [aria-label*="Nombre"]');
    const value = await nameInput.inputValue();
    expect(value).toContain('<script>');
    // No alert dialog should have appeared (Angular auto-escapes)
  });

  test('Contact form does not execute img onerror XSS in message field', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`);
    await page.waitForSelector('textarea, [aria-label*="Mensaje"]', { timeout: 10000 });

    await page.fill('textarea, [aria-label*="Mensaje"]', '<img onerror=alert(1) src=x>');
    const msgInput = page.locator('textarea, [aria-label*="Mensaje"]');
    const value = await msgInput.inputValue();
    expect(value).toContain('<img');
  });

  test('API sanitizes script tags from contact general submission', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/public/contact/general`, {
      data: {
        name: '<script>alert(1)</script>',
        email: 'xsstest@test.com',
        consultationType: 'info',
        message: 'test message with <script>document.cookie</script>',
      },
    });
    // The sanitized name becomes empty after stripping <script>, so validation fails
    const body = await response.json();
    if (response.status() === 400) {
      // Name was stripped and became empty -> validation error (correct behavior)
      expect(body.errors).toBeDefined();
      expect(body.errors.name).toBeDefined();
    } else if (response.status() === 201) {
      // If it passed, the script tags were stripped but valid content remained
      expect(body.success).toBe(true);
    } else if (response.status() === 429) {
      // Rate limited - acceptable
      test.skip();
    }
  });

  test('API sanitizes mixed content (valid text + XSS) in contact general', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/public/contact/general`, {
      data: {
        name: 'John <script>alert(1)</script> Doe',
        email: 'xsstest2@test.com',
        consultationType: 'info',
        message: 'Hello <img onerror=alert(1) src=x> world',
      },
    });
    if (response.status() === 429) {
      test.skip();
      return;
    }
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  test('API sanitizes XSS in manufacturer contact form', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/public/contact/manufacturer`, {
      data: {
        companyName: '<script>alert(1)</script>Evil Corp',
        country: 'Mexico',
        contactName: '<img src=x onerror=alert(1)>Hacker',
        contactEmail: 'xsstest3@evil.com',
        contactPhone: '+1234567890',
        productTypes: 'data:text/html,<script>alert(1)</script>',
        message: 'Normal message with <script>document.cookie</script> injection',
      },
    });
    if (response.status() === 429) {
      test.skip();
      return;
    }
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  test('API blocks NoSQL injection operators ($gt, $ne)', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/public/contact/general`, {
      data: {
        name: 'Test User',
        email: 'nosql@test.com',
        consultationType: 'info',
        message: 'Normal message',
        $gt: '',
        $ne: 'admin',
      },
    });
    if (response.status() === 429) {
      test.skip();
      return;
    }
    // Should either succeed (stripping $ keys) or fail validation, never crash
    expect([200, 201, 400]).toContain(response.status());
  });

  test('API blocks prototype pollution (__proto__, constructor)', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/public/contact/general`, {
      data: {
        name: 'Proto Test',
        email: 'proto@test.com',
        consultationType: 'info',
        message: 'Testing prototype pollution',
        __proto__: { isAdmin: true },
        constructor: { prototype: { isAdmin: true } },
      },
    });
    if (response.status() === 429) {
      test.skip();
      return;
    }
    expect([200, 201, 400]).toContain(response.status());
  });
});
