import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-002 - Deep linking rutas ES deben renderizar la pagina correcta
test.describe('UX-002: Deep linking rutas ES', () => {

  test('catalogo farmacos via deep link', async ({ page }) => {
    await page.goto(`${BASE}/es/catalogo/farmacos`);
    await expect(page.getByRole('heading', { name: 'Farmacos Veterinarios', level: 1 })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('productos')).toBeVisible();
  });

  test('catalogo alimentos via deep link', async ({ page }) => {
    await page.goto(`${BASE}/es/catalogo/alimentos`);
    await expect(page.getByRole('heading', { name: 'Alimentos para Animales', level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('catalogo equipos via deep link', async ({ page }) => {
    await page.goto(`${BASE}/es/catalogo/equipos`);
    await expect(page.getByRole('heading', { name: 'Equipos Veterinarios', level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('marcas via deep link', async ({ page }) => {
    await page.goto(`${BASE}/es/marcas`);
    await expect(page.getByRole('heading', { name: 'Nuestras Marcas', level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('nosotros via deep link', async ({ page }) => {
    await page.goto(`${BASE}/es/nosotros`);
    await expect(page.getByRole('heading', { name: 'Herrera y Elizondo S.A.', level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('distribuidores via deep link', async ({ page }) => {
    await page.goto(`${BASE}/es/distribuidores`);
    await expect(page.getByText('Conviertase en Nuestro')).toBeVisible({ timeout: 10000 });
  });

  test('contacto via deep link', async ({ page }) => {
    await page.goto(`${BASE}/es/contacto`);
    await expect(page.getByRole('heading', { name: 'Contactenos', level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('catalogo general via deep link', async ({ page }) => {
    await page.goto(`${BASE}/es/catalogo`);
    await expect(page.getByText('productos')).toBeVisible({ timeout: 10000 });
  });
});
