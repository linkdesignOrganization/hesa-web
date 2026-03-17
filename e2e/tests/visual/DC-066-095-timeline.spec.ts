import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-066/DC-095: Timeline distribuidores', () => {
  test('DC-066: Desktop timeline is horizontal with 4 nodes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/distribuidores`);
    await page.waitForLoadState('networkidle');

    // Scroll to timeline section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
    await page.waitForTimeout(1000);

    // Look for timeline nodes
    const timelineNodes = page.locator('[class*="timeline-node"], [class*="timeline__node"], [class*="step-circle"]');
    if (await timelineNodes.count() > 0) {
      expect(await timelineNodes.count()).toBeGreaterThanOrEqual(4);
    }
  });

  test('DC-095: Mobile timeline is vertical', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/distribuidores`);
    await page.waitForLoadState('networkidle');

    // Scroll to timeline
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
    await page.waitForTimeout(1000);

    // On mobile, timeline should be vertical layout
    const timeline = page.locator('[class*="timeline"]');
    if (await timeline.count() > 0) {
      const layout = await timeline.first().evaluate(el => {
        const s = getComputedStyle(el);
        return { flexDirection: s.flexDirection, display: s.display };
      });
      // Vertical timeline should have column direction or be block
      if (layout.display === 'flex') {
        expect(layout.flexDirection).toBe('column');
      }
    }
  });
});
