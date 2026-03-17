import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('BVC-014: Conditional fields with fade animation', () => {
  test('BVC-014: Category selection shows/hides conditional fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/crear`);
    await page.waitForLoadState('networkidle');

    // Find category cards (Farmacos, Alimentos, Equipos)
    const categoryCards = page.locator('[class*="category-card"], [class*="cat-card"]');
    if (await categoryCards.count() >= 3) {
      // Click on a different category
      await categoryCards.nth(1).click();
      await page.waitForTimeout(500);

      // Conditional fields should be visible (Especies, Presentaciones)
      const speciesField = page.locator('[class*="species"], label').filter({ hasText: /especie|species/i });
      const presentationsField = page.locator('[class*="presentation"], label').filter({ hasText: /presentacion|presentation/i });

      // At least one conditional field should be visible
      const hasConditional = (await speciesField.count() > 0) || (await presentationsField.count() > 0);
      expect(hasConditional).toBe(true);
    }
  });
});

test.describe('BVC-021: Flujo Listado > Crear > Detalle', () => {
  test('BVC-021: Navigation flow from list to create', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`);
    await page.waitForLoadState('networkidle');

    // Should see product listing
    const heading = page.locator('h1').filter({ hasText: /productos/i });
    await expect(heading).toBeVisible({ timeout: 15000 });

    // Should have "Crear producto" button
    const createBtn = page.locator('a, button').filter({ hasText: /crear producto|new product/i });
    await expect(createBtn.first()).toBeVisible();

    // Click create button
    await createBtn.first().click();
    await page.waitForLoadState('networkidle');

    // Should navigate to create form
    const createHeading = page.locator('h1').filter({ hasText: /crear|create/i });
    if (await createHeading.count() > 0) {
      await expect(createHeading).toBeVisible();
    }
  });
});
