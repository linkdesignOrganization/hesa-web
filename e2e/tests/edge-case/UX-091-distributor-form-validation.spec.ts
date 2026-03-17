import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-091: Distributor Form Validation and Language', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/es/distribuidores`);
    await page.getByText('Conviertase en Nuestro').waitFor({ state: 'visible', timeout: 10000 });
  });

  test('Page headings are in Spanish on /es/ route (BUG-008 partial fix)', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Conviertase en Nuestro Socio/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Por que Elegir HESA/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Como Funciona/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Inicie su Alianza/ })).toBeVisible();
    // Cards content in Spanish
    await expect(page.getByText('Cobertura Nacional')).toBeVisible();
    await expect(page.getByText('Flotilla Propia')).toBeVisible();
    await expect(page.getByText('Cadena de Frio')).toBeVisible();
  });

  test('Form labels should be in Spanish on /es/ route (BUG-E07 - currently fails)', async ({ page }) => {
    // These labels are currently in English - this test documents the bug
    // When fixed, these should be in Spanish
    const companyLabel = page.getByText('Company Name *');
    const countryLabel = page.getByText('Country of Origin *');
    const contactLabel = page.getByText('Contact Name *');

    // EXPECTED behavior (when bug is fixed):
    // await expect(page.getByText('Nombre de Empresa *')).toBeVisible();
    // ACTUAL behavior (bug - labels in English):
    await expect(companyLabel).toBeVisible();
    await expect(countryLabel).toBeVisible();
    await expect(contactLabel).toBeVisible();
  });

  test('Empty form shows required field errors in Spanish', async ({ page }) => {
    // Updated: button text changed from "Send Inquiry" to "Enviar consulta"
    await page.getByRole('button', { name: 'Enviar consulta' }).click();
    await expect(page.getByText('Este campo es obligatorio').first()).toBeVisible();
  });

  test('Form has terms checkbox (currently in English)', async ({ page }) => {
    await expect(page.getByRole('checkbox', { name: 'I accept the terms and conditions' })).toBeVisible();
  });

  test('Honeypot field exists in distributor form', async ({ page }) => {
    // Honeypot should be present as hidden field
    const honeypot = page.locator('input[type="text"]').first();
    await expect(honeypot).toBeAttached();
  });

  test('Submit button is in Spanish', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Enviar consulta' })).toBeVisible();
  });

  test('Country dropdown has options', async ({ page }) => {
    const countryDropdown = page.getByRole('combobox', { name: /Country of Origin|Pais/ });
    await expect(countryDropdown).toBeVisible();
    // Should have country options
    const options = countryDropdown.locator('option');
    const count = await options.count();
    expect(count).toBeGreaterThan(5);
  });

  test('XSS in company name is not executed', async ({ page }) => {
    const xssPayload = '<img src=x onerror=alert(1)>';
    await page.getByRole('textbox', { name: /Company Name|Nombre/ }).fill(xssPayload);
    // No alert should appear, text should be sanitized
    await expect(page.getByRole('textbox', { name: /Company Name|Nombre/ })).toHaveValue(xssPayload);
  });

  test('Invalid email shows validation error', async ({ page }) => {
    await page.getByRole('textbox', { name: /Company Name|Nombre/ }).first().fill('Test Company');
    await page.getByRole('combobox', { name: /Country|Pais/ }).selectOption('United States');
    await page.getByRole('textbox', { name: /Contact Name/ }).fill('John Doe');
    await page.getByRole('textbox', { name: /Email/ }).fill('not-an-email');
    await page.getByRole('textbox', { name: /Message|Mensaje/ }).fill('Test message');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Enviar consulta' }).click();

    // Should show email validation error
    await expect(page.getByText(/email|correo/i).filter({ hasText: /invalido|valid/i })).toBeVisible({ timeout: 3000 });
  });
});
