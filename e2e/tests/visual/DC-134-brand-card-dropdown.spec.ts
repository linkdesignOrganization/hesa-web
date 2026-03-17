import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-134: Brand cards with contextual menu in /admin/marcas', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/marcas`);
    await page.waitForSelector('h1:has-text("Marcas")', { timeout: 10000 });
  });

  test('DC-134: Each brand card has a three-dot menu button', async ({ page }) => {
    // Verify at least one "Opciones para" button exists
    const optionsButtons = page.locator('button[aria-label^="Opciones para"]');
    const count = await optionsButtons.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('DC-134: Clicking three-dot menu opens dropdown with Editar, Ver productos, Eliminar', async ({ page }) => {
    // Click the first brand's options button
    const firstOptionsBtn = page.locator('button[aria-label^="Opciones para"]').first();
    await firstOptionsBtn.click();

    // Verify dropdown menu appears
    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible();

    // Verify it has exactly 3 menu items
    const menuItems = menu.locator('[role="menuitem"]');
    const itemCount = await menuItems.count();
    expect(itemCount).toBe(3);

    // Verify menu item texts
    await expect(menuItems.nth(0)).toContainText('Editar');
    await expect(menuItems.nth(1)).toContainText('Ver productos');
    await expect(menuItems.nth(2)).toContainText('Eliminar');

    // Verify Eliminar is styled in red (#EF4444)
    const eliminarColor = await menuItems.nth(2).evaluate(el => getComputedStyle(el).color);
    expect(eliminarColor).toBe('rgb(239, 68, 68)');

    // Verify menu styling
    const menuBg = await menu.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(menuBg).toBe('rgb(255, 255, 255)');

    const menuRadius = await menu.evaluate(el => getComputedStyle(el).borderRadius);
    expect(menuRadius).toBe('8px');

    const menuShadow = await menu.evaluate(el => getComputedStyle(el).boxShadow);
    expect(menuShadow).not.toBe('none');

    // Verify button is in expanded state
    await expect(firstOptionsBtn).toHaveAttribute('aria-expanded', 'true');
  });

  test('DC-134: All brand cards have the options button', async ({ page }) => {
    // Count brand headings (h3)
    const brandHeadings = page.locator('.admin__content h3, [class*="brand"] h3');
    const brandCount = await brandHeadings.count();

    // Count options buttons
    const optionsButtons = page.locator('button[aria-label^="Opciones para"]');
    const btnCount = await optionsButtons.count();

    // Each brand card should have an options button
    expect(btnCount).toBe(brandCount);
  });
});
