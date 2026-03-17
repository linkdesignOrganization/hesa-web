import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-051: Footer', () => {

  test('DC-051: Footer background #005A85, text white', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const footer = await page.evaluate(() => {
      const el = document.querySelector('footer, .footer');
      if (!el) return null;
      const s = getComputedStyle(el);
      return { bg: s.backgroundColor, color: s.color };
    });
    expect(footer).not.toBeNull();
    expect(footer!.bg).toBe('rgb(0, 90, 133)');
    expect(footer!.color).toBe('rgb(255, 255, 255)');
  });

  test('BVC-040: Footer background is #005A85 with white text', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const footer = await page.evaluate(() => {
      const el = document.querySelector('footer, .footer');
      if (!el) return null;
      const s = getComputedStyle(el);
      return { bg: s.backgroundColor, color: s.color };
    });
    expect(footer!.bg).toBe('rgb(0, 90, 133)');
    expect(footer!.color).toBe('rgb(255, 255, 255)');
  });

  test('DC-051: Footer has 4 columns on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const headings = page.locator('footer h3, [role="contentinfo"] h3');
    await expect(headings).toHaveCount(3);
    // 4 columns: HESA logo column + Navegacion + Contacto + Redes Sociales
  });

  test('DC-086: Footer uses accordions on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es`);
    const accordionBtn = page.getByRole('button', { name: /Navegacion/ });
    await expect(accordionBtn).toBeVisible();
  });

  test('DC-051: Footer has copyright text', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const copyright = page.getByText(/HESA 2026/);
    await expect(copyright).toBeVisible();
  });

  test('BVC-039: Language selector in footer', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const langBtn = page.getByRole('button', { name: /English/i });
    await expect(langBtn).toBeVisible();
  });
});
