import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_BASE = 'https://hesa-api.azurewebsites.net';

test.describe('REQ-189 & REQ-202: Honeypot anti-spam protection', () => {
  test.describe('General form (REQ-202)', () => {
    test('honeypot field exists but is hidden', async ({ page }) => {
      await page.goto(`${BASE_URL}/es/contacto`);
      await page.waitForSelector('button:has-text("Enviar mensaje")', { timeout: 15000 });

      // Honeypot field should exist
      const honeypot = page.locator('input[name="website"]');
      await expect(honeypot).toHaveCount(1);

      // It should not be visible (off-screen positioning)
      const parent = honeypot.locator('..');
      await expect(parent).toHaveCSS('position', 'absolute');
    });

    test('form with honeypot filled is silently rejected by API', async ({ page }) => {
      // Use direct API call to test honeypot
      const response = await page.evaluate(async (apiBase: string) => {
        const res = await fetch(`${apiBase}/api/public/contact/general`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Bot Test',
            email: 'bot@test.com',
            consultationType: 'info',
            message: 'I am a bot',
            website: 'spam-value', // honeypot filled
          }),
        });
        return { status: res.status, body: await res.json() };
      }, API_BASE);

      // Should return 200 (silent accept) NOT 201 (real accept)
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.id).toBeUndefined(); // No ID = not stored
    });
  });

  test.describe('Manufacturer form (REQ-189)', () => {
    test('manufacturer honeypot field exists but is hidden', async ({ page }) => {
      await page.goto(`${BASE_URL}/es/distribuidores`);
      await page.waitForSelector('button:has-text("Enviar consulta")', { timeout: 15000 });

      const honeypot = page.locator('input[name="website"]');
      await expect(honeypot).toHaveCount(1);

      const parent = honeypot.locator('..');
      await expect(parent).toHaveCSS('position', 'absolute');
    });

    test('manufacturer form with honeypot filled is silently rejected', async ({ page }) => {
      const response = await page.evaluate(async (apiBase: string) => {
        const res = await fetch(`${apiBase}/api/public/contact/manufacturer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName: 'Bot Company',
            country: 'Mexico',
            contactName: 'Bot',
            contactEmail: 'bot@test.com',
            message: 'Spam',
            website: 'filled-by-bot',
          }),
        });
        return { status: res.status, body: await res.json() };
      }, API_BASE);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.id).toBeUndefined();
    });
  });
});
