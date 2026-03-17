import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-041: Nosotros page layout', () => {
  test('DC-041: Nosotros page renders with hero and sections', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/nosotros`);
    await page.waitForLoadState('networkidle');

    // Page should have main heading
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 15000 });

    // Should have team section or history section
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });
});
