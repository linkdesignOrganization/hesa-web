import { test, expect } from '@playwright/test';

// test: UX-045 - Modal "cambios sin guardar" al navegar con cambios pendientes
test.describe('UX-045: Modal de cambios sin guardar', () => {
  const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

  test('UX-045: Muestra modal al intentar navegar con cambios en formulario crear producto', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/crear`);
    await page.waitForSelector('input[placeholder*="Amoxicilina"]', { timeout: 15000 });

    // Escribir en el campo nombre para marcar el formulario como "dirty"
    await page.getByRole('textbox', { name: 'Nombre del producto' }).fill('Producto de prueba QA');

    // Intentar navegar a Dashboard
    await page.getByRole('link', { name: 'Dashboard' }).click();

    // Verificar que aparece el modal de cambios sin guardar
    await expect(page.getByText('Tienes cambios sin guardar')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Si sales ahora, perderas los cambios')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Salir sin guardar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Seguir editando' })).toBeVisible();
  });

  test('UX-045: "Seguir editando" mantiene datos en formulario', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/crear`);
    await page.waitForSelector('input[placeholder*="Amoxicilina"]', { timeout: 15000 });

    await page.getByRole('textbox', { name: 'Nombre del producto' }).fill('Producto prueba');
    await page.getByRole('link', { name: 'Dashboard' }).click();

    // Click "Seguir editando"
    await page.getByRole('button', { name: 'Seguir editando' }).click({ timeout: 10000 });

    // Verificar que seguimos en el formulario con datos intactos
    await expect(page).toHaveURL(/\/admin\/productos\/crear/);
    await expect(page.getByRole('textbox', { name: 'Nombre del producto' })).toHaveValue('Producto prueba');
  });

  test('UX-045: "Salir sin guardar" navega sin mantener datos', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/crear`);
    await page.waitForSelector('input[placeholder*="Amoxicilina"]', { timeout: 15000 });

    await page.getByRole('textbox', { name: 'Nombre del producto' }).fill('Producto prueba');
    await page.getByRole('link', { name: 'Dashboard' }).click();

    // Click "Salir sin guardar"
    await page.getByRole('button', { name: 'Salir sin guardar' }).click({ timeout: 10000 });

    // Verificar que navegamos al Dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15000 });
  });

  test('UX-045: No muestra modal si no hay cambios', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/crear`);
    await page.waitForSelector('input[placeholder*="Amoxicilina"]', { timeout: 15000 });

    // Navegar sin modificar campos
    await page.getByRole('link', { name: 'Dashboard' }).click();

    // No debe aparecer modal - debe navegar directamente
    await expect(page.getByText('Tienes cambios sin guardar')).not.toBeVisible({ timeout: 5000 });
  });
});
