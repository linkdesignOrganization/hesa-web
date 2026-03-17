import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-115: Admin Login Page', () => {
  test('Login page renders correctly', async ({ page }) => {
    await page.goto(`${BASE}/admin/login`);
    await page.waitForSelector('text=Panel de Administracion', { timeout: 10000 });

    await expect(page.getByText('HESA')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Panel de Administracion' })).toBeVisible();
    await expect(page.getByText('Inicia sesion con tu cuenta de Microsoft')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Iniciar sesion con Microsoft' })).toBeVisible();
  });

  test('Login page has Microsoft icon', async ({ page }) => {
    await page.goto(`${BASE}/admin/login`);
    await page.waitForSelector('text=Panel de Administracion', { timeout: 10000 });

    const btn = page.getByRole('button', { name: 'Iniciar sesion con Microsoft' });
    const img = btn.locator('img');
    await expect(img).toBeVisible();
  });
});
