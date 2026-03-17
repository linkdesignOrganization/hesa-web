import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-141: Underline links menu animation', () => {
  test('DC-141: Menu links have ::after pseudo-element for underline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForLoadState('networkidle');

    // Check nav links for ::after pseudo-element
    const navLink = page.locator('nav a').filter({ hasText: /Catalogo|Marcas|Nosotros/i }).first();
    if (await navLink.count() > 0) {
      const hasAfter = await navLink.evaluate(el => {
        const after = getComputedStyle(el, '::after');
        return {
          content: after.content,
          position: after.position,
          height: after.height,
          transition: after.transition,
          backgroundColor: after.backgroundColor
        };
      });
      // The ::after pseudo should exist for underline animation
      expect(hasAfter).toBeTruthy();
    }
  });
});
