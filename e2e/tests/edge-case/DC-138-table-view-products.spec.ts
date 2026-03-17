import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-138: Hover filas tabla panel y estructura tabla productos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`, { waitUntil: 'networkidle', timeout: 30000 });
    // Retry if public site loads instead of admin
    const heading = page.getByRole('heading', { name: 'Productos', level: 1 });
    if (!(await heading.isVisible({ timeout: 5000 }).catch(() => false))) {
      await page.goto(`${BASE_URL}/admin/productos`, { waitUntil: 'networkidle', timeout: 30000 });
    }
  });

  test('toggle de vista tarjetas a vista tabla funciona', async ({ page }) => {
    const tableButton = page.getByRole('button', { name: 'Vista de tabla' });
    await expect(tableButton).toBeVisible({ timeout: 10000 });
    await tableButton.click();

    // Verificar que se muestra la tabla
    const table = page.getByRole('table');
    await expect(table).toBeVisible({ timeout: 5000 });
  });

  test('tabla tiene headers UPPERCASE correctos', async ({ page }) => {
    await page.getByRole('button', { name: 'Vista de tabla' }).click();

    const headers = ['PRODUCTO', 'MARCA', 'CATEGORIA', 'ESTADO', 'ACCIONES'];
    for (const header of headers) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible({ timeout: 5000 });
    }
  });

  test('tabla muestra todos los 48 productos', async ({ page }) => {
    await page.getByRole('button', { name: 'Vista de tabla' }).click();

    const rows = page.getByRole('row');
    // +1 for header row
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(49); // 48 products + 1 header
  });

  test('cada fila tiene acciones Ver y Editar', async ({ page }) => {
    await page.getByRole('button', { name: 'Vista de tabla' }).click();

    // Verificar primera fila tiene links de accion
    const firstRow = page.getByRole('row').nth(1);
    await expect(firstRow.getByRole('link', { name: 'Ver producto' })).toBeVisible({ timeout: 5000 });
    await expect(firstRow.getByRole('link', { name: 'Editar producto' })).toBeVisible({ timeout: 5000 });
  });

  test('filas tienen datos correctos (nombre, marca, categoria, estado)', async ({ page }) => {
    await page.getByRole('button', { name: 'Vista de tabla' }).click();

    // Verificar primera fila: Amoxicilina 250ml, Zoetis, Farmacos, Activo
    const firstRow = page.getByRole('row', { name: /Amoxicilina 250ml/ });
    await expect(firstRow).toBeVisible({ timeout: 5000 });
    await expect(firstRow.getByText('Zoetis')).toBeVisible();
    await expect(firstRow.getByText('Farmacos')).toBeVisible();
    await expect(firstRow.getByText('Activo')).toBeVisible();
  });

  test('tabla muestra productos de diferentes categorias', async ({ page }) => {
    await page.getByRole('button', { name: 'Vista de tabla' }).click();

    // Farmacos
    await expect(page.getByRole('row', { name: /Amoxicilina 250ml/ })).toBeVisible({ timeout: 5000 });
    // Alimentos
    await expect(page.getByRole('row', { name: /Pro Plan Adulto/ })).toBeVisible({ timeout: 5000 });
    // Equipos
    await expect(page.getByRole('row', { name: /Otoscopio Veterinario/ })).toBeVisible({ timeout: 5000 });
  });

  test('tabla muestra producto inactivo con estado diferente', async ({ page }) => {
    await page.getByRole('button', { name: 'Vista de tabla' }).click();

    const inactiveRow = page.getByRole('row', { name: /Flunixin Meglumine/ });
    await inactiveRow.scrollIntoViewIfNeeded();
    await expect(inactiveRow).toBeVisible({ timeout: 5000 });
    await expect(inactiveRow.getByText('Inactivo')).toBeVisible();
  });
});
