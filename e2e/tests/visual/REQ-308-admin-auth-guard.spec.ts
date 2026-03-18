import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-308: Panel admin requiere autenticacion', () => {
  test('admin/productos redirige a admin/login', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`);
    // Wait for Angular auth guard to kick in
    await page.waitForURL('**/admin/login', { timeout: 15000 });
    expect(page.url()).toContain('/admin/login');
  });

  test('admin/dashboard redirige a admin/login', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/dashboard`);
    await page.waitForURL('**/admin/login', { timeout: 15000 });
    expect(page.url()).toContain('/admin/login');
  });

  test('admin/marcas redirige a admin/login', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/marcas`);
    await page.waitForURL('**/admin/login', { timeout: 15000 });
    expect(page.url()).toContain('/admin/login');
  });

  test('admin/configuracion/general redirige a admin/login', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/configuracion/general`);
    await page.waitForURL('**/admin/login', { timeout: 15000 });
    expect(page.url()).toContain('/admin/login');
  });

  test('admin/login muestra card con boton Microsoft', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await expect(page.getByText('Panel de Administracion')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Iniciar sesion con Microsoft')).toBeVisible();
  });
});
