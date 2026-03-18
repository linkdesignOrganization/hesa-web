import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('REQ-054: Category blocks alternate text/image position (left-right, right-left)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/es`);
  await page.waitForSelector('.cat-block', { timeout: 10000 });

  const alternation = await page.evaluate(() => {
    const blocks = document.querySelectorAll('.cat-block');
    return Array.from(blocks).map(b => ({
      classes: b.className,
      hasImgLeft: b.classList.contains('cat-block--img-left')
    }));
  });

  expect(alternation.length).toBe(3);
  // Block 1: text left, image right (no img-left class)
  expect(alternation[0].hasImgLeft).toBe(false);
  // Block 2: image left, text right (has img-left class)
  expect(alternation[1].hasImgLeft).toBe(true);
  // Block 3: text left, image right (no img-left class)
  expect(alternation[2].hasImgLeft).toBe(false);
});
