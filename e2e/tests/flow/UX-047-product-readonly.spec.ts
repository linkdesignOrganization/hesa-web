import { test, expect } from '@playwright/test';

// test: UX-047 - Product detail in admin shows read-only view
test('UX-047: Admin product detail shows read-only view with edit link', async ({ page }) => {
  await page.goto('/admin/productos/p1');

  // Wait for the product detail to load
  await expect(page.getByRole('heading', { name: 'Amoxicilina 250ml', level: 1 })).toBeVisible({ timeout: 15000 });

  // Verify read-only content is displayed
  await expect(page.getByText('Zoetis')).toBeVisible();
  await expect(page.getByText('farmacos')).toBeVisible();
  await expect(page.getByText('Activo')).toBeVisible();

  // Verify description section
  await expect(page.getByRole('heading', { name: 'Descripcion', level: 3 })).toBeVisible();
  await expect(page.getByText('Antibiotico de amplio espectro')).toBeVisible();

  // Verify presentations section
  await expect(page.getByRole('heading', { name: 'Presentaciones', level: 3 })).toBeVisible();
  await expect(page.getByText('100ml')).toBeVisible();
  await expect(page.getByText('250ml')).toBeVisible();
  await expect(page.getByText('500ml')).toBeVisible();

  // Verify species section
  await expect(page.getByRole('heading', { name: 'Especies', level: 3 })).toBeVisible();
  await expect(page.getByText('Caninos')).toBeVisible();

  // Verify navigation links
  await expect(page.getByRole('link', { name: /Volver a productos/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Editar producto' })).toBeVisible();
});
