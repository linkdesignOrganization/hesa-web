import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-004 - Deep linking rutas panel admin deben renderizar la pagina correcta
test.describe('UX-004: Deep linking rutas panel admin', () => {

  test('admin dashboard via deep link', async ({ page }) => {
    await page.goto(`${BASE}/admin/dashboard`);
    await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('admin productos via deep link', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos`);
    await expect(page.getByRole('heading', { name: 'Productos', level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('admin marcas via deep link', async ({ page }) => {
    await page.goto(`${BASE}/admin/marcas`);
    await expect(page.getByText('Marcas')).toBeVisible({ timeout: 10000 });
  });

  test('admin categorias via deep link', async ({ page }) => {
    await page.goto(`${BASE}/admin/categorias`);
    await expect(page.getByRole('heading', { name: 'Categorias y Filtros', level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('admin mensajes via deep link', async ({ page }) => {
    await page.goto(`${BASE}/admin/mensajes`);
    await expect(page.getByText('Mensajes')).toBeVisible({ timeout: 10000 });
  });

  test('admin productos crear via deep link', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos/crear`);
    await expect(page.getByRole('heading', { name: 'Crear Producto', level: 1 })).toBeVisible({ timeout: 10000 });
  });
});
