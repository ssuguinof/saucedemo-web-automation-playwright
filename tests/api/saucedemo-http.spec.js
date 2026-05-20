import { test, expect } from '@playwright/test';

const pages = [
  { name: 'login', path: '/', expectedText: 'Swag Labs' },
  { name: 'inventory', path: '/inventory.html', expectedText: 'Swag Labs' },
  { name: 'cart', path: '/cart.html', expectedText: 'Swag Labs' },
  {
    name: 'checkout information',
    path: '/checkout-step-one.html',
    expectedText: 'Swag Labs',
  },
  {
    name: 'checkout overview',
    path: '/checkout-step-two.html',
    expectedText: 'Swag Labs',
  },
  {
    name: 'checkout complete',
    path: '/checkout-complete.html',
    expectedText: 'Swag Labs',
  },
];

test.describe('SauceDemo HTTP contracts', () => {
  for (const page of pages) {
    test(`GET ${page.path} returns ${page.name} page`, async ({ request }) => {
      const response = await request.get(page.path);
      const contentType = response.headers()['content-type'];

      await expect(response).toBeOK();
      expect(contentType).toContain('text/html');
      expect(await response.text()).toContain(page.expectedText);
    });
  }

  test('GET unknown route returns not found', async ({ request }) => {
    const response = await request.get('/unknown-route');

    expect(response.status()).toBe(404);
  });
});
