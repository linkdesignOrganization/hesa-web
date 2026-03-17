import { test, expect } from '@playwright/test';

// test: UX-027 - Product detail via deep link is stable, no CRM redirect
test('UX-027: Product detail loads via deep link without redirect', async ({ page }) => {
  // Navigate directly to a product detail page
  await page.goto('/es/catalogo/farmacos/amoxicilina-250ml');

  // Wait for the product detail to load
  await expect(page.getByRole('heading', { name: 'Amoxicilina 250ml', level: 1 })).toBeVisible({ timeout: 15000 });

  // Verify breadcrumb shows the full path
  await expect(page.getByRole('link', { name: 'Inicio' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Catalogo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Farmacos' })).toBeVisible();

  // Verify product content is present
  await expect(page.getByText('Zoetis')).toBeVisible();
  await expect(page.getByText('Caninos')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Solicitar informacion' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Consultar por WhatsApp' })).toBeVisible();

  // Verify URL stayed stable (no CRM redirect)
  await expect(page).toHaveURL(/\/es\/catalogo\/farmacos\/amoxicilina-250ml/);
});
