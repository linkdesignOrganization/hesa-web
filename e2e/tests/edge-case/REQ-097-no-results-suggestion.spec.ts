import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-097: No results shows message with suggestion', () => {
  test('filters that yield zero results show helpful message', async ({ page }) => {
    // Apply a filter that will return 0 results (database has 0 products)
    await page.goto(`${BASE_URL}/es/catalogo/farmacos?species=Caninos`);
    await page.waitForLoadState('networkidle');

    // Wait for the no-results message
    const noResults = page.getByText(/no se encontraron productos/i);
    await expect(noResults).toBeVisible({ timeout: 10000 });
  });

  test('no-results state includes Limpiar filtros CTA as suggestion', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos?species=Caninos`);
    await page.waitForLoadState('networkidle');

    // The suggestion is a "Limpiar filtros" button
    const ctaButton = page.getByRole('button', { name: /limpiar filtros/i });
    // There may be two instances (one inline pill area, one in the empty state)
    await expect(ctaButton.first()).toBeVisible({ timeout: 10000 });
  });

  test('category with 0 products shows empty state message', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos`);
    await page.waitForLoadState('networkidle');

    // With 0 products, should show appropriate message
    const emptyMessage = page.getByText(/no hay productos disponibles/i);
    await expect(emptyMessage).toBeVisible({ timeout: 10000 });
  });

  test('EN: no-results message is in English', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/catalog/pharmaceuticals?species=Canines`);
    await page.waitForLoadState('networkidle');

    // Look for English version of the message
    const noResults = page.getByText(/no products found|no products available/i);
    await expect(noResults).toBeVisible({ timeout: 10000 });
  });
});
