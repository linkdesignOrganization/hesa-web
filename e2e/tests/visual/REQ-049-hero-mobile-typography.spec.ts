import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('REQ-049: Mobile hero adapts typography (32px mobile vs 56px desktop)', async ({ page }) => {
  // Desktop check
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/es`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const desktopSize = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? getComputedStyle(h1).fontSize : null;
  });
  expect(desktopSize).toBe('56px');

  // Mobile check
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE_URL}/es`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const mobileSize = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? getComputedStyle(h1).fontSize : null;
  });
  expect(mobileSize).toBe('32px');
});
