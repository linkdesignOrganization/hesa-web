import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('DC-135: Guard unsaved changes modal appears when navigating from dirty form', async ({ page }) => {
  await page.goto(`${BASE_URL}/admin/productos/crear`);

  // Type data in the name field to mark form as dirty
  const nameInput = page.locator('input[placeholder*="Amoxicilina"]');
  await nameInput.fill('Test Producto Guard');

  // Click Cancelar to trigger guard
  await page.locator('button:has-text("Cancelar")').click();

  // Verify unsaved changes modal appears
  const modal = page.locator('h3:has-text("cambios sin guardar")');
  await expect(modal).toBeVisible();

  // Verify modal has correct buttons
  await expect(page.locator('button:has-text("Salir sin guardar")')).toBeVisible();
  await expect(page.locator('button:has-text("Seguir editando")')).toBeVisible();

  // Click "Seguir editando" and verify form is still there
  await page.locator('button:has-text("Seguir editando")').click();
  await expect(page.locator('h1:has-text("Crear Producto")')).toBeVisible();
});
