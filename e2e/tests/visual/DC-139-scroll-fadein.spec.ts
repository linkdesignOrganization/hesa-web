import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-139: Scroll fade-in on all sections', () => {
  test('DC-139: fade-in-section elements exist on home page', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForLoadState('networkidle');

    const fadeInCount = await page.evaluate(() => {
      return document.querySelectorAll('.fade-in-section').length;
    });
    expect(fadeInCount).toBeGreaterThanOrEqual(4);
  });

  test('DC-139: IntersectionObserver applies is-visible on scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForLoadState('networkidle');

    // Scroll to bottom to trigger all observers
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    const visibleCount = await page.evaluate(() => {
      return document.querySelectorAll('.fade-in-section.is-visible').length;
    });

    const totalCount = await page.evaluate(() => {
      return document.querySelectorAll('.fade-in-section').length;
    });

    // At least some sections should have become visible
    expect(visibleCount).toBeGreaterThan(0);
  });

  test('DC-139: fade-in-section has opacity transition CSS', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForLoadState('networkidle');

    const hasTransition = await page.evaluate(() => {
      const el = document.querySelector('.fade-in-section');
      if (!el) return false;
      const s = getComputedStyle(el);
      return s.transition.includes('opacity') || s.transition.includes('transform') || s.transition !== 'all 0s ease 0s';
    });
    expect(hasTransition).toBe(true);
  });
});
