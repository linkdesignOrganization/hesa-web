import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-013: Escala tipografica mobile', () => {
  test('hero headline es 32px/700 en mobile 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/es/`);
    await page.waitForSelector('.hero h1', { timeout: 5000 });

    const h1Styles = await page.evaluate(() => {
      const h1 = document.querySelector('.hero h1');
      if (!h1) return null;
      const s = getComputedStyle(h1);
      return { fontSize: s.fontSize, fontWeight: s.fontWeight };
    });

    expect(h1Styles).not.toBeNull();
    expect(h1Styles!.fontSize).toBe('32px');
    expect(h1Styles!.fontWeight).toBe('700');
  });
});
