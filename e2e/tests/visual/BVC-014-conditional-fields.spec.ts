import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('BVC-014: Conditional fields change when category is selected', async ({ page }) => {
  await page.goto(`${BASE_URL}/admin/productos/crear`);

  // Click Farmacos - should show "Familia Farmaceutica"
  await page.locator('button:has-text("Farmacos")').click();
  await expect(page.getByLabel('Familia Farmaceutica')).toBeVisible();

  // Click Alimentos - should show "Etapa de Vida" and hide "Familia Farmaceutica"
  await page.locator('button:has-text("Alimentos")').click();
  await expect(page.getByLabel('Etapa de Vida')).toBeVisible();

  // Click Equipos - should show "Tipo de Equipo"
  await page.locator('button:has-text("Equipos")').click();
  await expect(page.getByLabel('Tipo de Equipo')).toBeVisible();
});
