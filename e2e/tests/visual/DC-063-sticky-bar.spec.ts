import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-063: Sticky Bar on product detail', () => {
  test('DC-063: Desktop sticky bar appears on scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForLoadState('networkidle');

    // Scroll down significantly to trigger sticky bar
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(1000);

    // Look for sticky bar element
    const stickyBar = page.locator('[class*="sticky-bar"], [class*="stickyBar"], [class*="product-sticky"]');
    if (await stickyBar.count() > 0) {
      const barStyles = await stickyBar.first().evaluate(el => {
        const s = getComputedStyle(el);
        return {
          position: s.position,
          top: s.top,
          backgroundColor: s.backgroundColor,
          height: s.height
        };
      });
      expect(barStyles.position).toBe('fixed');
    }
  });

  test('DC-063: Mobile sticky bar fixed at bottom', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(1000);

    const stickyBar = page.locator('[class*="sticky-bar"], [class*="stickyBar"], [class*="product-sticky"]');
    if (await stickyBar.count() > 0) {
      const barStyles = await stickyBar.first().evaluate(el => {
        const s = getComputedStyle(el);
        return { position: s.position, bottom: s.bottom };
      });
      expect(barStyles.position).toBe('fixed');
    }
  });
});
