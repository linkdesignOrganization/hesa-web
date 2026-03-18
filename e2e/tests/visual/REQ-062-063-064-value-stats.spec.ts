import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('REQ-062: 4 value stat blocks visible with key data', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/es`);
  await page.waitForSelector('.value-stat', { timeout: 10000 });

  const statCount = await page.evaluate(() => {
    return document.querySelectorAll('.value-stat').length;
  });

  expect(statCount).toBe(4);
});

test('REQ-063: Each stat has large number, icon, and descriptive text', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/es`);
  await page.waitForSelector('.value-stat', { timeout: 10000 });

  const stats = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.value-stat')).map(s => {
      const num = s.querySelector('.value-stat__number');
      const icon = s.querySelector('.value-stat__icon');
      const label = s.querySelector('.value-stat__label');
      const numStyles = num ? getComputedStyle(num) : null;
      const iconStyles = icon ? getComputedStyle(icon) : null;
      return {
        hasNumber: !!num,
        hasIcon: !!icon,
        hasLabel: !!label,
        numFontSize: numStyles?.fontSize,
        iconWidth: iconStyles?.width,
        iconHeight: iconStyles?.height,
        iconBgColor: iconStyles?.backgroundColor
      };
    });
  });

  for (const stat of stats) {
    expect(stat.hasNumber).toBe(true);
    expect(stat.hasIcon).toBe(true);
    expect(stat.hasLabel).toBe(true);
    expect(parseInt(stat.numFontSize!)).toBeGreaterThanOrEqual(40);
    expect(stat.iconWidth).toBe('56px');
    expect(stat.iconHeight).toBe('56px');
  }
});

test('REQ-064: Mobile value stats in 2x2 grid', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE_URL}/es`);
  await page.waitForSelector('.value-section__grid', { timeout: 10000 });

  const gridCols = await page.evaluate(() => {
    const grid = document.querySelector('.value-section__grid');
    if (!grid) return null;
    return getComputedStyle(grid).gridTemplateColumns;
  });

  expect(gridCols).toBeTruthy();
  const colCount = gridCols!.split(' ').length;
  expect(colCount).toBe(2);
});
