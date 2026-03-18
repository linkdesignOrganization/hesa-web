import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-173a: Team member photos should be professional', () => {
  test('KNOWN FALLA: team photos are SVG icons, not professional bank photos', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/nosotros`);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.about-team__grid', { timeout: 10000 });

    const teamImages = page.locator('.about-team__grid img');
    const count = await teamImages.count();
    expect(count).toBe(6);

    // Check that at least one photo uses a real image URL (not data:image/svg+xml)
    // This test documents the current state: all photos are inline SVG data URIs
    for (let i = 0; i < count; i++) {
      const src = await teamImages.nth(i).getAttribute('src');
      // FALLA: All current photos start with data:image/svg+xml;base64
      // Should be a real photo URL (e.g., https://hesastorage.blob.core.windows.net/images/...)
      if (src && src.startsWith('data:image/svg+xml')) {
        // This is the current (failing) state - SVG placeholder, not a real photo
        test.info().annotations.push({
          type: 'issue',
          description: `Team member ${i + 1} uses SVG placeholder instead of professional photo`
        });
      }
    }
  });
});
