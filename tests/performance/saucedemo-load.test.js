import http from 'k6/http';
import { check, group, sleep } from 'k6';

const baseUrl = __ENV.BASE_URL || 'https://www.saucedemo.com';

export const options = {
  scenarios: {
    smoke: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 5 },
        { duration: '1m', target: 10 },
        { duration: '30s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
    checks: ['rate>0.99'],
  },
};

function checkPage(response, expectedTitle) {
  check(response, {
    'status is 200': (res) => res.status === 200,
    [`body contains ${expectedTitle}`]: (res) =>
      res.body.includes(expectedTitle),
  });
}

export default function () {
  group('login page', () => {
    const response = http.get(`${baseUrl}/`);

    checkPage(response, 'Swag Labs');
  });

  group('inventory page', () => {
    const response = http.get(`${baseUrl}/inventory.html`);

    checkPage(response, 'Swag Labs');
  });

  group('cart page', () => {
    const response = http.get(`${baseUrl}/cart.html`);

    checkPage(response, 'Swag Labs');
  });

  group('checkout pages', () => {
    const stepOne = http.get(`${baseUrl}/checkout-step-one.html`);
    const stepTwo = http.get(`${baseUrl}/checkout-step-two.html`);
    const complete = http.get(`${baseUrl}/checkout-complete.html`);

    checkPage(stepOne, 'Swag Labs');
    checkPage(stepTwo, 'Swag Labs');
    checkPage(complete, 'Swag Labs');
  });

  sleep(1);
}
