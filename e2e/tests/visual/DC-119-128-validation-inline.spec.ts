import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-119 / DC-128: Inline validation in product form', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/crear`);
    await page.waitForSelector('h1:has-text("Crear Producto")', { timeout: 10000 });
  });

  test('DC-119: Focus + blur on empty required field shows red border and error message', async ({ page }) => {
    const nameInput = page.getByRole('textbox', { name: 'Nombre del producto *' });

    // Focus and then blur the empty required field
    await nameInput.click();
    await page.getByRole('heading', { name: 'Crear Producto' }).click();

    // Verify red border 2px #EF4444
    const borderColor = await nameInput.evaluate(el => getComputedStyle(el).borderColor);
    expect(borderColor).toBe('rgb(239, 68, 68)');

    const borderWidth = await nameInput.evaluate(el => getComputedStyle(el).borderWidth);
    expect(borderWidth).toBe('2px');

    // Verify error message appears
    const errorAlert = page.locator('[role="alert"]').first();
    await expect(errorAlert).toBeVisible();

    // Verify error message text is descriptive
    const errorText = await errorAlert.textContent();
    expect(errorText).toContain('El nombre del producto es obligatorio');

    // Verify error message color is #EF4444
    const errorColor = await errorAlert.evaluate(el => getComputedStyle(el).color);
    expect(errorColor).toBe('rgb(239, 68, 68)');

    // Verify error message font-size is 13px
    const errorFontSize = await errorAlert.evaluate(el => getComputedStyle(el).fontSize);
    expect(errorFontSize).toBe('13px');
  });

  test('DC-128: Submit with all fields empty shows errors on all required fields', async ({ page }) => {
    // Click Guardar producto without filling any fields
    await page.getByRole('button', { name: 'Guardar producto' }).click();

    // Verify all 4 required fields show error messages
    const alerts = page.locator('[role="alert"]');
    const alertCount = await alerts.count();
    expect(alertCount).toBeGreaterThanOrEqual(4);

    // Verify each error message
    const expectedErrors = [
      'El nombre del producto es obligatorio',
      'Selecciona una marca',
      'Selecciona una categoria',
      'La descripcion en espanol es obligatoria'
    ];

    for (const expected of expectedErrors) {
      await expect(page.locator(`[role="alert"]:has-text("${expected}")`)).toBeVisible();
    }

    // Verify all error alerts have red color
    const allAlertColors = await alerts.evaluateAll(els =>
      els.map(el => getComputedStyle(el).color)
    );
    for (const color of allAlertColors) {
      expect(color).toBe('rgb(239, 68, 68)');
    }

    // Verify first error is in view (scroll to first error)
    const firstAlert = alerts.first();
    const box = await firstAlert.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeLessThan(900); // within viewport
    }

    // Verify input borders are red
    const nameInput = page.getByRole('textbox', { name: 'Nombre del producto *' });
    const nameBorder = await nameInput.evaluate(el => getComputedStyle(el).borderColor);
    expect(nameBorder).toBe('rgb(239, 68, 68)');

    const brandSelect = page.getByRole('combobox', { name: 'Marca *' });
    const brandBorder = await brandSelect.evaluate(el => getComputedStyle(el).borderColor);
    expect(brandBorder).toBe('rgb(239, 68, 68)');

    const descTextarea = page.getByRole('textbox', { name: 'Descripcion *' });
    const descBorder = await descTextarea.evaluate(el => getComputedStyle(el).borderColor);
    expect(descBorder).toBe('rgb(239, 68, 68)');
  });
});
