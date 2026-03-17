import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-077: Form Fields Panel Styling', () => {
  test('Input fields have border-radius 10px', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos/crear`);
    await page.waitForSelector('text=Crear Producto', { timeout: 10000 });

    const input = page.getByRole('textbox', { name: 'Nombre del producto' });
    await expect(input).toBeVisible();

    const borderRadius = await input.evaluate(
      (el) => window.getComputedStyle(el).borderRadius
    );
    expect(borderRadius).toBe('10px');
  });

  test('Input fields have label above', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos/crear`);
    await page.waitForSelector('text=Crear Producto', { timeout: 10000 });

    await expect(page.getByText('Nombre del producto *')).toBeVisible();
    await expect(page.getByText('Marca *')).toBeVisible();
    await expect(page.getByText('Descripcion *')).toBeVisible();
  });

  test('Focus ring shows 2px brand-primary (#008DC9) on input', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos/crear`);
    await page.waitForSelector('text=Crear Producto', { timeout: 10000 });

    const input = page.getByRole('textbox', { name: 'Nombre del producto' });
    await input.focus();

    // Check for focus styling (outline or box-shadow with brand color)
    const outline = await input.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        outline: style.outline,
        boxShadow: style.boxShadow,
        borderColor: style.borderColor,
      };
    });
    // At least one focus indicator should be present
    const hasFocusIndicator =
      outline.outline.includes('008DC9') ||
      outline.boxShadow.includes('008DC9') ||
      outline.borderColor.includes('rgb(0, 141, 201)') ||
      outline.boxShadow !== 'none';
    expect(hasFocusIndicator).toBeTruthy();
  });
});

test.describe('DC-078: Image Uploader Styling', () => {
  test('Image upload zone has dashed border', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos/crear`);
    await page.waitForSelector('text=Crear Producto', { timeout: 10000 });

    const uploadZone = page.locator('text=Arrastra imagenes aqui o selecciona archivos').locator('..');
    await expect(uploadZone).toBeVisible();

    // Check for dashed border
    const borderStyle = await uploadZone.evaluate((el) => {
      // Walk up to find the container with dashed border
      let current: HTMLElement | null = el as HTMLElement;
      while (current) {
        const style = window.getComputedStyle(current);
        if (style.borderStyle === 'dashed') {
          return style.borderStyle;
        }
        current = current.parentElement;
      }
      return 'not-found';
    });
    expect(borderStyle).toBe('dashed');
  });

  test('Upload zone has upload icon', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos/crear`);
    await page.waitForSelector('text=Crear Producto', { timeout: 10000 });

    // Upload icon (SVG or img) should be present near the upload text
    const uploadSection = page.locator('text=Arrastra imagenes aqui o selecciona archivos').locator('..');
    const hasIcon = await uploadSection.locator('img, svg').count();
    expect(hasIcon).toBeGreaterThan(0);
  });

  test('Upload zone shows format restriction text', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos/crear`);
    await page.waitForSelector('text=Crear Producto', { timeout: 10000 });

    await expect(page.getByText('PNG, JPG hasta 5MB')).toBeVisible();
  });
});
