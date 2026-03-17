import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-035: CTA fabricantes banner', () => {
  test('background #008DC9, padding 80px, titulo 36px Bold blanco', async ({ page }) => {
    await page.goto(`${BASE}/es/`);

    const ctaStyles = await page.evaluate(() => {
      const allH2 = Array.from(document.querySelectorAll('h2'));
      const ctaH2 = allH2.find(h => h.textContent?.includes('socio'));
      if (!ctaH2) return null;
      const section = ctaH2.closest('section') || ctaH2.parentElement;
      if (!section) return null;
      const ss = getComputedStyle(section);
      const h2s = getComputedStyle(ctaH2);
      return {
        bgColor: ss.backgroundColor,
        paddingTop: ss.paddingTop,
        titleFontSize: h2s.fontSize,
        titleFontWeight: h2s.fontWeight,
        titleColor: h2s.color
      };
    });

    expect(ctaStyles).not.toBeNull();
    expect(ctaStyles!.bgColor).toBe('rgb(0, 141, 201)');
    expect(ctaStyles!.paddingTop).toBe('80px');
    expect(ctaStyles!.titleFontSize).toBe('36px');
    expect(ctaStyles!.titleFontWeight).toBe('700');
    expect(ctaStyles!.titleColor).toBe('rgb(255, 255, 255)');
  });
});
