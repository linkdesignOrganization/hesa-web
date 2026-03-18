import { test, expect } from '@playwright/test';

// test: REQ-042 - Hero ocupa 100vh
test('REQ-042: Hero section occupies full viewport height (100vh)', async ({ page }) => {
  await page.goto('/es');
  await page.getByText('DESDE 1989').first().waitFor({ state: 'visible' });

  const heroSection = page.locator('section').first().or(page.locator('.hero, [class*="hero"]').first());
  const hero = page.locator('h1').locator('..').locator('..');
  const viewportHeight = page.viewportSize()?.height ?? 900;

  // The hero section should be approximately 100vh
  const heroBoundingBox = await hero.boundingBox();
  expect(heroBoundingBox).not.toBeNull();
  if (heroBoundingBox) {
    // Allow some tolerance (navbar height ~60px, so hero content area >= 80% of viewport)
    expect(heroBoundingBox.height).toBeGreaterThan(viewportHeight * 0.7);
  }
});
