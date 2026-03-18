import { test, expect } from '@playwright/test';

const FRONTEND_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

test.describe('NFR-020: Security headers on frontend', () => {
  test('Frontend has Content-Security-Policy header', async ({ request }) => {
    const response = await request.get(`${FRONTEND_URL}/es/`);
    const csp = response.headers()['content-security-policy'];
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  test('Frontend has X-Frame-Options: DENY', async ({ request }) => {
    const response = await request.get(`${FRONTEND_URL}/es/`);
    const xfo = response.headers()['x-frame-options'];
    expect(xfo).toBeDefined();
    expect(xfo.toUpperCase()).toMatch(/DENY|SAMEORIGIN/);
  });

  test('Frontend has X-Content-Type-Options: nosniff', async ({ request }) => {
    const response = await request.get(`${FRONTEND_URL}/es/`);
    const xcto = response.headers()['x-content-type-options'];
    expect(xcto).toBeDefined();
    expect(xcto).toBe('nosniff');
  });

  test('Frontend has Referrer-Policy header', async ({ request }) => {
    const response = await request.get(`${FRONTEND_URL}/es/`);
    const rp = response.headers()['referrer-policy'];
    expect(rp).toBeDefined();
    expect(rp).toMatch(/no-referrer|strict-origin|same-origin/);
  });

  test('Frontend has Permissions-Policy header', async ({ request }) => {
    const response = await request.get(`${FRONTEND_URL}/es/`);
    const pp = response.headers()['permissions-policy'];
    expect(pp).toBeDefined();
    expect(pp).toContain('camera=()');
    expect(pp).toContain('microphone=()');
  });

  test('Frontend has X-XSS-Protection header', async ({ request }) => {
    const response = await request.get(`${FRONTEND_URL}/es/`);
    const xxss = response.headers()['x-xss-protection'];
    expect(xxss).toBeDefined();
    expect(xxss).toContain('1');
  });
});

test.describe('NFR-020: Security headers on API', () => {
  test('API has Content-Security-Policy header', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/products`);
    const csp = response.headers()['content-security-policy'];
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  test('API has X-Frame-Options: DENY', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/products`);
    const xfo = response.headers()['x-frame-options'];
    expect(xfo).toBeDefined();
    expect(xfo.toUpperCase()).toMatch(/DENY|SAMEORIGIN/);
  });

  test('API has X-Content-Type-Options: nosniff', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/products`);
    const xcto = response.headers()['x-content-type-options'];
    expect(xcto).toBeDefined();
    expect(xcto).toBe('nosniff');
  });

  test('API has Referrer-Policy header', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/products`);
    const rp = response.headers()['referrer-policy'];
    expect(rp).toBeDefined();
    expect(rp).toMatch(/no-referrer|strict-origin|same-origin/);
  });

  test('API has Permissions-Policy header', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/products`);
    const pp = response.headers()['permissions-policy'];
    expect(pp).toBeDefined();
    expect(pp).toContain('camera=()');
  });

  test('API has X-XSS-Protection header', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/products`);
    const xxss = response.headers()['x-xss-protection'];
    expect(xxss).toBeDefined();
    expect(xxss).toContain('1');
  });

  test('API has Cross-Origin-Opener-Policy header', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/products`);
    const coop = response.headers()['cross-origin-opener-policy'];
    expect(coop).toBeDefined();
    expect(coop).toBe('same-origin');
  });

  test('API has Cross-Origin-Resource-Policy header', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/products`);
    const corp = response.headers()['cross-origin-resource-policy'];
    expect(corp).toBeDefined();
    expect(corp).toBe('same-origin');
  });
});
