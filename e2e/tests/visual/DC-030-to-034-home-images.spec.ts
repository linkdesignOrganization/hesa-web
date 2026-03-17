import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-030 to DC-034: Home images regression', () => {
  test('DC-030: Hero should have photographic background image, not SVG', async ({ page }) => {
    await page.goto(`${BASE}/es/`);
    await page.waitForSelector('.hero', { timeout: 5000 });

    const heroInfo = await page.evaluate(() => {
      const hero = document.querySelector('.hero');
      if (!hero) return null;
      const s = getComputedStyle(hero);
      return {
        bgImage: s.backgroundImage,
        hasSvgBg: s.backgroundImage?.includes('data:image/svg'),
        hasPhotoUrl: s.backgroundImage?.includes('http') && !s.backgroundImage?.includes('data:image/svg')
      };
    });

    expect(heroInfo).not.toBeNull();
    // This test documents the expected behavior -- currently FAILING
    // Hero should use a real photo URL, not an inline SVG
    expect(heroInfo!.hasPhotoUrl).toBeTruthy();
    expect(heroInfo!.hasSvgBg).toBeFalsy();
  });

  test('DC-032: Marcas Destacadas section should be visible (not opacity 0)', async ({ page }) => {
    await page.goto(`${BASE}/es/`);
    await page.waitForTimeout(2000);

    // Scroll to trigger Intersection Observer
    await page.evaluate(() => {
      const marcas = document.querySelector('.logos-section');
      if (marcas) marcas.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(1000);

    const marcasInfo = await page.evaluate(() => {
      const marcas = document.querySelector('.logos-section');
      if (!marcas) return null;
      return {
        opacity: getComputedStyle(marcas).opacity,
        isVisible: marcas.classList.contains('is-visible'),
        logoCount: marcas.querySelectorAll('.logos-section__logo').length
      };
    });

    expect(marcasInfo).not.toBeNull();
    expect(marcasInfo!.logoCount).toBeGreaterThanOrEqual(6);
    // This test documents the expected behavior -- currently FAILING
    expect(marcasInfo!.opacity).toBe('1');
    expect(marcasInfo!.isVisible).toBeTruthy();
  });

  test('DC-030: Hero text elements are correctly styled', async ({ page }) => {
    await page.goto(`${BASE}/es/`);
    await page.waitForSelector('.hero h1', { timeout: 5000 });

    const heroText = await page.evaluate(() => {
      const h1 = document.querySelector('.hero h1');
      const tag = document.querySelector('.hero__tag, .hero [class*="tag"]');
      if (!h1) return null;
      const h1s = getComputedStyle(h1);
      const tags = tag ? getComputedStyle(tag) : null;
      return {
        h1FontSize: h1s.fontSize,
        h1FontWeight: h1s.fontWeight,
        h1Color: h1s.color,
        h1LetterSpacing: h1s.letterSpacing,
        tagText: tag?.textContent?.trim(),
        tagColor: tags?.color,
        tagFontSize: tags?.fontSize
      };
    });

    expect(heroText).not.toBeNull();
    expect(heroText!.h1FontSize).toBe('56px');
    expect(heroText!.h1FontWeight).toBe('800');
    expect(heroText!.h1Color).toBe('rgb(255, 255, 255)');
    expect(heroText!.h1LetterSpacing).toBe('-1.12px');
    expect(heroText!.tagText).toBe('DESDE 1989');
    expect(heroText!.tagColor).toBe('rgb(80, 185, 42)');
    expect(heroText!.tagFontSize).toBe('13px');
  });
});
