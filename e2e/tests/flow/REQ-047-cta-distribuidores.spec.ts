import { test, expect } from '@playwright/test';

// test: REQ-047 - CTA secundario "Distribuya con nosotros" navega a distribuidores
test('REQ-047: CTA "Distribuya con nosotros" navigates to /es/distribuidores', async ({ page }) => {
  await page.goto('/es');
  await page.getByText('DESDE 1989').first().waitFor({ state: 'visible' });

  const ctaLink = page.getByRole('link', { name: 'Distribuya con nosotros' });
  await expect(ctaLink).toBeVisible();
  await expect(ctaLink).toHaveAttribute('href', '/es/distribuidores');

  await ctaLink.click();
  await expect(page).toHaveURL(/\/es\/distribuidores/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Socio de Distribucion');
});
