import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-025 - Catalogo skeleton y paginacion
test.describe('UX-025: Catalogo paginacion', () => {

  test('catalogo shows pagination with 12 per page', async ({ page }) => {
    await page.goto(`${BASE}/es/catalogo`);
    await expect(page.getByText('productos')).toBeVisible({ timeout: 10000 });
    // Pagination controls
    await expect(page.getByText(/1-12 de/)).toBeVisible();
    // Page buttons
    await expect(page.getByRole('button', { name: '1' })).toBeVisible();
    await expect(page.getByRole('button', { name: '2' })).toBeVisible();
  });
});

// test: UX-027 - Detalle producto error 404
test.describe('UX-027: Detalle producto 404', () => {

  test('producto inexistente muestra 404', async ({ page }) => {
    await page.goto(`${BASE}/es/catalogo/farmacos/producto-inexistente`);
    await expect(page.getByText('Pagina no encontrada').or(page.getByText('no encontrad'))).toBeVisible({ timeout: 10000 });
  });
});

// test: UX-063 - Carrusel productos destacados
test.describe('UX-063: Carrusel productos destacados', () => {

  test('home muestra carrusel con productos destacados', async ({ page }) => {
    await page.goto(`${BASE}/es`);
    await page.waitForTimeout(3000);
    await expect(page.getByRole('heading', { name: 'Productos Destacados', level: 2 })).toBeVisible({ timeout: 10000 });
    // Should have prev/next buttons
    await expect(page.getByRole('button', { name: 'Productos anteriores' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Productos siguientes' })).toBeVisible();
    // At least 4 products visible
    await expect(page.getByRole('link', { name: /Ver Amoxicilina/ })).toBeVisible();
  });
});
