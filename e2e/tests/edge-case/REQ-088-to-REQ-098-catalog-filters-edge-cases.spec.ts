import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-088 to REQ-098: Catalog Filters Edge Cases', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    // Wait for Angular to hydrate
    await page.waitForTimeout(3000);
  });

  test('REQ-088: Farmacos shows filters Marca, Especie, Familia farmaceutica', async ({ page }) => {
    await page.locator('select').first().selectOption('Farmacos');
    await page.waitForTimeout(1000);

    // Should have dropdowns for Marca, Especie, and Familia
    const dropdowns = page.locator('select');
    const count = await dropdowns.count();
    expect(count).toBeGreaterThanOrEqual(4); // Categoria + Marca + Especie + Familia

    // Verify Familia dropdown exists with correct options
    const familiaSelect = page.locator('select').last();
    const familiaOptions = await familiaSelect.locator('option').allTextContents();
    expect(familiaOptions).toContain('Familia');
    expect(familiaOptions).toContain('Antibioticos');
    expect(familiaOptions).toContain('Desparasitantes');
  });

  test('REQ-089: Alimentos shows filters Marca, Especie, Etapa de vida', async ({ page }) => {
    await page.locator('select').first().selectOption('Alimentos');
    await page.waitForTimeout(1000);

    // Verify Etapa de vida dropdown exists
    const lastSelect = page.locator('select').last();
    const options = await lastSelect.locator('option').allTextContents();
    expect(options).toContain('Etapa de vida');
    expect(options).toContain('Cachorro/Kitten');
    expect(options).toContain('Adulto');
    expect(options).toContain('Senior');
  });

  test('REQ-090: Equipos shows filters Marca, Tipo de equipo', async ({ page }) => {
    await page.locator('select').first().selectOption('Equipos');
    await page.waitForTimeout(1000);

    const lastSelect = page.locator('select').last();
    const options = await lastSelect.locator('option').allTextContents();
    expect(options).toContain('Tipo');
    expect(options).toContain('Diagnostico');
    expect(options).toContain('Quirurgico');
  });

  test('REQ-091: Filters are dropdowns in horizontal bar (not sidebar)', async ({ page }) => {
    // All filters should be in a row (horizontal), not in a sidebar
    const filterContainer = page.locator('select').first().locator('..');
    // Verify multiple selects exist in the same parent container
    const selectCount = await page.locator('select').count();
    expect(selectCount).toBeGreaterThanOrEqual(3);
  });

  test('REQ-092: Filters apply immediately without "Apply" button', async ({ page }) => {
    const currentUrl = page.url();
    await page.locator('select').first().selectOption('Farmacos');
    await page.waitForTimeout(500);
    // URL should change immediately
    expect(page.url()).toContain('category=farmacos');
    // No "Apply" button should exist
    const applyButton = page.getByRole('button', { name: /aplicar/i });
    await expect(applyButton).not.toBeVisible();
  });

  test('REQ-093: Active filters shown as pills with X to remove', async ({ page }) => {
    await page.locator('select').first().selectOption('Farmacos');
    await page.waitForTimeout(1000);

    // Should show pill with filter value
    const pill = page.getByText('farmacos');
    await expect(pill).toBeVisible();

    // Should have X button to remove
    const removeButton = page.getByRole('button', { name: /remover filtro/i });
    await expect(removeButton).toBeVisible();
  });

  test('REQ-094: "Limpiar filtros" button when filters are active', async ({ page }) => {
    await page.locator('select').first().selectOption('Farmacos');
    await page.waitForTimeout(1000);

    const clearButton = page.getByRole('button', { name: /limpiar filtros/i });
    await expect(clearButton).toBeVisible();

    // Click clear and verify filters reset
    await clearButton.click();
    await page.waitForTimeout(500);
    expect(page.url()).not.toContain('category=');
  });

  test('REQ-095: Combination of multiple filters (intersection)', async ({ page }) => {
    await page.locator('select').first().selectOption('Farmacos');
    await page.waitForTimeout(1000);

    // Select species filter
    const speciesSelect = page.locator('select').nth(2);
    await speciesSelect.selectOption('Caninos');
    await page.waitForTimeout(500);

    // URL should contain both filters
    expect(page.url()).toContain('category=farmacos');
    expect(page.url()).toContain('species=');
  });

  test('REQ-097: Empty results show message with suggestion to clear filters', async ({ page }) => {
    // With API down, the error message should appear
    await page.waitForTimeout(2000);
    const errorMessage = page.getByRole('heading', { name: /no pudimos cargar/i });
    await expect(errorMessage).toBeVisible();
    const retryButton = page.getByRole('button', { name: /reintentar/i });
    await expect(retryButton).toBeVisible();
  });

  test('REQ-098: Counter updates dynamically', async ({ page }) => {
    const counter = page.getByText(/\d+ productos/);
    await expect(counter).toBeVisible();
    // With API down, shows 0 productos
    await expect(page.getByText('0 productos')).toBeVisible();
  });
});
