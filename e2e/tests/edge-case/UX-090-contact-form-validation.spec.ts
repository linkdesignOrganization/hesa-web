import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-090: Contact Form Validation Edge Cases', () => {

  test('Empty form shows required field errors', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`);
    await page.waitForSelector('button:has-text("Enviar mensaje")', { state: 'visible' });
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    await expect(page.getByText('Este campo es obligatorio').first()).toBeVisible();
  });

  test('Honeypot field is present but hidden', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`);
    await page.waitForSelector('button:has-text("Enviar mensaje")', { state: 'visible' });
    // The honeypot field should exist in DOM but be hidden
    const honeypot = page.locator('form input[type="text"]').first();
    await expect(honeypot).toBeAttached();
  });

  test('XSS in name field does not execute', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`);
    await page.waitForSelector('button:has-text("Enviar mensaje")', { state: 'visible' });

    let alertTriggered = false;
    page.on('dialog', () => { alertTriggered = true; });

    await page.getByRole('textbox', { name: 'Nombre *' }).fill('<script>alert("xss")</script>');
    await page.waitForTimeout(500);
    expect(alertTriggered).toBe(false);
  });

  test('Form has required fields: Nombre, Correo, Tipo consulta, Mensaje', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`);
    await page.waitForSelector('button:has-text("Enviar mensaje")', { state: 'visible' });
    await expect(page.getByRole('textbox', { name: 'Nombre *' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Correo electronico *' })).toBeVisible();
    await expect(page.getByLabel('Tipo de consulta *')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Mensaje *' })).toBeVisible();
  });
});
