import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('REQ-077: Mobile CTA fabricantes banner is legible and CTA accessible', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE_URL}/es`);
  await page.waitForSelector('.mfr-cta', { timeout: 10000 });

  const mfrMobile = await page.evaluate(() => {
    const mfr = document.querySelector('.mfr-cta');
    if (!mfr) return null;
    const styles = getComputedStyle(mfr);
    const btn = mfr.querySelector('.btn, a');
    const btnStyles = btn ? getComputedStyle(btn) : null;
    const title = mfr.querySelector('h2');
    return {
      padding: styles.padding,
      titleVisible: !!title && getComputedStyle(title).display !== 'none',
      btnWidth: btnStyles?.width,
      btnDisplay: btnStyles?.display
    };
  });

  expect(mfrMobile).toBeTruthy();
  expect(mfrMobile!.titleVisible).toBe(true);
  // Button should be close to full-width on mobile (335px of 375px viewport)
  expect(parseInt(mfrMobile!.btnWidth!)).toBeGreaterThan(300);
});
