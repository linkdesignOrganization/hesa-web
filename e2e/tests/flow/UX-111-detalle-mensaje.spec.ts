import { test, expect } from '@playwright/test';

// test: UX-111 - Detalle de mensaje con notas internas, cambio de estado, eliminar
test.describe('UX-111: Detalle de mensaje', () => {
  const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

  test('UX-111: Muestra datos de contacto completos', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/mensajes/m1`);
    await page.waitForSelector('text=Datos de Contacto', { timeout: 15000 });

    // Verificar datos de contacto
    await expect(page.getByText('Datos de Contacto')).toBeVisible();
    await expect(page.getByText('Dr. Roberto Campos')).toBeVisible();
    await expect(page.getByText('rcampos@veterinariacentral.cr')).toBeVisible();
    await expect(page.getByText('+506 8845-1200')).toBeVisible();

    // Verificar badge de tipo
    await expect(page.getByText('Informacion')).toBeVisible();

    // Verificar producto asociado
    await expect(page.getByText('Amoxicilina 250ml')).toBeVisible();
  });

  test('UX-111: Notas internas con textarea y boton guardar', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/mensajes/m1`);
    await page.waitForSelector('text=Notas internas', { timeout: 15000 });

    // Verificar seccion notas internas
    await expect(page.getByText('Notas internas')).toBeVisible();
    await expect(page.getByPlaceholder('Agrega notas de seguimiento')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Guardar nota' })).toBeVisible();
  });

  test('UX-111: Dropdown de estado con opciones', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/mensajes/m1`);
    await page.waitForSelector('text=Estado', { timeout: 15000 });

    // Verificar dropdown de estado
    const statusSelect = page.getByRole('combobox');
    await expect(statusSelect).toBeVisible();

    // Verificar opciones
    await expect(statusSelect.locator('option')).toContainText(['Nuevo', 'En Proceso', 'Atendido']);
  });

  test('UX-111: Botones de accion presentes', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/mensajes/m1`);
    await page.waitForSelector('text=Datos de Contacto', { timeout: 15000 });

    // Verificar botones de accion
    await expect(page.getByRole('button', { name: 'Marcar como atendido' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Eliminar mensaje' })).toBeVisible();
  });

  test('UX-111: Link "Volver a mensajes" presente', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/mensajes/m1`);
    await page.waitForSelector('text=Datos de Contacto', { timeout: 15000 });

    await expect(page.getByRole('link', { name: /Volver a mensajes/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Volver a mensajes/ })).toHaveAttribute('href', '/admin/mensajes');
  });
});
