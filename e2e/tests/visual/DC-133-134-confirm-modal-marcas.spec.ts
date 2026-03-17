import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('DC-133: Confirm modal on product delete has overlay, title, buttons', async ({ page }) => {
  await page.goto(`${BASE_URL}/admin/productos`);
  // Click 3-dot menu on first product
  await page.locator('button:has-text("Opciones del producto")').first().click();
  await page.locator('button:has-text("Eliminar")').click();

  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('h3')).toContainText('Eliminar producto');
  await expect(dialog.locator('button:has-text("Cancelar")')).toBeVisible();
  await expect(dialog.locator('button:has-text("Eliminar")')).toBeVisible();

  // Verify styles
  const modalStyles = await dialog.evaluate(el => {
    const s = getComputedStyle(el);
    return { borderRadius: s.borderRadius, maxWidth: s.maxWidth, padding: s.padding, bg: s.backgroundColor };
  });
  expect(modalStyles.borderRadius).toBe('16px');
  expect(modalStyles.maxWidth).toBe('420px');
  expect(modalStyles.padding).toBe('32px');

  // Verify delete button is red
  const delBtnBg = await dialog.locator('button:has-text("Eliminar")').evaluate(el => getComputedStyle(el).backgroundColor);
  expect(delBtnBg).toBe('rgb(239, 68, 68)');

  // Verify auto-focus on Cancelar
  const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
  expect(focused).toBe('Cancelar');
});

test('DC-134: Admin marcas page shows grid with avatar, name, country, badges', async ({ page }) => {
  await page.goto(`${BASE_URL}/admin/marcas`);

  await expect(page.locator('h1')).toContainText('Marcas');
  await expect(page.locator('a:has-text("Crear marca")')).toBeVisible();

  const brandCards = page.locator('a[href*="/admin/marcas/b"]');
  const count = await brandCards.count();
  expect(count).toBeGreaterThanOrEqual(10);

  // Verify first brand card has avatar, name, country
  const firstCard = brandCards.first();
  await expect(firstCard.locator('.admin-brand-card__logo')).toBeVisible();
  await expect(firstCard.locator('.admin-brand-card__name')).toBeVisible();
  await expect(firstCard.locator('.admin-brand-card__country')).toBeVisible();
});
