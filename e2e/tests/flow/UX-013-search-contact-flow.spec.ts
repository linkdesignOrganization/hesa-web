import { test, expect } from '@playwright/test';

// test: UX-013 - Complete search-to-contact flow without CRM interruption
test('UX-013: Search product -> view detail -> request info -> contact form pre-populated', async ({ page }) => {
  await page.goto('/es/');

  // Step 1: Open search and search for a product
  await page.getByRole('button', { name: 'Buscar productos y marcas' }).click();
  const searchInput = page.getByRole('textbox', { name: 'Buscar productos, marcas...' });
  await expect(searchInput).toBeVisible();
  await searchInput.pressSequentially('amox');

  // Step 2: Verify search results appear
  await expect(page.getByText('PRODUCTOS (2)')).toBeVisible();
  await expect(page.getByRole('option', { name: 'Amoxicilina 250ml Zoetis' })).toBeVisible();

  // Step 3: Click on the first result to view product detail
  await page.getByRole('option', { name: 'Amoxicilina 250ml Zoetis' }).click();

  // Step 4: Verify product detail page loaded
  await expect(page).toHaveURL(/\/es\/catalogo\/farmacos\/amoxicilina-250ml/);
  await expect(page.getByRole('heading', { name: 'Amoxicilina 250ml', level: 1 })).toBeVisible();
  await expect(page.getByText('Zoetis')).toBeVisible();

  // Step 5: Click "Solicitar informacion" to go to contact
  await page.locator('section').getByRole('link', { name: 'Solicitar informacion' }).click();

  // Step 6: Verify contact form is loaded with product pre-populated
  await expect(page).toHaveURL(/\/es\/contacto\?producto=amoxicilina-250ml/);
  await expect(page.getByRole('heading', { name: 'Contactenos' })).toBeVisible();

  // Verify product field is pre-populated
  const productField = page.getByRole('textbox', { name: 'Producto de interes' });
  await expect(productField).toHaveValue(/amoxicilina/i);
});
