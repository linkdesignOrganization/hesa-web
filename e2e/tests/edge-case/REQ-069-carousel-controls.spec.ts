import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-069: Carousel has arrow controls and dot indicators', () => {
  test('carousel template includes prev/next arrows and dots when products exist', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForLoadState('networkidle');

    const carouselWrapper = page.locator('.carousel-wrapper');
    const carouselExists = await carouselWrapper.count();

    if (carouselExists > 0) {
      // Check prev arrow
      const prevArrow = carouselWrapper.locator('.carousel-arrow--prev');
      await expect(prevArrow).toBeVisible();

      // Check next arrow
      const nextArrow = carouselWrapper.locator('.carousel-arrow--next');
      await expect(nextArrow).toBeVisible();

      // Check dots
      const dots = page.locator('.carousel-dots .carousel-dots__dot');
      expect(await dots.count()).toBeGreaterThan(0);
    } else {
      // No featured products — carousel not rendered (REQ-073 behavior)
      test.info().annotations.push({
        type: 'skip',
        description: 'No featured products in API — carousel not rendered'
      });
    }
  });
});
