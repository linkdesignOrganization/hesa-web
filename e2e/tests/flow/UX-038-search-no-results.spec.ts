import { test, expect } from '@playwright/test';

// test: UX-038 - Search with term without results shows "No se encontraron productos" + suggestions
test('UX-038: Search with no-results term shows proper empty state', async ({ page }) => {
  await page.goto('/es/');

  // Open search overlay
  await page.getByRole('button', { name: 'Buscar productos y marcas' }).click();

  // Type a search term that returns no results
  const searchInput = page.getByRole('textbox', { name: 'Buscar productos, marcas...' });
  await expect(searchInput).toBeVisible();
  await searchInput.pressSequentially('zzzzz');

  // Verify no-results message appears
  await expect(page.getByText('No se encontraron productos para "zzzzz"')).toBeVisible();
  await expect(page.getByText('Intenta con otro termino o explora el catalogo completo')).toBeVisible();
  await expect(page.getByText('Explorar catalogo completo')).toBeVisible();
});
