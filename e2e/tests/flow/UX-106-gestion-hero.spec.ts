import { test, expect } from '@playwright/test';

// test: UX-106 - Gestion Hero con preview e imagen
test.describe('UX-106: Gestion Hero panel admin', () => {
  const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

  test('UX-106: Pagina de gestion Hero carga correctamente', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/home/hero`);
    await page.waitForSelector('h1, h2', { timeout: 15000 });

    // Verificar que la pagina de hero carga
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});
