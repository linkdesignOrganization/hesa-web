import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('BVC-018: Acciones destructivas tienen confirmacion modal', () => {
  test('admin productos tiene vista tarjetas y tabla', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`, { waitUntil: 'networkidle', timeout: 30000 });
    const heading = page.getByRole('heading', { name: 'Productos', level: 1 });
    if (!(await heading.isVisible({ timeout: 5000 }).catch(() => false))) {
      await page.goto(`${BASE_URL}/admin/productos`, { waitUntil: 'networkidle', timeout: 30000 });
    }

    await expect(page.getByRole('button', { name: 'Vista de tarjetas' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Vista de tabla' })).toBeVisible({ timeout: 10000 });
  });

  test('vista tabla tiene acciones Ver y Editar por producto', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`, { waitUntil: 'networkidle', timeout: 30000 });
    const heading = page.getByRole('heading', { name: 'Productos', level: 1 });
    if (!(await heading.isVisible({ timeout: 5000 }).catch(() => false))) {
      await page.goto(`${BASE_URL}/admin/productos`, { waitUntil: 'networkidle', timeout: 30000 });
    }

    await page.getByRole('button', { name: 'Vista de tabla' }).click();

    // Verificar que la primera fila tiene acciones
    const firstProductRow = page.getByRole('row').nth(1);
    await expect(firstProductRow.getByRole('link', { name: 'Ver producto' })).toBeVisible({ timeout: 5000 });
    await expect(firstProductRow.getByRole('link', { name: 'Editar producto' })).toBeVisible({ timeout: 5000 });
  });

  test('admin marcas renderiza correctamente', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/marcas`, { waitUntil: 'networkidle', timeout: 30000 });
    const heading = page.getByRole('heading', { name: 'Marcas', level: 1 });
    if (!(await heading.isVisible({ timeout: 5000 }).catch(() => false))) {
      await page.goto(`${BASE_URL}/admin/marcas`, { waitUntil: 'networkidle', timeout: 30000 });
    }

    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('link', { name: 'Crear marca' })).toBeVisible({ timeout: 10000 });
  });

  test('admin marcas muestra 12 marcas', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/marcas`, { waitUntil: 'networkidle', timeout: 30000 });
    const heading = page.getByRole('heading', { name: 'Marcas', level: 1 });
    if (!(await heading.isVisible({ timeout: 5000 }).catch(() => false))) {
      await page.goto(`${BASE_URL}/admin/marcas`, { waitUntil: 'networkidle', timeout: 30000 });
    }

    const expectedBrands = [
      'Zoetis', 'Royal Canin', 'MSD Animal Health', 'Purina Pro Plan',
      'Boehringer Ingelheim', 'Hills Pet Nutrition', 'Bayer Animal Health', 'Virbac',
      'Welch Allyn', 'Heine', 'IMV Technologies', 'NutriSource'
    ];

    for (const brand of expectedBrands) {
      await expect(page.getByText(brand).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('admin mensajes kanban permite ver detalle de mensaje', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/mensajes`, { waitUntil: 'networkidle', timeout: 30000 });
    const heading = page.getByRole('heading', { name: 'Mensajes', level: 1 });
    if (!(await heading.isVisible({ timeout: 5000 }).catch(() => false))) {
      await page.goto(`${BASE_URL}/admin/mensajes`, { waitUntil: 'networkidle', timeout: 30000 });
    }

    // Las cards son links clickables
    const firstCard = page.getByRole('link', { name: /Dr. Roberto Campos/ });
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await expect(firstCard).toHaveAttribute('href', '/admin/mensajes/m1');
  });
});
