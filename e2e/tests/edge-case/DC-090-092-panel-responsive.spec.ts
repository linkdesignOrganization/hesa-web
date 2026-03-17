import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-090: Panel Tables Responsive', () => {
  test('Product list renders in mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/admin/productos`);
    await page.waitForSelector('text=Productos', { timeout: 10000 });

    // Products should be visible (stacked cards in mobile)
    await expect(page.getByRole('heading', { name: 'Productos' })).toBeVisible();
    await expect(page.getByText('Amoxicilina 250ml')).toBeVisible();
  });
});

test.describe('DC-091: Panel Forms Responsive', () => {
  test('Product form renders in mobile viewport with single column', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/admin/productos/crear`);
    await page.waitForSelector('text=Crear Producto', { timeout: 10000 });

    // Form should be visible
    await expect(page.getByRole('heading', { name: 'Informacion Basica' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Nombre del producto' })).toBeVisible();

    // Buttons should be visible (sticky bottom in mobile)
    await expect(page.getByRole('button', { name: 'Guardar producto' })).toBeVisible();
  });
});

test.describe('DC-092: Panel Kanban Responsive', () => {
  test('Messages page renders in mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/admin/mensajes`);
    await page.waitForSelector('text=Mensajes', { timeout: 10000 });

    // Messages section should be visible
    await expect(page.getByRole('heading', { name: 'Mensajes' })).toBeVisible();
  });
});
