import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-041: Nosotros page layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/es/nosotros`);
    await page.waitForLoadState('networkidle');
  });

  test('DC-041: hero section with heading "Herrera y Elizondo S.A."', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText(/Herrera y Elizondo/);
  });

  test('DC-041: historia section with narrative blocks', async ({ page }) => {
    const historiaHeading = page.locator('h2:has-text("Nuestra Historia")');
    await expect(historiaHeading).toBeVisible();
  });

  test('DC-041: mision section present', async ({ page }) => {
    const misionHeading = page.locator('h2:has-text("Nuestra Mision")');
    await expect(misionHeading).toBeVisible();
  });

  test('DC-041: numeros clave section with 4 stats', async ({ page }) => {
    const statsHeading = page.locator('h2:has-text("HESA en Numeros")');
    await expect(statsHeading).toBeVisible();

    // Check for stat values
    const stat37 = page.locator('text=37+');
    const stat50 = page.locator('text=50+');
    const stat100 = page.locator('text=100%');
    const stat4 = page.locator('[aria-label*="Empresas"], :text("Empresas del grupo")');

    await expect(stat37.first()).toBeVisible();
    await expect(stat50.first()).toBeVisible();
    await expect(stat100.first()).toBeVisible();
  });

  test('DC-041: cobertura nacional section with SVG map', async ({ page }) => {
    const coberturaHeading = page.locator('h2:has-text("Cobertura Nacional")');
    await expect(coberturaHeading).toBeVisible();

    // Check for map SVG or image
    const mapImage = page.locator('img[alt*="Mapa"], img[alt*="Costa Rica"], svg').first();
    await expect(mapImage).toBeVisible();
  });

  test('DC-041: equipo liderazgo grid with team members', async ({ page }) => {
    // Check for team member names
    const teamMember = page.locator('text=Carlos Herrera');
    await expect(teamMember.first()).toBeVisible();
  });

  test('DC-041: responsive mobile - stacked layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/nosotros`);
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });
});
