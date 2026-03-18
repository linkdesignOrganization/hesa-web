import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('REQ-055: Mobile category blocks are stacked vertically (1 column)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE_URL}/es`);
  await page.waitForSelector('.cat-block', { timeout: 10000 });

  const mobileLayout = await page.evaluate(() => {
    const block = document.querySelector('.cat-block');
    if (!block) return null;
    const styles = getComputedStyle(block);
    return {
      gridCols: styles.gridTemplateColumns,
      display: styles.display,
      padding: styles.padding,
      borderRadius: styles.borderRadius
    };
  });

  expect(mobileLayout).toBeTruthy();
  // Should be single column on mobile
  const colCount = mobileLayout!.gridCols.split(' ').length;
  expect(colCount).toBe(1);
});
