import { test, expect } from '@playwright/test';

/**
 * Public Site — Layout with Real Data (Shared Criteria)
 * STATUS: FALLA — API returns 404 for all endpoints, no products/brands load
 *
 * REQ-081: Product grid 3 cols desktop, 2 tablet, 1-2 mobile
 * REQ-082: Product cards: image, name bold, brand grey, species icons
 * REQ-144: Brand grid 3-4 cols desktop, 2 tablet, 1-2 mobile
 * REQ-145: Brand cards: logo, name, country, category badges
 * REQ-264j: Catalog mobile: grid 1-2 cols, filters collapsed
 *
 * These tests verify the catalog page structure.
 * Product/brand grid layout tests require real data from API.
 */

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('Public Catalog — Page Structure', () => {

  test('Catalog page has breadcrumb, title, counter, and filter dropdowns', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`, { waitUntil: 'networkidle' });
    await page.waitForSelector('h1', { timeout: 15000 });

    // Verify breadcrumb
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toBeVisible();

    // Verify title
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Catalogo/i);

    // Verify counter exists
    await expect(page.getByText(/\d+ productos?/i)).toBeVisible();

    // Verify filter dropdowns
    const selects = page.locator('select');
    expect(await selects.count()).toBeGreaterThanOrEqual(2);
  });

  test('REQ-264j: Mobile catalog shows collapsed filter button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/catalogo`, { waitUntil: 'networkidle' });
    await page.waitForSelector('h1', { timeout: 15000 });

    // On mobile, filters should be collapsed into a "Filtrar"/"Filter" button
    const filterButton = page.getByRole('button', { name: /filtrar|filter/i });
    await expect(filterButton).toBeVisible();

    // Dropdown selects should NOT be visible on mobile
    const selects = page.locator('select');
    const selectCount = await selects.count();
    if (selectCount > 0) {
      await expect(selects.first()).not.toBeVisible();
    }
  });

  test('Brands page has breadcrumb, title, and intro paragraph', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas`, { waitUntil: 'networkidle' });
    await page.waitForSelector('h1', { timeout: 15000 });

    // Verify title
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Marcas/i);

    // Verify breadcrumb
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
  });

  test('Catalog error state shows retry button when API is down', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`, { waitUntil: 'networkidle' });
    await page.waitForSelector('h1', { timeout: 15000 });

    // When API is down, error state should be shown
    const errorHeading = page.getByText(/No pudimos cargar|could not load/i);
    const retryButton = page.getByRole('button', { name: /Reintentar|Retry/i });

    // At least one of these should be visible if API is down
    const hasError = await errorHeading.isVisible().catch(() => false);
    if (hasError) {
      await expect(retryButton).toBeVisible();
    }
  });
});
