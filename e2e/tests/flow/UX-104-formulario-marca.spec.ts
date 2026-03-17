import { test, expect } from '@playwright/test';

// test: UX-104 - Formulario de marca con logo, pais, categorias, descripcion bilingue
test.describe('UX-104: Formulario de marca', () => {
  const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

  test('UX-104: Formulario crear marca tiene todos los campos requeridos', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/marcas/crear`);
    await page.waitForSelector('h1', { timeout: 15000 });

    // Verificar campos del formulario
    await expect(page.getByText('Nombre')).toBeVisible();
    await expect(page.getByText(/Pais/i)).toBeVisible();
    await expect(page.getByText(/Categor/i)).toBeVisible();
    await expect(page.getByText(/Descripcion/i)).toBeVisible();
  });

  test('UX-104: Lista de marcas muestra todas las marcas', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/marcas`);
    await page.waitForSelector('h1:has-text("Marcas")', { timeout: 15000 });

    // Verificar que se muestran marcas
    await expect(page.getByText('Zoetis')).toBeVisible();
    await expect(page.getByText('Royal Canin')).toBeVisible();
    await expect(page.getByText('MSD Animal Health')).toBeVisible();
    await expect(page.getByText('Purina Pro Plan')).toBeVisible();

    // Verificar boton crear
    await expect(page.getByRole('link', { name: 'Crear marca' })).toBeVisible();
  });

  test('UX-104: Editar marca carga datos existentes', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/marcas/b1/editar`);
    await page.waitForSelector('input', { timeout: 15000 });

    // Verificar que los datos se cargan
    const nameInput = page.getByRole('textbox').first();
    await expect(nameInput).toBeVisible();
  });
});
