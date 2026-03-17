import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-100/UX-101: Drag-drop zones para imagenes y PDF', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/crear`, { waitUntil: 'networkidle', timeout: 30000 });
    // Retry if public site loads
    const heading = page.getByRole('heading', { name: 'Crear Producto', level: 1 });
    if (!(await heading.isVisible({ timeout: 5000 }).catch(() => false))) {
      await page.goto(`${BASE_URL}/admin/productos/crear`, { waitUntil: 'networkidle', timeout: 30000 });
    }
  });

  test('UX-100: zona drag-drop de imagenes es visible', async ({ page }) => {
    const uploadText = page.getByText('Arrastra imagenes aqui o selecciona archivos');
    await uploadText.scrollIntoViewIfNeeded();
    await expect(uploadText).toBeVisible({ timeout: 10000 });
  });

  test('UX-100: zona de imagenes muestra restricciones de formato', async ({ page }) => {
    await expect(page.getByText('PNG, JPG hasta 5MB')).toBeVisible({ timeout: 10000 });
  });

  test('UX-100: seccion imagenes tiene heading correcto', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Imagenes', level: 2 });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('UX-100: seccion imagenes tiene descripcion', async ({ page }) => {
    await expect(
      page.getByText('Sube las fotos del producto. La primera sera la imagen principal.')
    ).toBeVisible({ timeout: 10000 });
  });

  test('UX-101: zona drag-drop de PDF es visible', async ({ page }) => {
    const pdfText = page.getByText('Arrastra el PDF aqui o selecciona archivo');
    await pdfText.scrollIntoViewIfNeeded();
    await expect(pdfText).toBeVisible({ timeout: 10000 });
  });

  test('UX-101: seccion PDF tiene heading correcto', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Ficha Tecnica (PDF)', level: 2 });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('UX-101: seccion PDF marca como opcional', async ({ page }) => {
    await expect(
      page.getByText('Sube la ficha tecnica del producto en formato PDF (opcional)')
    ).toBeVisible({ timeout: 10000 });
  });

  test('zonas de upload son clickables', async ({ page }) => {
    // La zona de imagenes debe tener cursor pointer
    const imageZone = page.getByText('Arrastra imagenes aqui o selecciona archivos').locator('..');
    await imageZone.scrollIntoViewIfNeeded();
    const cursor = await imageZone.evaluate(el => getComputedStyle(el).cursor);
    expect(cursor).toBe('pointer');
  });
});
