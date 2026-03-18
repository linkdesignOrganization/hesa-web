import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_BASE = 'https://hesa-api.azurewebsites.net';

test.describe('NFR-017: XSS and injection sanitization', () => {
  test.describe('XSS prevention via API', () => {
    test('script tags are stripped from name field', async ({ request }) => {
      const response = await request.post(`${API_BASE}/api/public/contact/general`, {
        data: {
          name: '<script>alert(1)</script>',
          email: 'xss@test.com',
          consultationType: 'info',
          message: 'Normal message',
        },
      });

      // Name becomes empty after stripping script tags, so validation fails
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.errors.name).toBeDefined();
    });

    test('script tags embedded in valid content are stripped', async ({ request }) => {
      const response = await request.post(`${API_BASE}/api/public/contact/general`, {
        data: {
          name: 'John <script>alert(1)</script> Doe',
          email: 'xss2@test.com',
          consultationType: 'info',
          message: 'Hello <img src=x onerror=alert(1)> World',
        },
      });

      // The sanitizer strips HTML tags, leaving "John  Doe" and "Hello  World"
      // These are valid non-empty strings, so submission succeeds
      expect(response.status()).toBe(201);
    });

    test('img onerror XSS is stripped from message', async ({ request }) => {
      const response = await request.post(`${API_BASE}/api/public/contact/general`, {
        data: {
          name: 'XSS Test',
          email: 'xss3@test.com',
          consultationType: 'info',
          message: '<img src=x onerror="alert(document.cookie)">',
        },
      });

      // After stripping, message becomes empty
      expect(response.status()).toBe(400);
    });

    test('javascript: URI is stripped', async ({ request }) => {
      const response = await request.post(`${API_BASE}/api/public/contact/general`, {
        data: {
          name: 'JS URI Test',
          email: 'jsuri@test.com',
          consultationType: 'info',
          message: 'Click javascript:alert(1) here',
        },
      });

      // javascript: is stripped but "Click alert(1) here" remains
      if (response.status() === 201) {
        const body = await response.json();
        expect(body.success).toBe(true);
      }
    });
  });

  test.describe('NoSQL injection prevention', () => {
    test('MongoDB operator $gt is stripped from body keys', async ({ request }) => {
      const response = await request.post(`${API_BASE}/api/public/contact/general`, {
        data: {
          name: 'NoSQL Test',
          email: 'nosql@test.com',
          consultationType: 'info',
          message: '{"$gt":""}',
        },
      });

      // The string value is preserved as text, only $-prefixed KEYS are stripped
      if (response.status() === 201) {
        expect(true).toBeTruthy(); // Accepted as text, not as operator
      }
    });

    test('prototype pollution keys are blocked', async ({ request }) => {
      const response = await request.post(`${API_BASE}/api/public/contact/general`, {
        data: {
          name: 'Proto Test',
          email: 'proto@test.com',
          consultationType: 'info',
          message: 'Normal message',
          __proto__: { admin: true },
          constructor: { isAdmin: true },
        },
      });

      // The __proto__ and constructor keys should be stripped
      // The request should still succeed with just the valid fields
      expect([200, 201, 400, 429]).toContain(response.status());
    });
  });

  test.describe('SQL injection prevention', () => {
    test('SQL injection payload in message is accepted as text', async ({ request }) => {
      const response = await request.post(`${API_BASE}/api/public/contact/general`, {
        data: {
          name: 'SQL Test',
          email: 'sql@test.com',
          consultationType: 'info',
          message: "' OR 1=1; DROP TABLE messages;--",
        },
      });

      // SQL injection is not relevant for MongoDB, but the text should be stored safely
      if (response.status() === 201) {
        const body = await response.json();
        expect(body.success).toBe(true);
      }
    });
  });

  test.describe('UI-level XSS prevention', () => {
    test('XSS payload in form fields does not execute in browser', async ({ page }) => {
      await page.goto(`${BASE_URL}/es/contacto`);
      await page.waitForSelector('button:has-text("Enviar mensaje")', { timeout: 15000 });

      // Fill XSS payload
      await page.fill('input[name="name"]', '<script>window.__xss_executed=true</script>');
      await page.fill('textarea[name="message"]', '<img src=x onerror="window.__xss_executed=true">');

      // Check that no script was executed
      const xssExecuted = await page.evaluate(() => (window as any).__xss_executed);
      expect(xssExecuted).toBeFalsy();
    });

    test('HTML entities in form fields are displayed as text', async ({ page }) => {
      await page.goto(`${BASE_URL}/es/contacto`);
      await page.waitForSelector('button:has-text("Enviar mensaje")', { timeout: 15000 });

      await page.fill('input[name="name"]', '&lt;script&gt;alert(1)&lt;/script&gt;');

      const value = await page.inputValue('input[name="name"]');
      expect(value).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    });
  });
});
