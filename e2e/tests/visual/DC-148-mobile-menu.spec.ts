import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-148: Mobile menu slide-in', () => {
  test('hamburger menu present in mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/es/`);
    await page.waitForTimeout(2000);

    const menuInfo = await page.evaluate(() => {
      const hamburger = document.querySelector('button[aria-label*="menu"], button[class*="hamburger"], button[class*="menu-toggle"]');
      if (!hamburger) {
        // Try by text content
        const buttons = Array.from(document.querySelectorAll('button'));
        const menuBtn = buttons.find(b => b.textContent?.includes('menu') || b.getAttribute('aria-label')?.includes('menu'));
        return { hasHamburger: !!menuBtn, buttonText: menuBtn?.textContent?.trim() || menuBtn?.getAttribute('aria-label') };
      }
      return { hasHamburger: true, buttonText: hamburger.textContent?.trim() || hamburger.getAttribute('aria-label') };
    });

    expect(menuInfo.hasHamburger).toBeTruthy();
  });

  test('mobile menu is a dialog with navigation links', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/es/`);
    await page.waitForTimeout(2000);

    const dialogExists = await page.evaluate(() => {
      const dialog = document.querySelector('dialog, [role="dialog"]');
      if (!dialog) return false;
      const links = dialog.querySelectorAll('a[href]');
      return links.length >= 5; // At least main navigation links
    });

    expect(dialogExists).toBeTruthy();
  });
});
