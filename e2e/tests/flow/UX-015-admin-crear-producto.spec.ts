import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-015 - Flujo completo admin crear producto
test.describe('UX-015: Admin crear producto E2E', () => {

  test('formulario crear producto tiene 5 secciones', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos/crear`);
    await expect(page.getByRole('heading', { name: 'Crear Producto', level: 1 })).toBeVisible({ timeout: 10000 });
    // Section 1: Informacion Basica
    await expect(page.getByRole('heading', { name: 'Informacion Basica', level: 2 })).toBeVisible();
    // Section 2: Especies y Clasificacion
    await expect(page.getByRole('heading', { name: 'Especies y Clasificacion', level: 2 })).toBeVisible();
    // Section 3: Descripcion y Contenido
    await expect(page.getByRole('heading', { name: 'Descripcion y Contenido', level: 2 })).toBeVisible();
    // Section 4: Imagenes
    await expect(page.getByRole('heading', { name: 'Imagenes', level: 2 })).toBeVisible();
    // Section 5: Ficha Tecnica
    await expect(page.getByRole('heading', { name: 'Ficha Tecnica (PDF)', level: 2 })).toBeVisible();
    // Section 6: Configuracion
    await expect(page.getByRole('heading', { name: 'Configuracion', level: 2 })).toBeVisible();
  });

  test('formulario tiene campos requeridos', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos/crear`);
    await expect(page.getByRole('heading', { name: 'Crear Producto', level: 1 })).toBeVisible({ timeout: 10000 });
    // Required fields
    await expect(page.getByLabel('Nombre del producto *')).toBeVisible();
    await expect(page.getByLabel('Marca *')).toBeVisible();
    await expect(page.getByText('Categoria *')).toBeVisible();
    await expect(page.getByLabel('Descripcion *')).toBeVisible();
  });

  test('categoria selector has 3 options', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos/crear`);
    await expect(page.getByRole('heading', { name: 'Crear Producto', level: 1 })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Farmacos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Alimentos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Equipos' })).toBeVisible();
  });

  test('bilingual tabs ES/EN present', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos/crear`);
    await expect(page.getByRole('heading', { name: 'Crear Producto', level: 1 })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Espanol' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'English' })).toBeVisible();
  });

  test('action buttons present', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos/crear`);
    await expect(page.getByRole('heading', { name: 'Crear Producto', level: 1 })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Guardar producto' })).toBeVisible();
  });

  test('drag-drop zones for images and PDF', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos/crear`);
    await expect(page.getByRole('heading', { name: 'Crear Producto', level: 1 })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Arrastra imagenes aqui o selecciona archivos')).toBeVisible();
    await expect(page.getByText('Arrastra el PDF aqui o selecciona archivo')).toBeVisible();
  });

  test('toggle switches for active and featured', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos/crear`);
    await expect(page.getByRole('heading', { name: 'Crear Producto', level: 1 })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Producto activo')).toBeVisible();
    await expect(page.getByText('Producto destacado')).toBeVisible();
    // Active checkbox should be checked by default
    const activeCheckbox = page.getByRole('checkbox').first();
    await expect(activeCheckbox).toBeChecked();
  });
});
