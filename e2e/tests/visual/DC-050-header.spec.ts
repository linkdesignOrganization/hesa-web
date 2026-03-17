import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-050: Header (Navbar)', () => {

  test('DC-050: Header height 70px, white background, fixed position, z-index 200', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const header = await page.evaluate(() => {
      const el = document.querySelector('.header');
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        height: s.height,
        bg: s.backgroundColor,
        position: s.position,
        zIndex: s.zIndex
      };
    });
    expect(header).not.toBeNull();
    expect(header!.height).toBe('70px');
    expect(header!.bg).toBe('rgb(255, 255, 255)');
    expect(header!.position).toBe('fixed');
    expect(header!.zIndex).toBe('200');
  });

  test('DC-080: Header collapses to hamburger below 1024px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es`);
    const hamburger = page.getByRole('button', { name: 'Abrir menu' });
    await expect(hamburger).toBeVisible();
  });

  test('DC-050: Header has HESA logo linked to home', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const logo = page.getByRole('link', { name: /HESA.*inicio/i });
    await expect(logo).toBeVisible();
    const href = await logo.getAttribute('href');
    expect(href).toBe('/es');
  });

  test('DC-050: Header has search button', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const searchBtn = page.getByRole('button', { name: /buscar/i });
    await expect(searchBtn).toBeVisible();
  });

  test('DC-068: Language selector visible in header', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const langSelector = page.getByRole('listbox', { name: /idioma/i }).first();
    await expect(langSelector).toBeVisible();
  });
});
