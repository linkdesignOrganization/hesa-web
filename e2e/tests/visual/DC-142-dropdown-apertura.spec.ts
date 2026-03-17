import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('DC-142: Dropdown in product form opens with visible options', async ({ page }) => {
  await page.goto(`${BASE_URL}/admin/productos/crear`);

  const marcaSelect = page.getByLabel('Marca *');
  await expect(marcaSelect).toBeVisible();

  // Click to open dropdown
  await marcaSelect.click();

  // Verify options are present
  const options = marcaSelect.locator('option');
  const count = await options.count();
  expect(count).toBeGreaterThanOrEqual(3); // At least: placeholder + Zoetis + MSD + Purina

  const optionTexts = await options.allTextContents();
  expect(optionTexts).toContain('Zoetis');
  expect(optionTexts).toContain('MSD');
  expect(optionTexts).toContain('Purina');
});
