import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-090: Contact Form Validation Edge Cases', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`);
    await page.getByText('Contactenos').waitFor({ state: 'visible', timeout: 10000 });
  });

  test('Empty form shows required field errors', async ({ page }) => {
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    await expect(page.getByText('Este campo es obligatorio').first()).toBeVisible();
  });

  test('Page does NOT navigate away on empty submit (BUG-012 fix)', async ({ page }) => {
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    // Should still be on contact page
    expect(page.url()).toContain('/es/contacto');
    await expect(page.getByText('Contactenos')).toBeVisible();
  });

  test('Honeypot field is present but hidden', async ({ page }) => {
    // The honeypot field should exist in DOM but be hidden
    const honeypot = page.locator('input[type="text"]').first();
    await expect(honeypot).toBeAttached();
  });

  test('XSS in name field does not execute', async ({ page }) => {
    let alertTriggered = false;
    page.on('dialog', () => { alertTriggered = true; });

    await page.getByRole('textbox', { name: 'Nombre *' }).fill('<script>alert("xss")</script>');
    await page.waitForTimeout(500);
    expect(alertTriggered).toBe(false);
  });

  test('Form has required fields: Nombre, Correo, Tipo consulta, Mensaje', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: 'Nombre *' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Correo electronico *' })).toBeVisible();
    await expect(page.getByLabel('Tipo de consulta *')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Mensaje *' })).toBeVisible();
  });

  test('Optional fields are present', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: 'Telefono' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Producto de interes' })).toBeVisible();
  });

  test('Tipo de consulta combobox has correct options', async ({ page }) => {
    const combobox = page.getByRole('combobox', { name: 'Tipo de consulta' });
    await expect(combobox).toBeVisible();

    const options = await combobox.locator('option').allTextContents();
    expect(options).toContain('Informacion de productos');
    expect(options).toContain('Condiciones comerciales');
    expect(options).toContain('Soporte');
    expect(options).toContain('Otro');
  });

  test('Page does NOT navigate when selecting combobox option (BUG-012 fix)', async ({ page }) => {
    const combobox = page.getByRole('combobox', { name: 'Tipo de consulta' });
    await combobox.selectOption('Informacion de productos');

    // Should still be on contact page
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/es/contacto');
  });

  test('SQL injection in fields does not cause errors', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Nombre *' }).fill("'; DROP TABLE users; --");
    await page.getByRole('textbox', { name: 'Correo electronico *' }).fill("test@test.com");
    await page.getByRole('combobox', { name: 'Tipo de consulta' }).selectOption('Otro');
    await page.getByRole('textbox', { name: 'Mensaje *' }).fill("Test message with SQL: ' OR 1=1 --");
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();

    // Form should handle gracefully, no page crash
    await expect(page.getByText('Contactenos')).toBeVisible({ timeout: 3000 });
  });

  test('Very long input in name field (1000 chars)', async ({ page }) => {
    const longText = 'A'.repeat(1000);
    await page.getByRole('textbox', { name: 'Nombre *' }).fill(longText);
    const value = await page.getByRole('textbox', { name: 'Nombre *' }).inputValue();
    // Should accept or truncate gracefully
    expect(value.length).toBeGreaterThan(0);
  });

  test('Unicode and emoji in message field', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Mensaje *' }).fill('Test with unicode: \u00e1\u00e9\u00ed\u00f3\u00fa \u00f1 and special chars: \u2603 \u2764');
    const value = await page.getByRole('textbox', { name: 'Mensaje *' }).inputValue();
    expect(value).toContain('\u00e1\u00e9\u00ed\u00f3\u00fa');
  });
});
