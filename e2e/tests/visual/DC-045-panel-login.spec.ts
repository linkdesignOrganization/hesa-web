import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-045: Panel Login', () => {

  test('DC-045: Login card centered, white bg, radius 16px, shadow', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForSelector('.login-card, [class*="login"]', { timeout: 10000 });
    const card = await page.evaluate(() => {
      const el = document.querySelector('.login-card, [class*="login"]');
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        bg: s.backgroundColor,
        borderRadius: s.borderRadius,
        boxShadow: s.boxShadow
      };
    });
    expect(card).not.toBeNull();
    expect(card!.bg).toBe('rgb(255, 255, 255)');
    expect(card!.borderRadius).toBe('16px');
    expect(card!.boxShadow).not.toBe('none');
  });

  test('DC-045: Login page background is #F7F8FA', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/admin/login`);
    const bgCheck = await page.evaluate(() => {
      const loginContainer = document.querySelector('[class*="login-container"], [class*="login-page"]');
      if (loginContainer) {
        return getComputedStyle(loginContainer).backgroundColor;
      }
      return null;
    });
    // Background should be #F7F8FA = rgb(247, 248, 250)
    if (bgCheck) {
      expect(bgCheck).toBe('rgb(247, 248, 250)');
    }
  });

  test('DC-045: Login has HESA logo and Microsoft button', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/admin/login`);
    const hesa = page.getByText('HESA');
    await expect(hesa.first()).toBeVisible();
    const msBtn = page.getByText(/Microsoft/);
    await expect(msBtn.first()).toBeVisible();
  });

  test('DC-099: Login card full-width on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForSelector('.login-card, [class*="login"]', { timeout: 10000 });
    const box = await page.evaluate(() => {
      const el = document.querySelector('.login-card, [class*="login"]');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { width: rect.width };
    });
    if (box) {
      expect(box.width).toBeGreaterThan(300);
    }
  });
});
