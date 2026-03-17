import { test, expect } from '@playwright/test';

// test: UX-049 - Brand creation form has all required fields
test('UX-049: Brand creation form shows all fields for creating a brand', async ({ page }) => {
  await page.goto('/admin/marcas/crear');

  // Wait for the form to load
  await expect(page.getByRole('heading', { name: 'Crear Marca' })).toBeVisible({ timeout: 15000 });

  // Verify form sections
  await expect(page.getByRole('heading', { name: 'Informacion de la Marca' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Logo' })).toBeVisible();

  // Verify form fields
  await expect(page.getByText('Nombre *')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Nombre de la marca' })).toBeVisible();
  await expect(page.getByText('Pais de origen *')).toBeVisible();
  await expect(page.getByText('Categorias')).toBeVisible();

  // Verify category checkboxes
  await expect(page.getByRole('checkbox', { name: 'Farmacos' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Alimentos' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Equipos' })).toBeVisible();

  // Verify bilingual description fields
  await expect(page.getByText('Descripcion (ES)')).toBeVisible();
  await expect(page.getByText('Descripcion (EN)')).toBeVisible();

  // Verify action buttons
  await expect(page.getByRole('link', { name: 'Cancelar' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Guardar marca' })).toBeVisible();

  // Verify logo upload area
  await expect(page.getByText('Arrastra el logo aqui o selecciona archivo')).toBeVisible();
});
