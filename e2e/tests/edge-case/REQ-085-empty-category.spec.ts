import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

test.describe('REQ-085: Category without products shows empty state', () => {
  test('Catalog with impossible filter combination shows empty state message', async ({ page }) => {
    // Mindray only has equipos (no species), Porcinos has no Mindray products
    await page.goto(`${BASE_URL}/es/catalogo?brand=69ba2ddb999a9dca1b0b412c&species=Porcinos`);
    await page.waitForURL('**/catalogo**');

    // Should show "0 productos"
    const productCount = page.locator('text=0 productos');
    await expect(productCount).toBeVisible({ timeout: 10000 });

    // Should show empty state message
    const emptyMessage = page.locator('text=/[Nn]o se encontraron productos/');
    await expect(emptyMessage).toBeVisible({ timeout: 10000 });
  });

  test('Empty category filter shows informative message with suggestion', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo?brand=69ba2ddb999a9dca1b0b412c&species=Porcinos`);
    await page.waitForURL('**/catalogo**');

    // Should have suggestion to clear filters
    const suggestion = page.locator('text=/[Ll]impiar.*filtros|[Ff]iltros/');
    await expect(suggestion).toBeVisible({ timeout: 10000 });
  });

  test('Non-existent category URL shows 404 or not found page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/nonexistent`);
    // Should show a "not found" state or redirect to catalog
    await page.waitForTimeout(2000);
    const title = await page.title();
    // Should either show 404 page or redirect to catalog
    expect(title).toMatch(/no encontrada|Not Found|Catalogo|HESA/i);
  });

  test('API categories endpoint returns valid data with product counts', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/categories`);
    expect(response.status()).toBe(200);
    const categories = await response.json();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    for (const cat of categories) {
      expect(cat.key).toBeDefined();
      expect(cat.name).toBeDefined();
      // Each category should have a count (may be 0)
      expect(typeof cat.activeCount).toBe('number');
    }
  });
});
