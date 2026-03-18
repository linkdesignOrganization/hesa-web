import { test, expect } from '@playwright/test';

// test: REQ-053 - CTA navega a catalogo filtrado por categoria
test('REQ-053: "Ver farmacos" CTA navigates to catalog filtered by farmacos', async ({ page }) => {
  await page.goto('/es');
  await page.getByText('DESDE 1989').first().waitFor({ state: 'visible' });

  const ctaFarmacos = page.getByRole('link', { name: 'Ver farmacos' });
  await expect(ctaFarmacos).toHaveAttribute('href', '/es/catalogo/farmacos');
  await ctaFarmacos.click();

  await expect(page).toHaveURL(/\/es\/catalogo\/farmacos/);
  await expect(page.getByRole('heading', { name: 'Farmacos' })).toBeVisible();
});

test('REQ-053: "Ver alimentos" CTA navigates to catalog filtered by alimentos', async ({ page }) => {
  await page.goto('/es');
  await page.getByText('DESDE 1989').first().waitFor({ state: 'visible' });

  const ctaAlimentos = page.getByRole('link', { name: 'Ver alimentos' });
  await expect(ctaAlimentos).toHaveAttribute('href', '/es/catalogo/alimentos');
  await ctaAlimentos.click();

  await expect(page).toHaveURL(/\/es\/catalogo\/alimentos/);
  await expect(page.getByRole('heading', { name: 'Alimentos' })).toBeVisible();
});

test('REQ-053: "Ver equipos" CTA navigates to catalog filtered by equipos', async ({ page }) => {
  await page.goto('/es');
  await page.getByText('DESDE 1989').first().waitFor({ state: 'visible' });

  const ctaEquipos = page.getByRole('link', { name: 'Ver equipos' });
  await expect(ctaEquipos).toHaveAttribute('href', '/es/catalogo/equipos');
  await ctaEquipos.click();

  await expect(page).toHaveURL(/\/es\/catalogo\/equipos/);
  await expect(page.getByRole('heading', { name: 'Equipos' })).toBeVisible();
});
