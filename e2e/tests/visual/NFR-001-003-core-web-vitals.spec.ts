import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('NFR-001/003: Core Web Vitals', () => {

  test('NFR-001: Home LCP should be under 3 seconds', async ({ page }) => {
    // Setup LCP observer before navigation
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle' });

    const lcp = await page.evaluate(() => {
      return new Promise<number | null>((resolve) => {
        let lcpValue: number | null = null;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            lcpValue = entries[entries.length - 1].startTime;
          }
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(lcpValue);
        }, 2000);
      });
    });

    expect(lcp).not.toBeNull();
    // LCP < 3000ms for 3G Fast equivalent
    expect(lcp!).toBeLessThan(3000);
  });

  test('NFR-003: Home LCP should be under 2.5 seconds (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle' });

    const lcp = await page.evaluate(() => {
      return new Promise<number | null>((resolve) => {
        let lcpValue: number | null = null;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            lcpValue = entries[entries.length - 1].startTime;
          }
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(lcpValue);
        }, 2000);
      });
    });

    expect(lcp).not.toBeNull();
    expect(lcp!).toBeLessThan(2500);
  });

  test('NFR-003: Home CLS should be under 0.1', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle' });

    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 3000);
      });
    });

    // CLS should be under 0.1 per Core Web Vitals
    expect(cls).toBeLessThan(0.1);
  });

  test('NFR-001: Catalogo LCP should be under 3 seconds', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/catalogo**');

    const lcp = await page.evaluate(() => {
      return new Promise<number | null>((resolve) => {
        let lcpValue: number | null = null;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            lcpValue = entries[entries.length - 1].startTime;
          }
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(lcpValue);
        }, 2000);
      });
    });

    expect(lcp).not.toBeNull();
    expect(lcp!).toBeLessThan(3000);
  });
});
