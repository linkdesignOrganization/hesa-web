import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('NFR-021: WCAG AA Accessibility', () => {
  test('NFR-021: ARIA landmarks present on home page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForLoadState('networkidle');

    // Navigation landmark
    const nav = page.locator('nav[aria-label], [role="navigation"]');
    expect(await nav.count()).toBeGreaterThan(0);

    // Footer/contentinfo
    const footer = page.locator('[role="contentinfo"], footer');
    await expect(footer.first()).toBeAttached();

    // Search
    const search = page.locator('[role="search"], search');
    expect(await search.count()).toBeGreaterThan(0);
  });

  test('NFR-021: Focus visible on interactive elements', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForLoadState('networkidle');

    // Tab to first interactive element
    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);

    // Check that focused element has visible outline
    const focusStyle = await page.evaluate(() => {
      const focused = document.activeElement;
      if (!focused) return null;
      const s = getComputedStyle(focused);
      return {
        outline: s.outline,
        outlineWidth: s.outlineWidth,
        outlineColor: s.outlineColor,
        boxShadow: s.boxShadow
      };
    });

    if (focusStyle) {
      // Should have visible focus indicator (outline or box-shadow)
      const hasOutline = focusStyle.outlineWidth !== '0px';
      const hasShadow = focusStyle.boxShadow !== 'none';
      expect(hasOutline || hasShadow).toBe(true);
    }
  });

  test('NFR-021: Language attribute set on html', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForLoadState('networkidle');

    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBeTruthy();
    expect(['es', 'es-CR', 'es-ES']).toContain(lang.substring(0, 2) === 'es' ? lang.substring(0, 2) : lang);
  });
});
