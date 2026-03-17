import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-114: CRM Tracking Script Eliminated', () => {
  test('No CRM references in JavaScript bundle', async ({ request }) => {
    // Get the HTML to find JS bundle filename
    const htmlResponse = await request.get(`${BASE}/es/`);
    const html = await htmlResponse.text();
    const mainJsMatch = html.match(/src="(main-[^"]+\.js)"/);
    expect(mainJsMatch).toBeTruthy();

    // Fetch the main JS bundle
    const jsResponse = await request.get(`${BASE}/${mainJsMatch![1]}`);
    const jsContent = await jsResponse.text();

    // Verify no CRM references
    expect(jsContent.toLowerCase()).not.toContain('crm-api');
    expect(jsContent.toLowerCase()).not.toContain('linkdesign.cr');
    expect(jsContent.toLowerCase()).not.toContain('crmtracking');
  });

  test('CSP header does not include crm-api.linkdesign.cr', async ({ request }) => {
    const response = await request.get(`${BASE}/es/`);
    const csp = response.headers()['content-security-policy'] || '';

    expect(csp).not.toContain('crm-api');
    expect(csp).not.toContain('linkdesign.cr');
  });

  test('connect-src is restricted to self only', async ({ request }) => {
    const response = await request.get(`${BASE}/es/`);
    const csp = response.headers()['content-security-policy'] || '';

    // connect-src should be 'self' only
    const connectSrcMatch = csp.match(/connect-src\s+([^;]+)/);
    expect(connectSrcMatch).toBeTruthy();
    expect(connectSrcMatch![1].trim()).toBe("'self'");
  });

  test('No console errors for crm-api in page load', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto(`${BASE}/es/`);
    await page.waitForLoadState('networkidle');

    const crmErrors = consoleErrors.filter(
      (e) => e.includes('crm-api') || e.includes('linkdesign')
    );
    expect(crmErrors).toHaveLength(0);
  });
});
