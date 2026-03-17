import { test, expect } from '@playwright/test';

// test: UX-063 - Carousel featured products shows 6 products
test('UX-063: Featured products carousel shows 6 products', async ({ page }) => {
  await page.goto('/es/');

  // Wait for the carousel section to load
  await expect(page.getByRole('heading', { name: 'Productos Destacados' })).toBeVisible({ timeout: 15000 });

  // Count the product cards in the carousel
  const productCards = page.locator('a[href*="/es/catalogo/"]').filter({
    has: page.locator('h3')
  });

  // Should have exactly 6 featured products
  await expect(productCards).toHaveCount(6);

  // Verify specific product names are present
  await expect(page.getByRole('heading', { name: 'Amoxicilina 250ml', level: 3 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Otoscopio Veterinario Digital', level: 3 })).toBeVisible();
});
