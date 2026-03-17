import { test, expect } from '@playwright/test';

// test: UX-044 - Conditional fields in product form change based on category selection
test('UX-044: Selecting category changes visible fields in product form', async ({ page }) => {
  await page.goto('/admin/productos/crear');

  // Wait for the form to load
  await expect(page.getByRole('heading', { name: 'Crear Producto' })).toBeVisible({ timeout: 15000 });

  // Verify category buttons are present
  await expect(page.getByRole('button', { name: 'Farmacos' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Alimentos' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Equipos' })).toBeVisible();

  // Click on Alimentos category
  await page.getByRole('button', { name: 'Alimentos' }).click();

  // Verify conditional field "Etapa de Vida" appears for Alimentos
  await expect(page.getByText('Etapa de Vida')).toBeVisible();
  const etapaSelect = page.getByRole('combobox', { name: 'Etapa de Vida' });
  await expect(etapaSelect).toBeVisible();

  // Verify options in the dropdown
  await expect(etapaSelect.getByRole('option', { name: 'Cachorro/Kitten' })).toBeAttached();
  await expect(etapaSelect.getByRole('option', { name: 'Adulto' })).toBeAttached();
  await expect(etapaSelect.getByRole('option', { name: 'Senior' })).toBeAttached();

  // Switch to Farmacos -- the Etapa de Vida field should disappear
  await page.getByRole('button', { name: 'Farmacos' }).click();
  await expect(page.getByText('Etapa de Vida')).not.toBeVisible();
});
