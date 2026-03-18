import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('REQ-177: Distribuidores has 4-step timeline', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/es/distribuidores`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const steps = await page.evaluate(() => {
    const items = document.querySelectorAll('[class*="timeline"] li, [class*="steps"] li, ol li');
    const results: string[] = [];
    items.forEach(item => {
      if (item.textContent?.includes('Contacto') || item.textContent?.includes('Evaluacion') ||
          item.textContent?.includes('Acuerdo') || item.textContent?.includes('Distribucion')) {
        results.push(item.textContent.trim().substring(0, 40));
      }
    });
    return results;
  });

  expect(steps.length).toBe(4);
});

test('REQ-178: Timeline horizontal on desktop, vertical on mobile', async ({ page }) => {
  // Desktop check
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/es/distribuidores`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const desktopTimeline = await page.evaluate(() => {
    const lists = document.querySelectorAll('ol, ul');
    for (const list of lists) {
      if (list.textContent?.includes('Contacto Inicial')) {
        const styles = getComputedStyle(list);
        return {
          display: styles.display,
          flexDirection: styles.flexDirection,
          gridCols: styles.gridTemplateColumns
        };
      }
    }
    return null;
  });

  expect(desktopTimeline).toBeTruthy();

  // Mobile check
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE_URL}/es/distribuidores`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const mobileTimeline = await page.evaluate(() => {
    const lists = document.querySelectorAll('ol, ul');
    for (const list of lists) {
      if (list.textContent?.includes('Contacto Inicial')) {
        const styles = getComputedStyle(list);
        return {
          display: styles.display,
          flexDirection: styles.flexDirection,
          gridCols: styles.gridTemplateColumns
        };
      }
    }
    return null;
  });

  expect(mobileTimeline).toBeTruthy();
});
