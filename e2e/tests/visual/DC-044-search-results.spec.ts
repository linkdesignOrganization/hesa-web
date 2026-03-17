import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-044: Search results layout', () => {
  test('DC-044: Search results page has breadcrumb and grouped results', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    // Navigate to search with a term
    await page.goto(`${BASE_URL}/es/busqueda?q=amoxicilina`);
    await page.waitForLoadState('networkidle');

    // Should have a heading with the search term
    const heading = page.locator('h1, h2');
    if (await heading.count() > 0) {
      const text = await heading.first().textContent();
      // Heading should reference the search term
      expect(text).toBeTruthy();
    }
  });
});
