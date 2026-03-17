import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-070 - Categorias mock con subcategorias editables en panel admin
test.describe('UX-070: Admin categorias panel', () => {

  test('3 categorias con subcategorias visibles', async ({ page }) => {
    await page.goto(`${BASE}/admin/categorias`);
    await expect(page.getByRole('heading', { name: 'Categorias y Filtros', level: 1 })).toBeVisible({ timeout: 10000 });
    // 3 categories
    await expect(page.getByText('Farmacos Veterinarios')).toBeVisible();
    await expect(page.getByText('Alimentos para Animales')).toBeVisible();
    await expect(page.getByText('Equipos Veterinarios')).toBeVisible();
  });

  test('farmacos has familia and especie tags', async ({ page }) => {
    await page.goto(`${BASE}/admin/categorias`);
    await expect(page.getByText('Categorias y Filtros')).toBeVisible({ timeout: 10000 });
    // Familia farmaceutica tags
    await expect(page.getByText('Antibioticos')).toBeVisible();
    await expect(page.getByText('Desparasitantes')).toBeVisible();
    await expect(page.getByText('Vitaminas')).toBeVisible();
    await expect(page.getByText('Analgosicos')).toBeVisible();
    await expect(page.getByText('Antiinflamatorios')).toBeVisible();
    // Especie tags
    await expect(page.getByText('Caninos').first()).toBeVisible();
    await expect(page.getByText('Felinos').first()).toBeVisible();
    await expect(page.getByText('Bovinos')).toBeVisible();
  });

  test('alimentos has etapa de vida tags', async ({ page }) => {
    await page.goto(`${BASE}/admin/categorias`);
    await expect(page.getByText('Categorias y Filtros')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Cachorro/Kitten')).toBeVisible();
    await expect(page.getByText('Adulto')).toBeVisible();
    await expect(page.getByText('Senior')).toBeVisible();
  });

  test('equipos has tipo tags', async ({ page }) => {
    await page.goto(`${BASE}/admin/categorias`);
    await expect(page.getByText('Categorias y Filtros')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Diagnostico')).toBeVisible();
    await expect(page.getByText('Quirurgico')).toBeVisible();
    await expect(page.getByText('Laboratorio')).toBeVisible();
    await expect(page.getByText('Instrumental')).toBeVisible();
  });

  test('tags have remove buttons (editable)', async ({ page }) => {
    await page.goto(`${BASE}/admin/categorias`);
    await expect(page.getByText('Categorias y Filtros')).toBeVisible({ timeout: 10000 });
    // Each tag should have an "x" remove button
    const removeButtons = page.getByRole('button', { name: /Remover|×/ });
    await expect(removeButtons.first()).toBeVisible();
  });
});
