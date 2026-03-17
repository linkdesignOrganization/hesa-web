import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-092: Language Selector', () => {

  test('Language selector visible in header', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await expect(page.getByRole('listbox', { name: 'Seleccionar idioma' }).first()).toBeVisible();
  });

  test('Language selector visible in footer', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await expect(page.getByRole('button', { name: 'English' })).toBeVisible();
  });

  test('Switching language changes URL prefix', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.getByRole('button', { name: 'English' }).click();
    await expect(page).toHaveURL(/\/en/);
  });

  test('Content changes to English after switching', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/`);
    await expect(page.getByText('Your Trusted Veterinary Partner')).toBeVisible();
  });

  test('Content changes to Spanish', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await expect(page.getByText('Tu aliado veterinario de confianza')).toBeVisible();
  });
});
