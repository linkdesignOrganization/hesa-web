import { test, expect } from '@playwright/test';

// test: REQ-073 - Si no hay destacados, seccion oculta
test('REQ-073: Featured products section is hidden when API returns empty array', async ({ page }) => {
  // Verify API returns empty featured products
  const apiResponse = await page.request.get('https://hesa-api.azurewebsites.net/api/public/home');
  const data = await apiResponse.json();
  expect(data.featuredProducts).toEqual([]);

  // Load home page
  await page.goto('/es');
  await page.getByText('DESDE 1989').first().waitFor({ state: 'visible' });

  // Verify no "Productos Destacados" heading exists
  const productsHeading = page.getByRole('heading', { name: /productos destacados/i });
  await expect(productsHeading).toHaveCount(0);
});
