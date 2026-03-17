import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-078: Pagination Edge Cases', () => {

  test('Pagination shows correct info text', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await expect(page.getByText('Mostrando 1-12 de 47 productos')).toBeVisible();
  });

  test('Previous button disabled on first page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    const prevButton = page.getByRole('button', { name: 'Pagina anterior' });
    await expect(prevButton).toBeDisabled();
  });

  test('Next button navigates to page 2', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.getByRole('button', { name: 'Pagina siguiente' }).click();
    await expect(page.getByText('Mostrando 13-24 de 47 productos')).toBeVisible();
  });

  test('Page numbers are clickable', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.getByRole('button', { name: '3' }).click();
    await expect(page.getByText(/Mostrando 25-/)).toBeVisible();
  });
});
