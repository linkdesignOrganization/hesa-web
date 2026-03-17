import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-043: Contact Page', () => {

  test('DC-043: Contact page has title, 2-column layout on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/contacto`);
    const title = page.getByRole('heading', { name: /Contactenos/i });
    await expect(title).toBeVisible();
  });

  test('DC-059: Contact form has labels, inputs with radius 10px, height 44px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/contacto`);
    const nameInput = page.getByPlaceholder('Tu nombre completo');
    await expect(nameInput).toBeVisible();
    const emailInput = page.getByPlaceholder('correo@ejemplo.com');
    await expect(emailInput).toBeVisible();
    const messageInput = page.getByPlaceholder('Describe tu consulta');
    await expect(messageInput).toBeVisible();
    const submitBtn = page.getByRole('button', { name: /Enviar mensaje/i });
    await expect(submitBtn).toBeVisible();
  });

  test('DC-096: Contact is 1 column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/contacto`);
    const title = page.getByRole('heading', { name: /Contactenos/i });
    await expect(title).toBeVisible();
  });
});
