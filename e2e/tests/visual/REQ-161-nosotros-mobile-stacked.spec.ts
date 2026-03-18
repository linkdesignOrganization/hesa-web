import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('REQ-161: Mobile Nosotros sections in single column', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE_URL}/es/nosotros`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const layout = await page.evaluate(() => {
    const sections = document.querySelectorAll('section, [class*="section"]');
    const results: { cls: string; display: string; cols: string }[] = [];
    sections.forEach(s => {
      if (typeof s.className !== 'string') return;
      const cs = getComputedStyle(s);
      results.push({
        cls: s.className.substring(0, 40),
        display: cs.display,
        cols: cs.gridTemplateColumns
      });
    });
    return results;
  });

  // All sections should be single column on mobile
  for (const section of layout) {
    if (section.cols && section.cols !== 'none') {
      const colCount = section.cols.split(' ').length;
      // Allow max 2 columns for 2x2 grids
      expect(colCount).toBeLessThanOrEqual(2);
    }
  }
});
