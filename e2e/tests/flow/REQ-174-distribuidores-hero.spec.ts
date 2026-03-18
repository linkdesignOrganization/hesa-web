import { test, expect } from '@playwright/test';

// test: REQ-174 - Hero impactante con titulo B2B, subtitulo, CTA
test('REQ-174: Distribuidores page has B2B hero with title, subtitle, and CTA', async ({ page }) => {
  await page.goto('/es/distribuidores');
  await page.getByText('Socio de Distribucion').first().waitFor({ state: 'visible' });

  // Verify hero title
  const heroTitle = page.getByRole('heading', { level: 1 });
  await expect(heroTitle).toBeVisible();
  await expect(heroTitle).toContainText('Socio de Distribucion');

  // Verify subtitle
  await expect(page.getByText('37 anos de trayectoria comprobada')).toBeVisible();

  // Verify CTA
  const ctaLink = page.getByRole('link', { name: 'Contactenos' });
  await expect(ctaLink).toBeVisible();
});
