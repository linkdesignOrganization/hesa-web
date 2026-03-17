import { test, expect } from '@playwright/test';

// test: UX-014 - Labels formulario distribuidores TODOS en espanol en ruta /es/
test('UX-014: Distributor form labels are all in Spanish on /es/ route', async ({ page }) => {
  await page.goto('/es/distribuidores');

  // Wait for the form to load
  await expect(page.getByRole('heading', { name: 'Inicie su Alianza' })).toBeVisible({ timeout: 15000 });

  // Verify all form labels are in Spanish
  await expect(page.getByText('Nombre de la empresa *')).toBeVisible();
  await expect(page.getByText('Pais de origen *')).toBeVisible();
  await expect(page.getByText('Nombre de contacto *')).toBeVisible();
  await expect(page.getByText('Correo electronico *')).toBeVisible();
  await expect(page.getByText('Telefono', { exact: false })).toBeVisible();
  await expect(page.getByText('Tipos de producto')).toBeVisible();
  await expect(page.getByText('Mensaje *')).toBeVisible();
  await expect(page.getByText('Acepto los terminos y condiciones')).toBeVisible();

  // Verify submit button is in Spanish
  await expect(page.getByRole('button', { name: 'Enviar consulta' })).toBeVisible();
});
