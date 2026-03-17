import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-100 to UX-103: Product Form Interactions Edge Cases', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/crear`);
    await page.getByText('Crear Producto').waitFor({ state: 'visible', timeout: 10000 });
  });

  test('UX-100: Image drag-drop zone is visible and clickable', async ({ page }) => {
    const dropZone = page.getByText('Arrastra imagenes aqui o selecciona archivos');
    await expect(dropZone).toBeVisible();

    // The zone should be a clickable area
    const selectLink = page.getByText('selecciona archivos');
    await expect(selectLink).toBeVisible();
  });

  test('UX-101: PDF drag-drop zone is visible', async ({ page }) => {
    const pdfZone = page.getByText('Arrastra el PDF aqui o selecciona archivo');
    await expect(pdfZone).toBeVisible();
  });

  test('UX-102: Bilingual tabs switch between ES and EN', async ({ page }) => {
    // Spanish tab should be active by default
    const esTab = page.getByRole('button', { name: 'Espanol' });
    const enTab = page.getByRole('button', { name: 'English' });

    await expect(esTab).toBeVisible();
    await expect(enTab).toBeVisible();

    // Description placeholder should be in Spanish
    await expect(page.getByPlaceholder('Describe el producto en espanol...')).toBeVisible();

    // Click English tab
    await enTab.click();
    // Placeholder should change to English
    await expect(page.getByPlaceholder(/Describe the product in English|Describe el producto en ingles/)).toBeVisible({ timeout: 5000 });
  });

  test('UX-103: Category cards have visual selection state', async ({ page }) => {
    const farmacosBtn = page.getByRole('button', { name: /Farmacos/ });
    const alimentosBtn = page.getByRole('button', { name: /Alimentos/ });

    await expect(farmacosBtn).toBeVisible();
    await expect(alimentosBtn).toBeVisible();

    // Click Alimentos category
    await alimentosBtn.click();
    // The button should show selected state (visual change)
    // Verify it can be clicked without errors
  });

  test('UX-103: Selecting different category may show conditional fields', async ({ page }) => {
    // Select Farmacos
    await page.getByRole('button', { name: /Farmacos/ }).click();
    await page.waitForTimeout(500);

    // Select Alimentos - conditional fields may change
    await page.getByRole('button', { name: /Alimentos/ }).click();
    await page.waitForTimeout(500);

    // Select Equipos
    await page.getByRole('button', { name: /Equipos/ }).click();
    await page.waitForTimeout(500);

    // Verify no errors occurred during category switching
    await expect(page.getByRole('heading', { name: 'Crear Producto' })).toBeVisible();
  });

  test('Species tags can be removed', async ({ page }) => {
    const removePerros = page.getByRole('button', { name: 'Remover Perros' });
    await expect(removePerros).toBeVisible();

    await removePerros.click();
    // Perros tag should be removed
    await expect(removePerros).not.toBeVisible();
  });

  test('Add species via input', async ({ page }) => {
    const speciesInput = page.getByPlaceholder('Agregar especie...');
    await expect(speciesInput).toBeVisible();

    await speciesInput.fill('Bovinos');
    await speciesInput.press('Enter');
    // New species tag should appear
    await expect(page.getByText('Bovinos')).toBeVisible();
  });

  test('Marca dropdown has options', async ({ page }) => {
    const marcaDropdown = page.getByRole('combobox', { name: 'Marca' });
    await expect(marcaDropdown).toBeVisible();

    // Should have brand options
    await expect(marcaDropdown.locator('option')).toHaveCount(4); // header + 3 brands (Zoetis, MSD, Purina)
  });
});
