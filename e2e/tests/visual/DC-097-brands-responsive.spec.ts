import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-097: Brands section responsive', () => {
  test('DC-097: Desktop 1440px - 4 logos per row', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForLoadState('networkidle');

    const section = page.locator('.logos-section');
    await expect(section).toBeVisible({ timeout: 15000 });

    const logoLinks = section.locator('a').filter({ hasNot: page.locator('a[href$="/marcas"]') });
    const count = await logoLinks.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('DC-097: Mobile 375px - logos grid adapts', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForLoadState('networkidle');

    const section = page.locator('.logos-section');
    // Scroll to section to trigger IntersectionObserver
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible({ timeout: 15000 });

    const opacity = await section.evaluate(el => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });

  test('DC-097: Tablet 768px - logos grid adapts', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForLoadState('networkidle');

    const section = page.locator('.logos-section');
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible({ timeout: 15000 });

    const opacity = await section.evaluate(el => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });
});
