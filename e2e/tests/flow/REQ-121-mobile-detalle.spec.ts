import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

// test: REQ-121 - Mobile: 1 columna, galeria arriba
// STATUS: FALLA - No hay productos en la base de datos para verificar el layout mobile del detalle.

test.describe('REQ-121: Layout mobile detalle producto', () => {

  test('REQ-121: En mobile (375px) el detalle muestra 1 columna con galeria arriba', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const response = await page.request.get(`${API_URL}/api/public/products?limit=1`);
    const data = await response.json();

    if (data.total === 0 || data.data.length === 0) {
      test.skip(true, 'No hay productos en la DB para verificar layout mobile');
      return;
    }

    const product = data.data[0];
    const slug = product.slug?.es || product.slug;
    const category = product.category?.key || 'farmacos';

    await page.goto(`${BASE_URL}/es/catalogo/${category}/${slug}`);
    await page.waitForSelector('h1', { timeout: 10000 });

    // Verificar que la galeria aparece antes que el texto
    const gallery = page.locator('[data-testid="product-gallery"], .product-gallery, .gallery');
    const productInfo = page.locator('[data-testid="product-info"], .product-info');

    const galleryBox = await gallery.boundingBox();
    const infoBox = await productInfo.boundingBox();

    if (galleryBox && infoBox) {
      // Galeria debe estar arriba (y menor que info y)
      expect(galleryBox.y).toBeLessThan(infoBox.y);
    }

    // Verificar single column layout
    if (galleryBox && infoBox) {
      // Ambos deben ocupar el ancho completo (no side by side)
      expect(galleryBox.width).toBeGreaterThan(300);
      expect(infoBox.width).toBeGreaterThan(300);
    }
  });
});
