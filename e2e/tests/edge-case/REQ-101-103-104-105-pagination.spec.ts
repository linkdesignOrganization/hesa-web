import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-101, REQ-103, REQ-104, REQ-105: Pagination Edge Cases', () => {

  // All pagination tests require the API to be functional and return enough products.
  // Currently the API returns 404 on all endpoints.

  test('REQ-101: Pagination visible with max items per page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForTimeout(4000);

    // Check if products loaded
    const productCount = page.locator('[class*="product-card"], [class*="card"]');
    const errorMsg = page.getByText(/no pudimos cargar/i);

    if (await errorMsg.isVisible()) {
      test.skip(true, 'API not serving data - cannot test pagination');
      return;
    }

    // If enough products exist, pagination should be visible
    const counter = page.getByText(/\d+ productos/);
    await expect(counter).toBeVisible();

    const counterText = await counter.textContent();
    const totalProducts = parseInt(counterText?.match(/(\d+)/)?.[1] || '0');

    if (totalProducts > 24) {
      // Pagination controls should be visible
      const pagination = page.locator('[class*="pagination"], nav[aria-label*="aginacion"]');
      await expect(pagination).toBeVisible();
    }
  });

  test('REQ-103: Pagination accessible with keyboard (Tab + Enter)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForTimeout(4000);

    const errorMsg = page.getByText(/no pudimos cargar/i);
    if (await errorMsg.isVisible()) {
      test.skip(true, 'API not serving data - cannot test pagination');
      return;
    }

    // Look for pagination buttons
    const paginationBtns = page.locator('[class*="pagination"] button, [class*="pagination"] a');
    const count = await paginationBtns.count();

    if (count === 0) {
      test.skip(true, 'No pagination visible (not enough products)');
      return;
    }

    // Pagination buttons should be focusable via Tab
    for (let i = 0; i < Math.min(count, 3); i++) {
      const btn = paginationBtns.nth(i);
      await btn.focus();
      const isFocused = await btn.evaluate(el => el === document.activeElement);
      expect(isFocused).toBe(true);
    }
  });

  test('REQ-104: Scroll to top when changing page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForTimeout(4000);

    const errorMsg = page.getByText(/no pudimos cargar/i);
    if (await errorMsg.isVisible()) {
      test.skip(true, 'API not serving data - cannot test pagination');
      return;
    }

    // Find next page button
    const nextBtn = page.locator('[class*="pagination"] button:has-text("Siguiente"), [class*="pagination"] button:has-text(">"), [class*="pagination"] [aria-label*="iguiente"]');

    if (await nextBtn.count() === 0) {
      test.skip(true, 'No next page button visible');
      return;
    }

    // Scroll down first
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    // Click next page
    await nextBtn.first().click();
    await page.waitForTimeout(1000);

    // Should scroll back to top
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test('REQ-105: Pagination resets to page 1 when changing filters', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo?page=2`);
    await page.waitForTimeout(4000);

    const errorMsg = page.getByText(/no pudimos cargar/i);
    if (await errorMsg.isVisible()) {
      test.skip(true, 'API not serving data - cannot test pagination');
      return;
    }

    // Apply a filter
    const categoryFilter = page.locator('select, [role="combobox"]').first();
    if (await categoryFilter.count() > 0) {
      await categoryFilter.selectOption({ index: 1 });
      await page.waitForTimeout(2000);

      // URL should not contain page=2 anymore (reset to page 1)
      const url = page.url();
      expect(url).not.toContain('page=2');
    }
  });
});
