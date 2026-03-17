import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-052: WhatsApp FAB', () => {

  test('DC-052: WhatsApp FAB visible on home page', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const wab = page.getByRole('button', { name: /WhatsApp/i });
    await expect(wab).toBeVisible();
  });

  test('BVC-038: WhatsApp FAB visible on catalog page', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    const wab = page.getByRole('button', { name: /WhatsApp/i });
    await expect(wab).toBeVisible();
  });

  test('BVC-038: WhatsApp FAB visible on contact page', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/contacto`);
    const wab = page.getByRole('button', { name: /WhatsApp/i });
    await expect(wab).toBeVisible();
  });

  test('BVC-029: No live chat widget present (only WhatsApp)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const chatWidgets = await page.evaluate(() => {
      const chatEls = document.querySelectorAll(
        '[class*="chat-widget"], [class*="live-chat"], [id*="intercom"], [id*="zendesk"], [id*="crisp"], [id*="tawk"]'
      );
      return chatEls.length;
    });
    expect(chatWidgets).toBe(0);
  });
});
