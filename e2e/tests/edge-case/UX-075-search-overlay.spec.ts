import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-075: Search Overlay Edge Cases', () => {

  test('Search overlay opens with auto-focus on click', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.getByRole('button', { name: 'Buscar productos y marcas' }).click();
    const searchInput = page.getByRole('textbox', { name: 'Buscar productos, marcas...' });
    await expect(searchInput).toBeFocused();
  });

  test('Minimum character hint shown for 0-2 characters', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.getByRole('button', { name: 'Buscar productos y marcas' }).click();
    const hint = page.getByText('Escribe al menos 3 caracteres');
    await expect(hint).toBeVisible();

    // Type 1 character
    await page.getByRole('textbox', { name: 'Buscar productos, marcas...' }).fill('a');
    await expect(hint).toBeVisible();

    // Type 2 characters
    await page.getByRole('textbox', { name: 'Buscar productos, marcas...' }).fill('ab');
    await expect(hint).toBeVisible();
  });

  test('Results appear for 3+ characters', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.getByRole('button', { name: 'Buscar productos y marcas' }).click();
    await page.getByRole('textbox', { name: 'Buscar productos, marcas...' }).pressSequentially('amox');
    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(page.getByText('PRODUCTOS')).toBeVisible();
  });

  test('XSS in search input does not execute script', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.getByRole('button', { name: 'Buscar productos y marcas' }).click();

    let alertTriggered = false;
    page.on('dialog', () => { alertTriggered = true; });

    await page.getByRole('textbox', { name: 'Buscar productos, marcas...' }).fill('<script>alert("xss")</script>');
    await page.waitForTimeout(500);
    expect(alertTriggered).toBe(false);
  });

  test('Close search overlay with close button', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.getByRole('button', { name: 'Buscar productos y marcas' }).click();
    await expect(page.getByRole('search', { name: 'Busqueda global' })).toBeVisible();
    await page.getByRole('button', { name: 'Cerrar busqueda' }).click();
  });
});
