import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-098: Toggle Card/Table View in Admin', () => {

  test.beforeEach(async ({ page }) => {
    // Login to admin
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForSelector('button:has-text("Iniciar sesion con Microsoft")', { state: 'visible' });
    await page.getByRole('button', { name: 'Iniciar sesion con Microsoft' }).click();
    await page.waitForURL('**/admin/dashboard');
  });

  test('Product list has card and table view toggle buttons', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`);
    await expect(page.getByRole('button', { name: 'Vista de tarjetas' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Vista de tabla' })).toBeVisible();
  });

  test('Table view toggle switches view', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`);
    await page.getByRole('button', { name: 'Vista de tabla' }).click();
    // Table headers should appear
    await expect(page.getByText('Nombre').first()).toBeVisible();
  });
});
