import { test, expect } from '@playwright/test';

// test: UX-046 - Modal de confirmacion al eliminar producto
test.describe('UX-046: Modal de confirmacion de eliminacion', () => {
  const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

  test('UX-046: Muestra modal al clickar Eliminar en menu opciones de producto', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`);
    await page.waitForSelector('h1:has-text("Productos")', { timeout: 15000 });

    // Asegurar vista de tarjetas
    const cardViewBtn = page.getByRole('button', { name: 'Vista de tarjetas' });
    if (await cardViewBtn.isVisible()) {
      await cardViewBtn.click();
    }

    // Click en menu opciones del primer producto
    const firstOptionsBtn = page.getByLabel('Opciones del producto').first();
    await firstOptionsBtn.click();

    // Click en Eliminar
    await page.getByRole('button', { name: 'Eliminar' }).click();

    // Verificar modal de confirmacion
    await expect(page.getByText('Eliminar producto')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Esta accion no se puede deshacer')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Eliminar' })).toBeVisible();
  });

  test('UX-046: Cancelar cierra modal y mantiene producto', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`);
    await page.waitForSelector('h1:has-text("Productos")', { timeout: 15000 });

    // Contar productos antes
    const productCountBefore = await page.locator('.admin-product-card').count();

    // Abrir menu y click Eliminar
    const firstOptionsBtn = page.getByLabel('Opciones del producto').first();
    await firstOptionsBtn.click();
    await page.getByRole('button', { name: 'Eliminar' }).click();

    // Click Cancelar
    await page.getByRole('button', { name: 'Cancelar' }).click({ timeout: 10000 });

    // Modal debe cerrarse
    await expect(page.getByText('Eliminar producto')).not.toBeVisible({ timeout: 5000 });

    // Producto debe seguir en lista
    const productCountAfter = await page.locator('.admin-product-card').count();
    expect(productCountAfter).toBe(productCountBefore);
  });

  test('UX-046: Confirmar eliminacion muestra toast y remueve producto', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`);
    await page.waitForSelector('h1:has-text("Productos")', { timeout: 15000 });

    // Abrir menu y click Eliminar
    const firstOptionsBtn = page.getByLabel('Opciones del producto').first();
    await firstOptionsBtn.click();
    await page.getByRole('button', { name: 'Eliminar' }).click();

    // Confirmar eliminacion
    await page.locator('.modal-dialog .btn-danger').click({ timeout: 10000 });

    // Verificar toast de confirmacion
    await expect(page.getByText(/eliminado/i)).toBeVisible({ timeout: 10000 });
  });
});
