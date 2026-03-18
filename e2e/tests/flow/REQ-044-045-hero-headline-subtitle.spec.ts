import { test, expect } from '@playwright/test';

// test: REQ-044 - Headline principal grande en ES/EN
test('REQ-044: Hero headline is visible in Spanish', async ({ page }) => {
  await page.goto('/es');
  await page.getByText('DESDE 1989').first().waitFor({ state: 'visible' });

  const headline = page.getByRole('heading', { level: 1 });
  await expect(headline).toBeVisible();
  await expect(headline).toContainText('Conectamos la industria veterinaria con las mejores marcas del mundo');
});

test('REQ-044: Hero headline is visible in English', async ({ page }) => {
  await page.goto('/en');
  await page.getByText('SINCE 1989').first().waitFor({ state: 'visible' });

  const headline = page.getByRole('heading', { level: 1 });
  await expect(headline).toBeVisible();
  await expect(headline).toContainText("Connecting the veterinary industry with the world's best brands");
});

// test: REQ-045 - Subtitulo en ES/EN
test('REQ-045: Hero subtitle is visible in Spanish', async ({ page }) => {
  await page.goto('/es');
  await page.getByText('DESDE 1989').first().waitFor({ state: 'visible' });

  await expect(page.getByText('Importacion y distribucion de farmacos veterinarios')).toBeVisible();
});

test('REQ-045: Hero subtitle is visible in English', async ({ page }) => {
  await page.goto('/en');
  await page.getByText('SINCE 1989').first().waitFor({ state: 'visible' });

  await expect(page.getByText('Import and distribution of veterinary pharmaceuticals')).toBeVisible();
});
