import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-034 - Marca individual page
test.describe('UX-034: Marca individual', () => {

  test('Zoetis brand page renders with products', async ({ page }) => {
    await page.goto(`${BASE}/es/marcas/zoetis`);
    await expect(page.getByRole('heading', { name: 'Zoetis', level: 1 })).toBeVisible({ timeout: 10000 });
    // Country
    await expect(page.getByText('Estados Unidos')).toBeVisible();
    // Category badge
    await expect(page.getByText('Farmacos')).toBeVisible();
    // Products section
    await expect(page.getByRole('heading', { name: 'Productos de Zoetis', level: 2 })).toBeVisible();
    // At least one product
    await expect(page.getByRole('link', { name: /Ver Amoxicilina/ })).toBeVisible();
  });

  test('brand page has breadcrumb', async ({ page }) => {
    await page.goto(`${BASE}/es/marcas/zoetis`);
    await expect(page.getByRole('heading', { name: 'Zoetis', level: 1 })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('link', { name: 'Inicio' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Marcas' })).toBeVisible();
  });

  test('non-existent brand shows 404', async ({ page }) => {
    await page.goto(`${BASE}/es/marcas/marca-inexistente`);
    await expect(page.getByText('Pagina no encontrada').or(page.getByText('no encontrada'))).toBeVisible({ timeout: 10000 });
  });
});
