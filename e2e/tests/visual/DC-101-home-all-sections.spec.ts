import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-101: Home - All sections visible', () => {
  test('DC-101: All main sections render on home page', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForLoadState('networkidle');

    // Hero section
    const hero = page.locator('section.hero');
    await expect(hero).toBeVisible({ timeout: 15000 });

    // Logos/Brands section
    const logos = page.locator('.logos-section');
    await expect(logos).toBeAttached();

    // Category blocks (3 blocks)
    const catBlocks = page.locator('section.cat-block');
    const catCount = await catBlocks.count();
    expect(catCount).toBe(3);

    // Value section
    const valueSection = page.locator('section.value-section, .value-section');
    await expect(valueSection).toBeAttached();

    // Products carousel section
    const productsSection = page.locator('section').filter({ hasText: 'Productos Destacados' });
    await expect(productsSection).toBeAttached();

    // Manufacturer CTA section
    const mfrCta = page.locator('section.mfr-cta, .mfr-cta');
    await expect(mfrCta).toBeAttached();

    // Footer
    const footer = page.locator('footer, [role="contentinfo"]');
    await expect(footer).toBeVisible();
  });

  test('DC-101: Sections become visible with IntersectionObserver on scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForLoadState('networkidle');

    // Scroll through the entire page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    // Check that fade-in sections gained is-visible class
    const visibleCount = await page.evaluate(() => {
      return document.querySelectorAll('.fade-in-section.is-visible').length;
    });
    expect(visibleCount).toBeGreaterThanOrEqual(1);
  });
});
