import { test, expect } from '@playwright/test';

// test: UX-048 - Brands listing panel shows all brands with actions
test('UX-048: Admin brands listing shows brands with create button', async ({ page }) => {
  await page.goto('/admin/marcas');

  // Wait for the brands listing to load
  await expect(page.getByRole('heading', { name: 'Marcas', level: 1 })).toBeVisible({ timeout: 15000 });

  // Verify "Crear marca" button exists
  await expect(page.getByRole('link', { name: 'Crear marca' })).toBeVisible();

  // Verify brands are displayed with country and category
  await expect(page.getByRole('heading', { name: 'Zoetis', level: 3 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Royal Canin', level: 3 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'MSD Animal Health', level: 3 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Purina Pro Plan', level: 3 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Boehringer Ingelheim', level: 3 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hills Pet Nutrition', level: 3 })).toBeVisible();

  // Verify brand cards link to edit pages
  await expect(page.getByRole('link', { name: /Zoetis/ })).toHaveAttribute('href', /\/admin\/marcas\/b1\/editar/);
});
