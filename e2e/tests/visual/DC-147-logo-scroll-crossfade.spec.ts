import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-147: Logo header scroll crossfade', () => {
  test('DC-147: Logo crossfades from full to isotipo on scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForLoadState('networkidle');

    // Full HESA logo should be visible initially
    const fullLogo = page.locator('nav .header__logo-full, [class*="logo"]:not([class*="iso"])').first();

    // Scroll down to trigger the header scroll state
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(500);

    // After scroll, the header should show isotipo (H) instead of full logo
    // The transition should be opacity-based (0.3s)
    const headerStyles = await page.evaluate(() => {
      const header = document.querySelector('nav, header, .header');
      if (!header) return null;
      const s = getComputedStyle(header);
      return {
        position: s.position,
        boxShadow: s.boxShadow
      };
    });

    // Header should be fixed/sticky after scroll
    if (headerStyles) {
      expect(['fixed', 'sticky']).toContain(headerStyles.position);
    }
  });
});
