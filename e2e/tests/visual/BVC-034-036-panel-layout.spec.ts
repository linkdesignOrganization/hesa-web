import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('BVC-034 & BVC-036: Panel layout computed styles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`);
    await page.waitForLoadState('networkidle');
  });

  test('BVC-034: sidebar width ~260-280px', async ({ page }) => {
    const sidebar = page.locator('[class*="sidebar"], aside, nav[aria-label*="Panel"]').first();
    await expect(sidebar).toBeVisible();
    const width = await sidebar.evaluate(el => getComputedStyle(el).width);
    const widthNum = parseInt(width);
    expect(widthNum).toBeGreaterThanOrEqual(260);
    expect(widthNum).toBeLessThanOrEqual(280);
  });

  test('BVC-034: sidebar background white', async ({ page }) => {
    const sidebar = page.locator('[class*="sidebar"], aside, nav[aria-label*="Panel"]').first();
    const bg = await sidebar.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(255, 255, 255)');
  });

  test('BVC-034: sidebar has right border', async ({ page }) => {
    const sidebar = page.locator('[class*="sidebar"], aside, nav[aria-label*="Panel"]').first();
    const borderRight = await sidebar.evaluate(el => getComputedStyle(el).borderRight);
    expect(borderRight).toContain('1px');
    expect(borderRight).toContain('solid');
  });

  test('BVC-036: content area background #F7F8FA', async ({ page }) => {
    const content = page.locator('[class*="content"], [class*="main-content"]').first();
    await expect(content).toBeVisible();
    const bg = await content.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(247, 248, 250)');
  });

  test('BVC-036: content area padding 32px desktop', async ({ page }) => {
    const content = page.locator('[class*="content"], [class*="main-content"]').first();
    const padding = await content.evaluate(el => getComputedStyle(el).padding);
    expect(padding).toBe('32px');
  });
});
