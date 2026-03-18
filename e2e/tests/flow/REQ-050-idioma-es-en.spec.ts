import { test, expect } from '@playwright/test';

// test: REQ-050 - Textos del hero en idioma seleccionado (ES/EN)
test('REQ-050: Hero texts change when switching from ES to EN', async ({ page }) => {
  // Load Spanish home
  await page.goto('/es');
  await page.getByText('DESDE 1989').first().waitFor({ state: 'visible' });

  // Verify Spanish content
  await expect(page.getByText('DESDE 1989').first()).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Conectamos la industria veterinaria');
  await expect(page.getByRole('link', { name: 'Explorar catalogo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Distribuya con nosotros' })).toBeVisible();

  // Navigate to English home
  await page.goto('/en');
  await page.getByText('SINCE 1989').first().waitFor({ state: 'visible' });

  // Verify English content
  await expect(page.getByText('SINCE 1989').first()).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toContainText("Connecting the veterinary industry");
  await expect(page.getByRole('link', { name: 'Explore catalog' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Partner with us' })).toBeVisible();
});
