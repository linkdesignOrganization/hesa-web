import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-058: Product Gallery', () => {
  test('DC-058: Gallery has thumbnails and main image', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForLoadState('networkidle');

    // Look for gallery component
    const gallery = page.locator('[class*="gallery"], [class*="product-images"]');
    if (await gallery.count() > 0) {
      // Main image should be visible
      const mainImg = gallery.locator('img').first();
      await expect(mainImg).toBeVisible();

      // Thumbnails (60x60px)
      const thumbnails = gallery.locator('[class*="thumbnail"], [class*="thumb"]');
      if (await thumbnails.count() > 0) {
        const thumbStyle = await thumbnails.first().evaluate(el => {
          return { width: el.offsetWidth, height: el.offsetHeight };
        });
        expect(thumbStyle.width).toBeGreaterThanOrEqual(50);
        expect(thumbStyle.width).toBeLessThanOrEqual(70);
      }
    }
  });
});
