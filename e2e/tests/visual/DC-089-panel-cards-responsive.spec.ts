import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-089: Panel cards responsive', () => {
  test('product cards render as grid with radius 16px in admin', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos`);
    await page.waitForSelector('.admin__sidebar', { timeout: 5000 });

    const cardInfo = await page.evaluate(() => {
      const cards = document.querySelectorAll('.product-card, [class*="product-card"]');
      if (cards.length === 0) return null;
      const cs = getComputedStyle(cards[0]);
      return {
        count: cards.length,
        borderRadius: cs.borderRadius,
        bgColor: cs.backgroundColor,
        boxShadow: cs.boxShadow
      };
    });

    expect(cardInfo).not.toBeNull();
    expect(cardInfo!.count).toBeGreaterThan(0);
    expect(cardInfo!.borderRadius).toBe('16px');
    expect(cardInfo!.bgColor).toBe('rgb(255, 255, 255)');
    expect(cardInfo!.boxShadow).toContain('0px 1px 3px');
  });
});
