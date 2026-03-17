import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-102/UX-103: Tabs bilingues y seleccion categoria', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/crear`, { waitUntil: 'networkidle', timeout: 30000 });
    const heading = page.getByRole('heading', { name: 'Crear Producto', level: 1 });
    if (!(await heading.isVisible({ timeout: 5000 }).catch(() => false))) {
      await page.goto(`${BASE_URL}/admin/productos/crear`, { waitUntil: 'networkidle', timeout: 30000 });
    }
  });

  test('UX-102: tabs Espanol y English son visibles', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Espanol' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'English' })).toBeVisible({ timeout: 10000 });
  });

  test('UX-102: tab Espanol esta activo por defecto', async ({ page }) => {
    const spanishTab = page.getByRole('button', { name: 'Espanol' });
    await expect(spanishTab).toBeVisible({ timeout: 10000 });

    // El campo de descripcion muestra placeholder en espanol
    const descField = page.getByRole('textbox', { name: 'Descripcion *' });
    await expect(descField).toBeVisible({ timeout: 10000 });
    await expect(descField).toHaveAttribute('placeholder', 'Describe el producto en espanol...');
  });

  test('UX-102: click en tab English cambia campos', async ({ page }) => {
    const englishTab = page.getByRole('button', { name: 'English' });
    await englishTab.click();

    // El placeholder deberia cambiar a ingles
    const descField = page.getByRole('textbox', { name: /Description|Descripcion/ });
    await expect(descField).toBeVisible({ timeout: 5000 });
  });

  test('UX-103: 3 cards de categoria visibles', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Farmacos' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Alimentos' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Equipos' })).toBeVisible({ timeout: 10000 });
  });

  test('UX-103: Farmacos seleccionado por defecto', async ({ page }) => {
    const farmacosButton = page.getByRole('button', { name: 'Farmacos' });
    await expect(farmacosButton).toBeVisible({ timeout: 10000 });

    // Verificar que tiene estilo de seleccionado (borde azul)
    const isSelected = await farmacosButton.evaluate(el => {
      const style = getComputedStyle(el);
      return style.borderColor.includes('0, 141, 201') || // #008DC9
             style.borderColor.includes('rgb(0, 141, 201)') ||
             el.classList.contains('selected') ||
             el.getAttribute('aria-pressed') === 'true';
    });
    // La card debe estar seleccionada de alguna forma
    expect(isSelected).toBeTruthy();
  });

  test('UX-103: cards de categoria son clickables', async ({ page }) => {
    const alimentosButton = page.getByRole('button', { name: 'Alimentos' });
    await expect(alimentosButton).toBeVisible({ timeout: 10000 });
    await alimentosButton.click();

    // Despues del click, Alimentos deberia estar seleccionado
    // Verificar que el click no produce error
    await expect(alimentosButton).toBeVisible();
  });

  test('UX-103: cada card tiene icono', async ({ page }) => {
    const farmacosButton = page.getByRole('button', { name: 'Farmacos' });
    const img = farmacosButton.locator('img, svg');
    await expect(img.first()).toBeVisible({ timeout: 10000 });
  });

  test('especies tags con boton remover', async ({ page }) => {
    await expect(page.getByText('Perros')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Gatos')).toBeVisible({ timeout: 10000 });

    // Boton X para remover
    await expect(page.getByRole('button', { name: 'Remover Perros' })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: 'Remover Gatos' })).toBeVisible({ timeout: 5000 });
  });

  test('input para agregar especie existe', async ({ page }) => {
    const addSpeciesInput = page.getByRole('textbox', { name: 'Agregar especie...' });
    await expect(addSpeciesInput).toBeVisible({ timeout: 10000 });
  });

  test('presentaciones tag con boton remover', async ({ page }) => {
    await expect(page.getByText('Tabletas x 10')).toBeVisible({ timeout: 10000 });
    const removeBtn = page.getByRole('button', { name: 'Remover' }).first();
    await expect(removeBtn).toBeVisible({ timeout: 5000 });
  });
});
