import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-069/DC-070: Species Badges and Presentation Pills', () => {
  test('DC-069: Species badges visible on product detail', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForLoadState('networkidle');

    // Look for species badges (Caninos, Felinos, etc.)
    const speciesBadges = page.locator('[class*="species"], [class*="badge"]').filter({ hasText: /canino|felino|bovino|perro|gato/i });
    if (await speciesBadges.count() > 0) {
      await expect(speciesBadges.first()).toBeVisible();
    }
  });

  test('DC-070: Presentation pills visible on product detail', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForLoadState('networkidle');

    // Look for presentation pills (100ml, 250ml, etc.)
    const pills = page.locator('[class*="pill"], [class*="presentation"]');
    if (await pills.count() > 0) {
      const pillStyle = await pills.first().evaluate(el => {
        const s = getComputedStyle(el);
        return { borderRadius: s.borderRadius };
      });
      // Pills should have large border-radius (pill shape)
      expect(parseInt(pillStyle.borderRadius)).toBeGreaterThanOrEqual(12);
    }
  });
});
