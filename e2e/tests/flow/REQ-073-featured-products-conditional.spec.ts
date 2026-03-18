import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

// test: REQ-073 - Si no hay productos destacados configurados, la seccion no se muestra en home
test.describe('REQ-073: Featured products section conditional rendering', () => {

  test('API returns featured products', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/home`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();

    expect(body).toHaveProperty('featuredProducts');
    expect(Array.isArray(body.featuredProducts)).toBe(true);
    expect(body.featuredProducts.length).toBeGreaterThan(0);
  });

  test('Featured products section is visible on Home when API returns products', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForURL('**/es/**');

    // The "Productos Destacados" heading should be visible
    const heading = page.getByRole('heading', { name: /Productos Destacados/i });
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Product cards should be rendered
    const productLinks = page.locator('a[href*="/catalogo/"]').filter({ hasText: /Ver .+/ });
    const count = await productLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Featured products section shows correct products from API', async ({ page, request }) => {
    // Get featured products from API
    const apiResponse = await request.get(`${API_URL}/api/public/home`);
    const apiData = await apiResponse.json();
    const featuredNames = apiData.featuredProducts.map((p: any) => p.name.es);

    // Navigate to Home
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForURL('**/es/**');

    // Verify that featured products from API are shown on the page
    for (const name of featuredNames) {
      const productCard = page.getByText(name).first();
      await expect(productCard).toBeAttached();
    }
  });

  test('"Ver todos" link navigates to catalog', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForURL('**/es/**');

    const verTodosLink = page.getByRole('link', { name: /Ver todos/i });
    await expect(verTodosLink).toBeVisible({ timeout: 10000 });

    const href = await verTodosLink.getAttribute('href');
    expect(href).toContain('/catalogo');
  });

  test('Carousel navigation buttons exist', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForURL('**/es/**');

    // Previous/Next buttons for carousel
    const prevButton = page.getByRole('button', { name: /anteriores/i });
    const nextButton = page.getByRole('button', { name: /siguientes/i });

    await expect(prevButton).toBeAttached();
    await expect(nextButton).toBeAttached();
  });
});
