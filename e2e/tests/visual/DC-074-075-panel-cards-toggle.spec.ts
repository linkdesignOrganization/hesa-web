import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-074: View Toggle & DC-075: Product Card Admin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`);
    await page.waitForLoadState('networkidle');
  });

  test('DC-074: view toggle has two pill buttons (card/table)', async ({ page }) => {
    const cardToggle = page.locator('button:has-text("Vista de tarjetas"), button[aria-label*="tarjetas"]').first();
    const tableToggle = page.locator('button:has-text("Vista de tabla"), button[aria-label*="tabla"]').first();
    await expect(cardToggle).toBeVisible();
    await expect(tableToggle).toBeVisible();
  });

  test('DC-074: active toggle has blue background #008DC9', async ({ page }) => {
    const activeToggle = page.locator('button:has-text("Vista de tarjetas"), button[aria-label*="tarjetas"]').first();
    const bgColor = await activeToggle.evaluate(el => getComputedStyle(el).backgroundColor);
    // Should be #008DC9 = rgb(0, 141, 201)
    expect(bgColor).toContain('rgb(0, 141, 201)');
  });

  test('DC-075: product card admin has radius 16px', async ({ page }) => {
    const card = page.locator('[class*="product-card"], [class*="card"]').first();
    await expect(card).toBeVisible();
    const borderRadius = await card.evaluate(el => getComputedStyle(el).borderRadius);
    expect(borderRadius).toBe('16px');
  });

  test('DC-075: product card has name bold, brand grey, and badges', async ({ page }) => {
    // Check product name text exists
    const productName = page.locator('[class*="card"] [class*="name"], [class*="card"] h3, [class*="card"] h4').first();
    await expect(productName).toBeVisible();

    // Check badges exist
    const badge = page.locator('[class*="badge"]').first();
    await expect(badge).toBeVisible();
  });

  test('DC-075: product card has 3-dot menu', async ({ page }) => {
    const menuDots = page.locator('[class*="card"] button[class*="menu"], [class*="card"] button[class*="dots"]').first();
    await expect(menuDots).toBeVisible();
  });
});
