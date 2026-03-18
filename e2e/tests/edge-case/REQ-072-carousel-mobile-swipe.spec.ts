import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-072: Carousel mobile swipe behavior', () => {
  test('carousel uses horizontal scroll with snap on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es`);
    await page.waitForLoadState('networkidle');

    // The featured-grid should use overflow-x: auto and scroll-snap on mobile
    // When products exist, verify the carousel container allows horizontal scrolling
    const carouselExists = await page.locator('.featured-grid--carousel').count();
    if (carouselExists > 0) {
      const overflowX = await page.locator('.featured-grid--carousel').evaluate(
        (el) => window.getComputedStyle(el).overflowX
      );
      expect(overflowX).toBe('auto');

      const scrollSnap = await page.locator('.featured-grid--carousel').evaluate(
        (el) => window.getComputedStyle(el).scrollSnapType
      );
      expect(scrollSnap).toContain('x');
    }
  });

  test('carousel arrows are hidden on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es`);
    await page.waitForLoadState('networkidle');

    const arrowExists = await page.locator('.carousel-arrow').count();
    if (arrowExists > 0) {
      const arrowDisplay = await page.locator('.carousel-arrow').first().evaluate(
        (el) => window.getComputedStyle(el).display
      );
      expect(arrowDisplay).toBe('none');
    }
  });
});
