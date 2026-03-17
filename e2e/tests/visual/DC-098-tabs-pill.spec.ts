import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-098: Tabs pill responsive', () => {
  test('bilingual tabs visible in product form', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos/crear`);
    await page.waitForSelector('.admin__sidebar', { timeout: 5000 });

    const tabsInfo = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const espTab = buttons.find(b => b.textContent?.trim() === 'Espanol');
      const enTab = buttons.find(b => b.textContent?.trim() === 'English');
      return {
        hasEspanol: !!espTab,
        hasEnglish: !!enTab,
        espanolVisible: espTab ? espTab.offsetWidth > 0 : false,
        englishVisible: enTab ? enTab.offsetWidth > 0 : false
      };
    });

    expect(tabsInfo.hasEspanol).toBeTruthy();
    expect(tabsInfo.hasEnglish).toBeTruthy();
    expect(tabsInfo.espanolVisible).toBeTruthy();
    expect(tabsInfo.englishVisible).toBeTruthy();
  });
});
