import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-162 to REQ-166: Commercial policies rendered publicly', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/es/nosotros`);
    await page.waitForLoadState('networkidle');
    // Wait for content to load from API
    await page.waitForSelector('.about-policies', { timeout: 10000 });
  });

  test('REQ-162: Credit terms section is rendered publicly', async ({ page }) => {
    const creditTitle = page.locator('h3', { hasText: 'Politicas de Credito' });
    await expect(creditTitle).toBeVisible();
    const creditContent = page.locator('.about-policies__text').first();
    await expect(creditContent).toContainText('credito');
  });

  test('REQ-163: Delivery times by zone are rendered publicly', async ({ page }) => {
    const deliveryTitle = page.locator('h3', { hasText: 'Tiempos de Entrega' });
    await expect(deliveryTitle).toBeVisible();
    const deliveryContent = page.locator('.about-policies__card').nth(1).locator('.about-policies__text');
    await expect(deliveryContent).toContainText('24-48');
    await expect(deliveryContent).toContainText('2-3');
  });

  test('REQ-164: Delivery coverage detail is rendered publicly', async ({ page }) => {
    const coverageTitle = page.locator('h3', { hasText: 'Cobertura de Entrega' });
    await expect(coverageTitle).toBeVisible();
    const coverageContent = page.locator('.about-policies__card').nth(2).locator('.about-policies__text');
    await expect(coverageContent).toContainText('flotilla propia');
    await expect(coverageContent).toContainText('agentes');
  });

  test('REQ-165: Biweekly visit frequency is mentioned', async ({ page }) => {
    // "visitas quincenales" should appear in either coverage subtitle or policy content
    const pageText = await page.locator('.about-policies').textContent();
    expect(pageText).toContain('quincenales');
  });

  test('REQ-166: CTA to request commercial conditions exists', async ({ page }) => {
    const ctaButton = page.locator('a', { hasText: 'Solicitar Condiciones' });
    await expect(ctaButton).toBeVisible();
    const href = await ctaButton.getAttribute('href');
    expect(href).toContain('contacto');
  });
});
