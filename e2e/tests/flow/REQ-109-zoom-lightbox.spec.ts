import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: REQ-109 - Imagen con zoom/lightbox
// STATUS: FALLA - No hay productos en la base de datos. No se puede verificar la funcionalidad
// de zoom/lightbox porque no se puede cargar ningun detalle de producto.

test.describe('REQ-109: Zoom/lightbox en imagen de producto', () => {

  test('REQ-109: Clic en imagen principal abre lightbox con zoom', async ({ page }) => {
    // Necesitamos un producto real con imagen
    // Primero verificar si hay algun producto disponible via API
    const apiResponse = await page.request.get(`${BASE_URL.replace('gray-field-02ba8410f.2.azurestaticapps.net', 'hesa-api.azurewebsites.net')}/api/public/products`);
    const data = await apiResponse.json();

    if (data.total === 0 || data.data.length === 0) {
      test.skip(true, 'No hay productos en la DB para verificar zoom/lightbox');
      return;
    }

    const product = data.data[0];
    const slug = product.slug?.es || product.slug;
    const category = product.category?.key || 'farmacos';

    await page.goto(`${BASE_URL}/es/catalogo/${category}/${slug}`);
    await page.waitForSelector('h1', { timeout: 10000 });

    // Clic en imagen principal
    const mainImage = page.locator('[data-testid="product-image"], .product-gallery img, .product-image img').first();
    await expect(mainImage).toBeVisible();
    await mainImage.click();

    // Verificar lightbox
    const lightbox = page.locator('[data-testid="lightbox"], .lightbox, [role="dialog"]');
    await expect(lightbox).toBeVisible({ timeout: 3000 });
  });
});
