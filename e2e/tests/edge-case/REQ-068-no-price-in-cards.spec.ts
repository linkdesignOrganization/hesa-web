import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-068: Product cards do NOT show price or e-commerce data', () => {
  test('product card template has no price, cart, or buy elements', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForLoadState('networkidle');

    // Check if product cards exist on the page
    const cards = page.locator('.product-card');
    const count = await cards.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const cardText = await cards.nth(i).textContent();
        // No price indicators
        expect(cardText).not.toMatch(/\$\d/);
        expect(cardText).not.toMatch(/USD/i);
        expect(cardText).not.toMatch(/precio/i);
        expect(cardText).not.toMatch(/price/i);

        // No e-commerce elements
        const cartButton = cards.nth(i).locator('[class*="cart"], [class*="buy"], [class*="add-to"]');
        expect(await cartButton.count()).toBe(0);
      }
    }

    // Also verify no price elements exist in the product card component at all
    const priceElements = page.locator('.product-card__price, .product-card__cart, .product-card__buy');
    expect(await priceElements.count()).toBe(0);
  });
});
