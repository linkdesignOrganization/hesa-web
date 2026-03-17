import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-012 - Pagina 404 para rutas invalidas
test('UX-012: Pagina 404 estilizada para URL invalida', async ({ page }) => {
  await page.goto(`${BASE}/es/pagina-inexistente`);
  await expect(page.getByText('Pagina no encontrada')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('La pagina que buscas no existe o ha sido movida')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Volver al inicio' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explorar catalogo' })).toBeVisible();
});

test('UX-012: 404 page links work correctly', async ({ page }) => {
  await page.goto(`${BASE}/es/pagina-inexistente`);
  await expect(page.getByText('Pagina no encontrada')).toBeVisible({ timeout: 10000 });
  const volverLink = page.getByRole('link', { name: 'Volver al inicio' });
  await expect(volverLink).toHaveAttribute('href', /\/es/);
  const explorarLink = page.getByRole('link', { name: 'Explorar catalogo' });
  await expect(explorarLink).toHaveAttribute('href', /\/es\/catalogo/);
});
