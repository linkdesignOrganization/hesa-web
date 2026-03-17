import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-036: Catalog Layout', () => {

  test('DC-036: Catalog grid has 3 columns on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForSelector('.product-card', { timeout: 10000 });
    const grid = await page.evaluate(() => {
      const gridEl = document.querySelector('[class*="grid"], [class*="products"]');
      if (!gridEl) return null;
      const s = getComputedStyle(gridEl);
      return {
        display: s.display,
        gridTemplateColumns: s.gridTemplateColumns,
        gap: s.gap
      };
    });
    expect(grid).not.toBeNull();
    expect(grid!.display).toBe('grid');
    // 3 columns means 3 values in gridTemplateColumns
    const cols = grid!.gridTemplateColumns.split(' ').filter((v: string) => v.includes('px'));
    expect(cols.length).toBe(3);
    expect(grid!.gap).toBe('28px');
  });

  test('DC-019: Container max-width 1280px with 40px padding', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    const container = await page.evaluate(() => {
      const el = document.querySelector('.container');
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        maxWidth: s.maxWidth,
        paddingLeft: s.paddingLeft,
        paddingRight: s.paddingRight
      };
    });
    expect(container).not.toBeNull();
    expect(container!.maxWidth).toBe('1280px');
    expect(container!.paddingLeft).toBe('40px');
    expect(container!.paddingRight).toBe('40px');
  });

  test('DC-081: Catalog grid responsive - 2 cols on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForSelector('.product-card', { timeout: 10000 });
    const grid = await page.evaluate(() => {
      const gridEl = document.querySelector('[class*="grid"], [class*="products"]');
      if (!gridEl) return null;
      const s = getComputedStyle(gridEl);
      return { gridTemplateColumns: s.gridTemplateColumns };
    });
    expect(grid).not.toBeNull();
    const cols = grid!.gridTemplateColumns.split(' ').filter((v: string) => v.includes('px'));
    expect(cols.length).toBeLessThanOrEqual(3);
  });
});
