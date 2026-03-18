import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

test.describe('REQ-120: Product without PDF hides download button', () => {
  test('Product without pdfUrl does NOT show download button (Royal Canin Kitten)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/alimentos/royal-canin-kitten`);
    await page.waitForSelector('h1', { timeout: 10000 });

    // Verify product loaded
    await expect(page.locator('h1')).toContainText('Royal Canin Kitten');

    // Verify NO "Descargar ficha tecnica" or "Download" button exists
    const pdfButton = page.locator('text=/[Dd]escargar.*ficha|[Dd]ownload.*PDF|ficha.*tecnica/i');
    await expect(pdfButton).not.toBeVisible();
  });

  test('Product without pdfUrl does NOT show download button (Meloxicam)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/meloxicam-inyectable`);
    await page.waitForSelector('h1', { timeout: 10000 });

    await expect(page.locator('h1')).toContainText('Meloxicam');

    const pdfButton = page.locator('text=/[Dd]escargar.*ficha|[Dd]ownload.*PDF|ficha.*tecnica/i');
    await expect(pdfButton).not.toBeVisible();
  });

  test('Product WITH pdfUrl shows download button (Amoxicilina)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-veterinaria`);
    await page.waitForSelector('h1', { timeout: 10000 });

    await expect(page.locator('h1')).toContainText('Amoxicilina');

    // This product HAS a PDF, so the button should be visible
    const pdfButton = page.locator('text=/[Dd]escargar.*ficha|ficha.*tecnica/i');
    await expect(pdfButton).toBeVisible({ timeout: 5000 });
  });

  test('Product WITH pdfUrl shows download button (Monitor)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/equipos/monitor-signos-vitales-vet`);
    await page.waitForSelector('h1', { timeout: 10000 });

    await expect(page.locator('h1')).toContainText('Monitor');

    const pdfButton = page.locator('text=/[Dd]escargar.*ficha|ficha.*tecnica/i');
    await expect(pdfButton).toBeVisible({ timeout: 5000 });
  });

  test('API confirms which products have pdfUrl', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/products`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    const products = data.data || data;

    const withPdf = products.filter((p: any) => p.pdfUrl);
    const withoutPdf = products.filter((p: any) => !p.pdfUrl);

    expect(withPdf.length).toBeGreaterThan(0);
    expect(withoutPdf.length).toBeGreaterThan(0);
  });
});
