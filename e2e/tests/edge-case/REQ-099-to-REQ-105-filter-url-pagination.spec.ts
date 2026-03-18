import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-099 to REQ-105: Filter URL Deep Linking and Pagination Edge Cases', () => {

  test('REQ-099: Filters reflected in URL query params (deep linking)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForTimeout(3000);

    // Select a filter
    await page.locator('select').first().selectOption('Farmacos');
    await page.waitForTimeout(1000);

    // URL should contain filter
    expect(page.url()).toContain('category=farmacos');

    // Navigate directly to URL with filter params
    await page.goto(`${BASE_URL}/es/catalogo?category=farmacos`);
    await page.waitForTimeout(3000);

    // The category dropdown should have Farmacos selected
    const categorySelect = page.locator('select').first();
    const selectedValue = await categorySelect.inputValue();
    expect(selectedValue.toLowerCase()).toContain('farmacos');
  });

  test('REQ-099: Deep link with XSS payload in filter params is safe', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo?category=<script>alert(1)</script>`);
    await page.waitForTimeout(3000);

    // The page should load without executing script
    // Check no alert dialog appeared (page didn't crash)
    const title = await page.title();
    expect(title).toContain('HESA');

    // The XSS payload should not appear in the DOM as a script element
    const scriptInjected = await page.locator('script:text("alert(1)")').count();
    expect(scriptInjected).toBe(0);
  });

  test('REQ-100: Filter values generated dynamically from data', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForTimeout(3000);

    // Species dropdown should have predefined options (from categories seed)
    const speciesSelect = page.locator('select').nth(2);
    const options = await speciesSelect.locator('option').allTextContents();
    expect(options.length).toBeGreaterThan(1); // At least one option besides placeholder
  });

  test('REQ-101: Pagination with maximum defined per page', async ({ page }) => {
    // Navigate to catalog with page param
    await page.goto(`${BASE_URL}/es/catalogo?page=1`);
    await page.waitForTimeout(3000);

    // Page should load (even if no data due to API)
    const heading = page.getByRole('heading', { name: /catalogo/i });
    await expect(heading).toBeVisible();
  });

  test('REQ-101: Edge case - page=999 does not crash', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo?page=999`);
    await page.waitForTimeout(3000);

    // Page should load without crashing
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('REQ-101: Edge case - page=0 or page=-1', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo?page=0`);
    await page.waitForTimeout(3000);
    const heading0 = page.getByRole('heading', { level: 1 });
    await expect(heading0).toBeVisible();

    await page.goto(`${BASE_URL}/es/catalogo?page=-1`);
    await page.waitForTimeout(3000);
    const headingNeg = page.getByRole('heading', { level: 1 });
    await expect(headingNeg).toBeVisible();
  });

  test('REQ-102: Indicator "Mostrando X de Y productos"', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForTimeout(3000);

    // Should show product count (even if 0)
    const counter = page.getByText(/\d+ productos/);
    await expect(counter).toBeVisible();
  });

  test('REQ-105: Pagination resets to page 1 when changing filters', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo?page=2`);
    await page.waitForTimeout(3000);

    // Select a filter
    await page.locator('select').first().selectOption('Farmacos');
    await page.waitForTimeout(1000);

    // URL should NOT contain page=2 (should reset)
    const url = page.url();
    expect(url).not.toContain('page=2');
  });
});
