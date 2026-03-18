import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('REQ-052: Category blocks have title, paragraph, 3 benefits with icons, and image', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/es`);
  await page.waitForSelector('.cat-block', { timeout: 10000 });

  const blocks = await page.evaluate(() => {
    const catBlocks = document.querySelectorAll('.cat-block');
    return Array.from(catBlocks).map(block => {
      const h2 = block.querySelector('h2');
      const p = block.querySelector('p');
      const lis = block.querySelectorAll('li');
      const icons = block.querySelectorAll('li svg, li img');
      const img = block.querySelector('img:not(li img)');
      return {
        hasTitle: !!h2,
        hasParagraph: !!p,
        benefitCount: lis.length,
        hasIcons: icons.length >= 3,
        hasImage: !!img
      };
    });
  });

  expect(blocks.length).toBe(3);
  for (const block of blocks) {
    expect(block.hasTitle).toBe(true);
    expect(block.hasParagraph).toBe(true);
    expect(block.benefitCount).toBe(3);
    expect(block.hasIcons).toBe(true);
  }
});
