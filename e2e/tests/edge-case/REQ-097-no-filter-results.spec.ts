import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-097: Filters with no results show message and clear button', () => {
  test('No results message appears when filters yield zero products', async ({ page }) => {
    // Mindray brand + Porcinos species = 0 results
    await page.goto(`${BASE_URL}/es/catalogo?brand=69ba2ddb999a9dca1b0b412c&species=Porcinos`);
    await page.waitForURL('**/catalogo**');

    // Verify "0 productos" count
    await expect(page.locator('text=0 productos')).toBeVisible({ timeout: 10000 });

    // Verify empty state message
    await expect(page.locator('text=/[Nn]o se encontraron productos con estos filtros/')).toBeVisible({ timeout: 10000 });
  });

  test('Suggestion to clear filters is visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo?brand=69ba2ddb999a9dca1b0b412c&species=Porcinos`);
    await page.waitForURL('**/catalogo**');

    // Verify suggestion text
    await expect(page.locator('text=/[Ll]impiar.*filtros/')).toBeVisible({ timeout: 10000 });
  });

  test('Clear filters button restores all products', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo?brand=69ba2ddb999a9dca1b0b412c&species=Porcinos`);
    await page.waitForURL('**/catalogo**');

    // Verify 0 products initially
    await expect(page.locator('text=0 productos')).toBeVisible({ timeout: 10000 });

    // Click "Limpiar filtros"
    const clearBtn = page.locator('button:has-text("Limpiar filtros")');
    await expect(clearBtn).toBeVisible({ timeout: 10000 });
    await clearBtn.click();

    // Wait for products to appear
    await page.waitForURL('**/catalogo');
    await expect(page.locator('text=/\\d+ productos/')).toBeVisible({ timeout: 10000 });

    // Should have more than 0 products
    const countText = await page.locator('text=/\\d+ productos/').textContent();
    const count = parseInt(countText?.match(/(\d+)/)?.[1] || '0', 10);
    expect(count).toBeGreaterThan(0);
  });

  test('Active filter chips show with remove buttons', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo?brand=69ba2ddb999a9dca1b0b412c&species=Porcinos`);
    await page.waitForURL('**/catalogo**');

    // Verify filter chips are visible
    await expect(page.locator('text=Mindray')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Porcinos')).toBeVisible({ timeout: 10000 });

    // Verify remove buttons exist on chips
    const removeButtons = page.locator('button[aria-label*="Remover filtro"]');
    await expect(removeButtons.first()).toBeVisible({ timeout: 5000 });
  });
});
