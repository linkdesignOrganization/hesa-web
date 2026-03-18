import { test, expect } from '@playwright/test';

// test: REQ-074 - Banner con titulo orientado a fabricantes, NO Centroamerica
test('REQ-074: Manufacturers banner is visible and does NOT mention Centroamerica', async ({ page }) => {
  await page.goto('/es');
  await page.getByText('DESDE 1989').first().waitFor({ state: 'visible' });

  // Verify the CTA banner exists
  const bannerTitle = page.getByRole('heading', { name: /socio de distribucion/i });
  await expect(bannerTitle).toBeVisible();

  // Verify it does NOT mention Centroamerica
  const bannerSection = bannerTitle.locator('..');
  const bannerText = await bannerSection.textContent();
  expect(bannerText?.toLowerCase()).not.toContain('centroamerica');
  expect(bannerText?.toLowerCase()).not.toContain('centroamérica');
  expect(bannerText?.toLowerCase()).not.toContain('central america');
});

// test: REQ-075 - Parrafo + CTA navega a Distribuidores
test('REQ-075: CTA in manufacturers banner navigates to distribuidores', async ({ page }) => {
  await page.goto('/es');
  await page.getByText('DESDE 1989').first().waitFor({ state: 'visible' });

  const ctaLink = page.getByRole('link', { name: 'Conocer mas' });
  await expect(ctaLink).toBeVisible();
  await expect(ctaLink).toHaveAttribute('href', '/es/distribuidores');

  await ctaLink.click();
  await expect(page).toHaveURL(/\/es\/distribuidores/);
});
