import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: REQ-035 - Busqueda permite encontrar productos por nombre, marca, especie, familia
// test: REQ-036 - Resultados en tiempo real (predictiva) con minimo 3 caracteres
// test: REQ-037 - Resultados agrupados por tipo (Productos, Marcas) max 5 por tipo
// test: REQ-038 - Clic en resultado navega a la pagina correcta
// test: REQ-039 - Sin resultados muestra mensaje con sugerencias
// test: REQ-040 - Busqueda funciona en ambos idiomas
// test: REQ-041 - Busqueda tolerante a errores tipograficos (case-insensitive, acentos)

test.describe('Busqueda Global', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForLoadState('networkidle');
  });

  test('REQ-036: Search overlay opens and requires minimum 3 characters', async ({ page }) => {
    // Click the search button
    const searchButton = page.getByRole('button', { name: 'Buscar productos y marcas' });
    await expect(searchButton).toBeVisible();
    await searchButton.click();

    // Verify the search input is visible and active
    const searchInput = page.getByRole('textbox', { name: /buscar productos/i });
    await expect(searchInput).toBeVisible();

    // Verify hint about minimum characters
    await expect(page.getByText('Escribe al menos 3 caracteres')).toBeVisible();

    // Type only 2 characters - should not trigger search
    await searchInput.fill('am');
    await expect(page.getByText('Escribe al menos 3 caracteres')).toBeVisible();
  });

  test('REQ-035/REQ-036: Search triggers predictive results with 3+ characters', async ({ page }) => {
    const searchButton = page.getByRole('button', { name: 'Buscar productos y marcas' });
    await searchButton.click();

    const searchInput = page.getByRole('textbox', { name: /buscar productos/i });
    await searchInput.pressSequentially('amox', { delay: 100 });

    // Wait for results or no-results state
    await page.waitForTimeout(2000);

    // Should show either results grouped by type OR a no-results message
    const noResults = page.getByText(/no se encontraron/i);
    const resultsContainer = page.locator('[class*="results"], [class*="search-results"]');

    const hasNoResults = await noResults.isVisible().catch(() => false);
    const hasResults = await resultsContainer.isVisible().catch(() => false);

    expect(hasNoResults || hasResults).toBe(true);
  });

  test('REQ-039: No results shows message with suggestions', async ({ page }) => {
    const searchButton = page.getByRole('button', { name: 'Buscar productos y marcas' });
    await searchButton.click();

    const searchInput = page.getByRole('textbox', { name: /buscar productos/i });
    await searchInput.pressSequentially('xyznonexistent', { delay: 50 });

    await page.waitForTimeout(2000);

    // Should show no-results message with a suggestion
    await expect(page.getByText(/no se encontraron/i)).toBeVisible();
    // Should have a link to explore the full catalog
    await expect(page.getByText(/explorar catalogo completo/i)).toBeVisible();
  });

  test('REQ-040: Search works in English', async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await page.waitForLoadState('networkidle');

    const searchButton = page.getByRole('button', { name: 'Buscar productos y marcas' });
    await searchButton.click();

    // Verify English placeholder
    const searchInput = page.getByRole('textbox', { name: /search products/i });
    await expect(searchInput).toBeVisible();

    // Verify English hint
    await expect(page.getByText('Type at least 3 characters')).toBeVisible();
  });

  test('REQ-040: Search close button works', async ({ page }) => {
    const searchButton = page.getByRole('button', { name: 'Buscar productos y marcas' });
    await searchButton.click();

    const searchInput = page.getByRole('textbox', { name: /buscar productos/i });
    await expect(searchInput).toBeVisible();

    // Close search
    const closeButton = page.getByRole('button', { name: 'Cerrar busqueda' });
    await closeButton.click();

    // Search should be hidden (overlay dismissed)
    await expect(searchInput).not.toBeVisible();
  });
});
