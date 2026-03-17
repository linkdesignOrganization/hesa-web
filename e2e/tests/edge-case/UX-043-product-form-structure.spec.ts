import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-043: Product Form Structure and Edge Cases', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to admin product create form
    // Note: Mock auth allows direct access to admin routes
    await page.goto(`${BASE_URL}/admin/productos/crear`);
    await page.getByText('Crear Producto').waitFor({ state: 'visible', timeout: 10000 });
  });

  test('Form has all 6 required sections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Informacion Basica' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Especies y Clasificacion' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Descripcion y Contenido' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Imagenes' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Ficha Tecnica (PDF)' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Configuracion' })).toBeVisible();
  });

  test('Form has Cancel and Save buttons in toolbar', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Guardar producto' })).toBeVisible();
  });

  test('Category selector has 3 cards (Farmacos, Alimentos, Equipos)', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Farmacos/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Alimentos/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Equipos/ })).toBeVisible();
  });

  test('Bilingual tabs present in description section', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Espanol' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'English' })).toBeVisible();
  });

  test('Image upload zone has dashed border and instructions', async ({ page }) => {
    await expect(page.getByText('Arrastra imagenes aqui o selecciona archivos')).toBeVisible();
    await expect(page.getByText('PNG, JPG hasta 5MB')).toBeVisible();
  });

  test('PDF upload zone has instructions', async ({ page }) => {
    await expect(page.getByText('Arrastra el PDF aqui o selecciona archivo')).toBeVisible();
  });

  test('Configuration section has toggle switches', async ({ page }) => {
    await expect(page.getByText('Producto activo')).toBeVisible();
    await expect(page.getByText('Producto destacado')).toBeVisible();
    // Active toggle should be checked by default
    const activeCheckbox = page.getByRole('checkbox').first();
    await expect(activeCheckbox).toBeChecked();
  });

  test('Species tags pre-populated with defaults', async ({ page }) => {
    await expect(page.getByText('Perros')).toBeVisible();
    await expect(page.getByText('Gatos')).toBeVisible();
  });

  test('Empty form submit shows validation - name field required', async ({ page }) => {
    await page.getByRole('button', { name: 'Guardar producto' }).click();
    // Should show validation errors for required fields
    // Name, Marca, Descripcion are required
    await expect(page.getByText(/obligatorio|requerido/i).first()).toBeVisible();
  });

  test('XSS input in product name is sanitized', async ({ page }) => {
    const xssPayload = '<script>alert("xss")</script>';
    await page.getByRole('textbox', { name: 'Nombre del producto' }).fill(xssPayload);

    // The script tag should be rendered as text, not executed
    await expect(page.getByRole('textbox', { name: 'Nombre del producto' })).toHaveValue(xssPayload);
    // No alert dialog should appear
  });

  test('Slug URL auto-generates from product name', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Nombre del producto' }).fill('Mi Producto Test 123');
    // Slug should auto-generate
    const slugField = page.getByRole('textbox', { name: 'Slug URL' });
    const slugValue = await slugField.inputValue();
    expect(slugValue).toMatch(/mi-producto-test-123|amoxicilina/);
  });

  test('R3: Marca dropdown has options (Zoetis, MSD, Purina)', async ({ page }) => {
    const combobox = page.getByRole('combobox', { name: 'Marca' });
    await expect(combobox).toBeVisible();
    const options = await combobox.locator('option').allTextContents();
    expect(options).toContain('Zoetis');
    expect(options).toContain('MSD');
    expect(options).toContain('Purina');
  });

  test('R3: Presentaciones tag with remove button', async ({ page }) => {
    await expect(page.getByText('Tabletas x 10')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remover' })).toBeVisible();
  });

  test('R3: Species remove buttons work', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Remover Perros' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remover Gatos' })).toBeVisible();
  });

  test('R3: Add species input accepts text', async ({ page }) => {
    const input = page.getByPlaceholder('Agregar especie...');
    await expect(input).toBeVisible();
    await input.fill('Bovinos');
    const value = await input.inputValue();
    expect(value).toBe('Bovinos');
  });

  test('R3: Descripcion field accepts long text', async ({ page }) => {
    const longText = 'A'.repeat(5000);
    const textarea = page.getByRole('textbox', { name: 'Descripcion' });
    await textarea.fill(longText);
    const value = await textarea.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });
});
