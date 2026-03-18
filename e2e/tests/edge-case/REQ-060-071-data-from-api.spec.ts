import { test, expect } from '@playwright/test';

const API_URL = 'https://hesa-api.azurewebsites.net';

test.describe('REQ-060 & REQ-071: Brands and products come from API/BD', () => {
  test('REQ-060: home API returns featuredBrands from database', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/home`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('featuredBrands');
    expect(Array.isArray(data.featuredBrands)).toBe(true);
    // featuredBrands may be empty if none selected from panel
  });

  test('REQ-071: home API returns featuredProducts from database', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/home`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('featuredProducts');
    expect(Array.isArray(data.featuredProducts)).toBe(true);
    // featuredProducts may be empty if none selected from panel
  });

  test('REQ-060: brands data on distributors page comes from API', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/brands`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('name');
    }
  });
});
