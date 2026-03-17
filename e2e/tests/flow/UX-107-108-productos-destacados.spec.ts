import { test, expect } from '@playwright/test';

// test: UX-107/UX-108 - Productos destacados agregar y reordenar
test.describe('UX-107/UX-108: Productos y marcas destacados', () => {
  const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

  test('UX-107: Pagina de productos destacados carga correctamente', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/home/productos-destacados`);
    await page.waitForSelector('h1, h2', { timeout: 15000 });

    // Verificar que la pagina carga con algun contenido
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('UX-108: Pagina de marcas destacadas carga correctamente', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/home/marcas-destacadas`);
    await page.waitForSelector('h1, h2', { timeout: 15000 });

    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});
