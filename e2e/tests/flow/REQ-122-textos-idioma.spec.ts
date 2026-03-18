import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

// test: REQ-122 - Textos en idioma seleccionado (ambos idiomas)
// STATUS: FALLA - No hay productos en la base de datos para verificar i18n de textos de producto.
// Las paginas de estructura (catalogo, marcas) SI muestran textos i18n correctamente.

test.describe('REQ-122: Textos de producto en idioma seleccionado', () => {

  test('REQ-122: Detalle de producto en ES muestra textos en espanol', async ({ page }) => {
    const response = await page.request.get(`${API_URL}/api/public/products?limit=1`);
    const data = await response.json();

    if (data.total === 0 || data.data.length === 0) {
      test.skip(true, 'No hay productos en la DB para verificar i18n');
      return;
    }

    const product = data.data[0];
    const slug = product.slug?.es || product.slug;
    const category = product.category?.key || 'farmacos';

    await page.goto(`${BASE_URL}/es/catalogo/${category}/${slug}`);
    await page.waitForSelector('h1', { timeout: 10000 });

    // Verificar que la UI esta en espanol
    await expect(page.getByText(/Solicitar info|Solicitar informacion/i)).toBeVisible();
  });

  test('REQ-122: Detalle de producto en EN muestra textos en ingles', async ({ page }) => {
    const response = await page.request.get(`${API_URL}/api/public/products?limit=1`);
    const data = await response.json();

    if (data.total === 0 || data.data.length === 0) {
      test.skip(true, 'No hay productos en la DB para verificar i18n');
      return;
    }

    const product = data.data[0];
    const slugEn = product.slug?.en || product.slug;
    const categoryEn = product.category?.key === 'farmacos' ? 'pharmaceuticals'
      : product.category?.key === 'alimentos' ? 'food'
      : 'equipment';

    await page.goto(`${BASE_URL}/en/catalog/${categoryEn}/${slugEn}`);
    await page.waitForSelector('h1', { timeout: 10000 });

    // Verificar que la UI esta en ingles
    await expect(page.getByText(/Request info|Request information/i)).toBeVisible();
  });

  test('REQ-122: Estructura del catalogo muestra textos i18n - ES', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos`);
    await page.waitForSelector('h1', { timeout: 10000 });

    await expect(page.locator('h1')).toContainText('Farmacos');
    await expect(page.getByText('productos')).toBeVisible();
  });

  test('REQ-122: Estructura del catalogo muestra textos i18n - EN', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/catalog/pharmaceuticals`);
    await page.waitForSelector('h1', { timeout: 10000 });

    await expect(page.locator('h1')).toContainText('Pharmaceuticals');
    await expect(page.getByText('products')).toBeVisible();
  });
});
