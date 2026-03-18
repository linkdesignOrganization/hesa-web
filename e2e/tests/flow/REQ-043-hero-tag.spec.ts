import { test, expect } from '@playwright/test';

// test: REQ-043 - Tag superior configurable visible (ej: "DESDE 1989")
test('REQ-043: Hero tag "DESDE 1989" is visible above the headline', async ({ page }) => {
  await page.goto('/es');
  await page.getByText('DESDE 1989').first().waitFor({ state: 'visible' });

  await expect(page.getByText('DESDE 1989').first()).toBeVisible();
});
