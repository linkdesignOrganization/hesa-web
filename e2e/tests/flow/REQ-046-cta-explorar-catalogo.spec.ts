import { test, expect } from '@playwright/test';

// test: REQ-046 - CTA primario "Explorar catalogo" navega a catalogo
test('REQ-046: CTA "Explorar catalogo" navigates to /es/catalogo', async ({ page }) => {
  await page.goto('/es');
  await page.getByText('DESDE 1989').first().waitFor({ state: 'visible' });

  const ctaLink = page.getByRole('link', { name: 'Explorar catalogo' });
  await expect(ctaLink).toBeVisible();
  await expect(ctaLink).toHaveAttribute('href', '/es/catalogo');

  await ctaLink.click();
  await expect(page).toHaveURL(/\/es\/catalogo/);
  await expect(page.getByRole('heading', { name: 'Catalogo de Productos' })).toBeVisible();
});
