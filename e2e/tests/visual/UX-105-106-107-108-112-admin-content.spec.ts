import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('UX-105: Categorias page has editable tags with add/remove', async ({ page }) => {
  await page.goto(`${BASE_URL}/admin/categorias`);

  await expect(page.locator('h1')).toContainText('Categorias');

  // Verify Farmacos section with removable tags
  await expect(page.locator('h2:has-text("Farmacos Veterinarios")')).toBeVisible();
  const antibioticosTag = page.locator('text=Antibioticos').first();
  await expect(antibioticosTag).toBeVisible();

  // Verify remove buttons exist
  const removeButtons = page.locator('button:has-text("Remover"), button:has-text("x")');
  const count = await removeButtons.count();
  expect(count).toBeGreaterThan(5);

  // Verify add buttons exist
  const addButtons = page.locator('button:has-text("+")');
  expect(await addButtons.count()).toBeGreaterThanOrEqual(3);
});

test('UX-106: Hero editor has preview, text fields, and language tabs', async ({ page }) => {
  await page.goto(`${BASE_URL}/admin/home/hero`);

  await expect(page.locator('h1')).toContainText('Editor del Hero');
  await expect(page.locator('button:has-text("Cambiar imagen")')).toBeVisible();
  await expect(page.locator('button:has-text("Espanol")')).toBeVisible();
  await expect(page.locator('button:has-text("English")')).toBeVisible();

  // Verify editable fields
  const tagField = page.locator('input, textarea').filter({ hasText: 'DESDE 1989' });
  await expect(tagField.or(page.locator('input[value="DESDE 1989"]'))).toBeVisible();
  await expect(page.locator('button:has-text("Guardar cambios")')).toBeVisible();
});

test('UX-107: Productos destacados has product list with add/remove', async ({ page }) => {
  await page.goto(`${BASE_URL}/admin/home/productos-destacados`);

  await expect(page.locator('h1')).toContainText('Productos Destacados');
  await expect(page.locator('button:has-text("Agregar producto")')).toBeVisible();

  // Verify featured products listed
  const productItems = page.locator('text=Amoxicilina 250ml');
  await expect(productItems.first()).toBeVisible();

  // Verify remove buttons
  const removeButtons = page.locator('button:has-text("Remover"), button:has-text("x")');
  expect(await removeButtons.count()).toBeGreaterThanOrEqual(4);

  // Verify guardar orden button
  await expect(page.locator('button:has-text("Guardar orden")')).toBeVisible();
});

test('UX-112: Equipo liderazgo has 6 editable members with drag handles', async ({ page }) => {
  await page.goto(`${BASE_URL}/admin/contenido/equipo`);

  await expect(page.locator('h1')).toContainText('Equipo de Liderazgo');
  await expect(page.locator('button:has-text("Agregar miembro")')).toBeVisible();

  // Verify 6 team members
  const members = ['Carlos Herrera M.', 'Ana Elizondo R.', 'Juan Herrera E.', 'Laura Villalobos S.', 'Roberto Mora C.', 'Patricia Chaves L.'];
  for (const member of members) {
    await expect(page.locator(`text=${member}`)).toBeVisible();
  }

  // Verify delete buttons
  const deleteButtons = page.locator('button:has-text("Eliminar"), button:has-text("x")');
  expect(await deleteButtons.count()).toBe(6);
});
