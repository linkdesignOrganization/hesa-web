import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-032: Home - Marcas Destacadas section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForLoadState('networkidle');
  });

  test('DC-032: Logos section is visible (opacity != 0, is-visible class applied)', async ({ page }) => {
    const section = page.locator('.logos-section');
    await expect(section).toBeVisible({ timeout: 15000 });

    const opacity = await section.evaluate(el => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');

    const hasIsVisible = await section.evaluate(el => el.classList.contains('is-visible'));
    expect(hasIsVisible).toBe(true);
  });

  test('DC-032: Heading is centered 42px Bold', async ({ page }) => {
    const section = page.locator('.logos-section');
    await expect(section).toBeVisible({ timeout: 15000 });

    const heading = section.locator('h2');
    await expect(heading).toHaveText(/Marcas Destacadas/);

    const styles = await heading.evaluate(el => {
      const s = getComputedStyle(el);
      return { fontSize: s.fontSize, fontWeight: s.fontWeight, textAlign: s.textAlign };
    });
    expect(styles.fontSize).toBe('42px');
    expect(parseInt(styles.fontWeight)).toBeGreaterThanOrEqual(700);
    expect(styles.textAlign).toBe('center');
  });

  test('DC-032: 6-8 logos displayed in grid', async ({ page }) => {
    const section = page.locator('.logos-section');
    await expect(section).toBeVisible({ timeout: 15000 });

    const logoLinks = section.locator('a');
    const count = await logoLinks.count();
    expect(count).toBeGreaterThanOrEqual(6);
    expect(count).toBeLessThanOrEqual(10); // 8 + "ver todas" link
  });

  test('DC-032: "Ver todas las marcas" link present and links to /marcas', async ({ page }) => {
    const section = page.locator('.logos-section');
    await expect(section).toBeVisible({ timeout: 15000 });

    const viewAllLink = section.locator('a[href*="/marcas"]').last();
    await expect(viewAllLink).toBeVisible();
    await expect(viewAllLink).toHaveText(/Ver todas/);
  });
});
