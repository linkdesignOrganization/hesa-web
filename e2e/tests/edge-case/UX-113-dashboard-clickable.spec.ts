import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-113: Dashboard Cards Clickable', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForSelector('button:has-text("Iniciar sesion con Microsoft")', { state: 'visible' });
    await page.getByRole('button', { name: 'Iniciar sesion con Microsoft' }).click();
    await page.waitForURL('**/admin/dashboard');
  });

  test('Category cards navigate to filtered product list', async ({ page }) => {
    const farmacosLink = page.getByRole('link', { name: /Farmacos.*activos/ });
    await expect(farmacosLink).toHaveAttribute('href', '/admin/productos?categoria=farmacos');
  });

  test('Messages "Ver todos" link navigates to messages', async ({ page }) => {
    const verTodosLink = page.getByRole('link', { name: 'Ver todos' }).first();
    await expect(verTodosLink).toHaveAttribute('href', '/admin/mensajes');
  });

  test('Message items navigate to message detail', async ({ page }) => {
    const messageLink = page.getByRole('link', { name: /Informacion.*Buenas tardes/ });
    await expect(messageLink).toHaveAttribute('href', '/admin/mensajes/m1');
  });
});
