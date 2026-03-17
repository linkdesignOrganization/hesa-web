import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-091: Distributor Form Labels in Spanish', () => {
  test('All form labels are in Spanish on /es/distribuidores', async ({ page }) => {
    await page.goto(`${BASE}/es/distribuidores`);
    await page.waitForSelector('text=Inicie su Alianza', { timeout: 10000 });

    // Verify Spanish labels
    await expect(page.getByText('Nombre de la empresa *')).toBeVisible();
    await expect(page.getByText('Pais de origen *')).toBeVisible();
    await expect(page.getByText('Nombre de contacto *')).toBeVisible();
    await expect(page.getByText('Correo electronico *')).toBeVisible();
    await expect(page.getByText('Telefono')).toBeVisible();
    await expect(page.getByText('Tipos de producto')).toBeVisible();
    await expect(page.getByText('Mensaje *')).toBeVisible();
    await expect(page.getByText('Acepto los terminos y condiciones')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enviar consulta' })).toBeVisible();
  });

  test('No English labels remain in Spanish route', async ({ page }) => {
    await page.goto(`${BASE}/es/distribuidores`);
    await page.waitForSelector('text=Inicie su Alianza', { timeout: 10000 });

    // Verify English labels are NOT present
    const pageText = await page.textContent('body');
    expect(pageText).not.toContain('Company Name');
    expect(pageText).not.toContain('Country of Origin');
    expect(pageText).not.toContain('Contact Name');
    expect(pageText).not.toContain('I accept the terms and conditions');
  });

  test('Empty submit shows validation errors in Spanish', async ({ page }) => {
    await page.goto(`${BASE}/es/distribuidores`);
    await page.waitForSelector('text=Enviar consulta', { timeout: 10000 });

    await page.click('button:has-text("Enviar consulta")');

    // Validation messages should be in Spanish
    const errors = page.locator('text=Este campo es obligatorio');
    await expect(errors.first()).toBeVisible();
    const errorCount = await errors.count();
    expect(errorCount).toBeGreaterThanOrEqual(4); // At least empresa, pais, contacto, correo, mensaje
  });

  test('Spanish placeholders are correct', async ({ page }) => {
    await page.goto(`${BASE}/es/distribuidores`);
    await page.waitForSelector('text=Inicie su Alianza', { timeout: 10000 });

    await expect(page.getByPlaceholder('Nombre de su empresa')).toBeVisible();
    await expect(page.getByPlaceholder('Su nombre completo')).toBeVisible();
    await expect(page.getByPlaceholder('email@empresa.com')).toBeVisible();
    await expect(page.getByPlaceholder('Farmacos, alimentos, equipos...')).toBeVisible();
  });
});
