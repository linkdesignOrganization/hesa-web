import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

// test: REQ-119 - Boton ficha tecnica PDF si hay PDF
// STATUS: FALLA - No hay productos en la base de datos para verificar si el boton de ficha tecnica aparece.

test.describe('REQ-119: Boton ficha tecnica PDF', () => {

  test('REQ-119: Producto con ficha tecnica muestra boton de descarga PDF', async ({ page }) => {
    const response = await page.request.get(`${API_URL}/api/public/products?limit=10`);
    const data = await response.json();

    if (data.total === 0 || data.data.length === 0) {
      test.skip(true, 'No hay productos en la DB para verificar ficha tecnica PDF');
      return;
    }

    // Buscar producto con ficha tecnica
    const productWithPdf = data.data.find((p: any) => p.technicalSheet || p.fichaTecnica || p.pdfUrl);
    if (!productWithPdf) {
      test.skip(true, 'No hay productos con ficha tecnica PDF en la DB');
      return;
    }

    const slug = productWithPdf.slug?.es || productWithPdf.slug;
    const category = productWithPdf.category?.key || 'farmacos';

    await page.goto(`${BASE_URL}/es/catalogo/${category}/${slug}`);
    await page.waitForSelector('h1', { timeout: 10000 });

    // Verificar boton de ficha tecnica
    const pdfButton = page.locator('a[href*=".pdf"], button:has-text("ficha"), a:has-text("ficha tecnica")');
    await expect(pdfButton).toBeVisible();

    // Verificar que el link apunta a un PDF
    const href = await pdfButton.getAttribute('href');
    expect(href).toContain('.pdf');
  });
});
