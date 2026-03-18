import { test, expect } from '@playwright/test';

// test: REQ-051 - 3 bloques (Farmacos, Alimentos, Equipos)
test('REQ-051: Three category blocks are visible on home page', async ({ page }) => {
  await page.goto('/es');
  await page.getByText('DESDE 1989').first().waitFor({ state: 'visible' });

  // Verify all 3 category blocks
  await expect(page.getByRole('heading', { name: 'Farmacos Veterinarios' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Alimentos para Animales' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Equipos Veterinarios' })).toBeVisible();
});
