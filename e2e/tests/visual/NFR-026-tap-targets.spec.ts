import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('NFR-026: Tap targets >= 44x44px en mobile', () => {
  test('WhatsApp FAB cumple minimo 44px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/es/`);
    await page.waitForTimeout(2000);

    const fabSize = await page.evaluate(() => {
      const fab = document.querySelector('[class*="whatsapp"], [class*="fab"]');
      if (!fab) return null;
      return { width: fab.offsetWidth, height: fab.offsetHeight };
    });

    expect(fabSize).not.toBeNull();
    expect(fabSize!.width).toBeGreaterThanOrEqual(44);
    expect(fabSize!.height).toBeGreaterThanOrEqual(44);
  });

  test('majority of interactive elements meet 44px minimum', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/es/`);
    await page.waitForTimeout(2000);

    const tapInfo = await page.evaluate(() => {
      const targets = document.querySelectorAll('button, a[href], input, select, textarea');
      let total = 0;
      let passing = 0;
      targets.forEach(el => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.offsetWidth > 0 && htmlEl.offsetHeight > 0) {
          total++;
          if (htmlEl.offsetWidth >= 44 && htmlEl.offsetHeight >= 44) {
            passing++;
          }
        }
      });
      return { total, passing, percentage: total > 0 ? (passing / total) * 100 : 0 };
    });

    // At least 80% of interactive elements should meet 44px minimum
    expect(tapInfo.percentage).toBeGreaterThanOrEqual(80);
  });
});
