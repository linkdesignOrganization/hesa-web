import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-083: PDF Download CTA', () => {

  test('Product with PDF shows download button', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.mouse.wheel(0, 300);
    await expect(page.getByRole('button', { name: 'Descargar ficha tecnica' })).toBeVisible();
  });
});

test.describe('UX-084: Category Blocks CTA Navigation', () => {

  test('Home category block CTA navigates to filtered catalog', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    const link = page.getByRole('link', { name: 'Ver farmacos' });
    await expect(link).toHaveAttribute('href', '/es/catalogo/farmacos');
  });

  test('Alimentos category block CTA navigates correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    const link = page.getByRole('link', { name: 'Ver alimentos' });
    await expect(link).toHaveAttribute('href', '/es/catalogo/alimentos');
  });

  test('Equipos category block CTA navigates correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    const link = page.getByRole('link', { name: 'Ver equipos' });
    await expect(link).toHaveAttribute('href', '/es/catalogo/equipos');
  });
});

test.describe('UX-085: Featured Products Carousel', () => {

  test('Carousel has navigation arrows', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await expect(page.getByRole('button', { name: 'Productos anteriores' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Productos siguientes' })).toBeVisible();
  });

  test('Carousel card clicks navigate to product detail', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    const firstCard = page.getByRole('link', { name: /Ver Amoxicilina 250ml/ });
    await expect(firstCard).toHaveAttribute('href', /\/es\/catalogo\/farmacos\/amoxicilina-250ml/);
  });
});
