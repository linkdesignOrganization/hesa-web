import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-025: WhatsApp FAB touch target >= 44x44px on mobile', () => {
  test('FAB dimensions are at least 44x44px at mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es`);
    await page.waitForTimeout(3000);

    const fab = page.locator('.whatsapp-fab');
    await expect(fab).toBeVisible();

    const box = await fab.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('FAB dimensions are at least 44x44px at tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/es`);
    await page.waitForTimeout(3000);

    const fab = page.locator('.whatsapp-fab');
    await expect(fab).toBeVisible();

    const box = await fab.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('FAB dimensions are at least 44x44px at desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    await page.waitForTimeout(3000);

    const fab = page.locator('.whatsapp-fab');
    await expect(fab).toBeVisible();

    const box = await fab.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('FAB CSS defines 56x56px at all breakpoints', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es`);
    await page.waitForTimeout(3000);

    const fabDims = await page.evaluate(() => {
      const fab = document.querySelector('.whatsapp-fab');
      if (!fab) return null;
      const styles = getComputedStyle(fab);
      return {
        width: styles.width,
        height: styles.height,
      };
    });

    expect(fabDims).not.toBeNull();
    if (fabDims) {
      expect(parseInt(fabDims.width)).toBe(56);
      expect(parseInt(fabDims.height)).toBe(56);
    }
  });
});
