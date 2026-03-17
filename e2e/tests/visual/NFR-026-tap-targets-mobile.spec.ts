import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const MIN_TAP_TARGET = 44;

test.describe('NFR-026: Tap targets >= 44x44px on mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test('Pagination buttons on /es/catalogo are at least 44x44px', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForSelector('.pagination__btn');

    const buttons = page.locator('.pagination__btn');
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(MIN_TAP_TARGET);
      expect(box!.height).toBeGreaterThanOrEqual(MIN_TAP_TARGET);
    }
  });

  test('Footer language toggle "English" has min-height 44px', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    const englishBtn = page.locator('button.lang-footer');
    await englishBtn.scrollIntoViewIfNeeded();
    await expect(englishBtn).toBeVisible();

    const box = await englishBtn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(MIN_TAP_TARGET);
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TAP_TARGET);
  });

  test('Header search button is at least 44x44px', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    const searchBtn = page.locator('.header__search-btn');
    await expect(searchBtn).toBeVisible();

    const box = await searchBtn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(MIN_TAP_TARGET);
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TAP_TARGET);
  });

  test('Header hamburger menu is at least 44x44px', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    const hamburger = page.locator('.header__hamburger');
    await expect(hamburger).toBeVisible();

    const box = await hamburger.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(MIN_TAP_TARGET);
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TAP_TARGET);
  });

  test('Header language selector is at least 44x44px', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    const langBtn = page.locator('.header .lang-selector__trigger').first();
    await expect(langBtn).toBeVisible();

    const box = await langBtn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(MIN_TAP_TARGET);
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TAP_TARGET);
  });

  test('WhatsApp FAB is at least 56x56px', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    const whatsapp = page.locator('[aria-label*="WhatsApp"]');
    await expect(whatsapp).toBeVisible();

    const box = await whatsapp.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(56);
    expect(box!.height).toBeGreaterThanOrEqual(56);
  });

  test('Filter button on catalog is at least 44px tall', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    const filterBtn = page.locator('.filter-bar__mobile-trigger');
    await expect(filterBtn).toBeVisible();

    const box = await filterBtn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(MIN_TAP_TARGET);
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TAP_TARGET);
  });
});
