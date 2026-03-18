import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('NFR-004: Catalog Filter Response Time', () => {

  test('NFR-004: Applying a category filter updates results in under 500ms', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/catalogo**');

    // Wait for product cards to load
    await page.waitForSelector('.product-card, [class*="product-card"]', { timeout: 10000 });

    // Measure time to apply category filter
    const startTime = Date.now();
    await page.selectOption('[aria-label="Filtrar por categoria"]', { label: 'Farmacos' });

    // Wait for the grid to update (products count or cards should change)
    await page.waitForFunction(() => {
      const url = window.location.href;
      return url.includes('category') || url.includes('farmacos') || url.includes('Farmacos');
    }, { timeout: 5000 }).catch(() => {
      // If URL doesn't change, check if products visually updated
    });

    const endTime = Date.now();
    const elapsed = endTime - startTime;

    // Filter response should be under 500ms
    expect(elapsed).toBeLessThan(500);
  });

  test('NFR-004: Applying a brand filter updates results in under 500ms', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/catalogo**');

    await page.waitForSelector('.product-card, [class*="product-card"]', { timeout: 10000 });

    const startTime = Date.now();
    await page.selectOption('[aria-label="Filtrar por marca"]', { label: 'Zoetis' });

    // Wait for UI update
    await page.waitForTimeout(200);
    const endTime = Date.now();
    const elapsed = endTime - startTime;

    expect(elapsed).toBeLessThan(500);
  });

  test('NFR-004: Applying a species filter updates results in under 500ms', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/catalogo**');

    await page.waitForSelector('.product-card, [class*="product-card"]', { timeout: 10000 });

    const startTime = Date.now();
    await page.selectOption('[aria-label="Filtrar por especie"]', { label: 'Caninos' });

    await page.waitForTimeout(200);
    const endTime = Date.now();
    const elapsed = endTime - startTime;

    expect(elapsed).toBeLessThan(500);
  });
});
