import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

const validUser = {
  username: 'standard_user',
  password: 'secret_sauce',
};

const customer = {
  firstName: 'Silvio',
  lastName: 'Filho',
  postalCode: '01001-000',
};

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(validUser.username, validUser.password);
    await expect(page.getByTestId('inventory-container')).toBeVisible();
  });

  test('Complete checkout with one product', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.addProductToCart('sauce-labs-backpack');
    await expect(checkoutPage.cartBadge).toHaveText('1');

    await checkoutPage.openCart();
    await expect(checkoutPage.cartItems).toHaveCount(1);

    await checkoutPage.startCheckout();
    await checkoutPage.completeCheckout(
      customer.firstName,
      customer.lastName,
      customer.postalCode
    );

    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText(
      'Thank you for your order!'
    );
  });

  test('Complete checkout with multiple products', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.addProductToCart('sauce-labs-backpack');
    await checkoutPage.addProductToCart('sauce-labs-bike-light');
    await checkoutPage.addProductToCart('sauce-labs-bolt-t-shirt');
    await expect(checkoutPage.cartBadge).toHaveText('3');

    await checkoutPage.openCart();
    await expect(checkoutPage.cartItems).toHaveCount(3);

    await checkoutPage.startCheckout();
    await checkoutPage.fillCustomerInformation(
      customer.firstName,
      customer.lastName,
      customer.postalCode
    );
    await checkoutPage.continueCheckout();

    await expect(checkoutPage.itemTotal).toBeVisible();
    await expect(checkoutPage.tax).toBeVisible();
    await expect(checkoutPage.total).toBeVisible();

    await checkoutPage.finishCheckout();
    await expect(checkoutPage.completeHeader).toHaveText(
      'Thank you for your order!'
    );
  });

  test('Remove product from cart before checkout', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.addProductToCart('sauce-labs-backpack');
    await checkoutPage.addProductToCart('sauce-labs-bike-light');
    await expect(checkoutPage.cartBadge).toHaveText('2');

    await checkoutPage.openCart();
    await checkoutPage.removeProductFromCart('sauce-labs-bike-light');

    await expect(checkoutPage.cartBadge).toHaveText('1');
    await expect(checkoutPage.cartItems).toHaveCount(1);
  });

  test('Cancel checkout and return to cart', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.addProductToCart('sauce-labs-backpack');
    await checkoutPage.openCart();
    await checkoutPage.startCheckout();
    await checkoutPage.cancelCheckout();

    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(checkoutPage.cartItems).toHaveCount(1);
  });

  test('Required first name validation', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.addProductToCart('sauce-labs-backpack');
    await checkoutPage.openCart();
    await checkoutPage.startCheckout();
    await checkoutPage.continueCheckout();

    await expect(checkoutPage.errorMessage).toContainText(
      'First Name is required'
    );
  });

  test('Required last name validation', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.addProductToCart('sauce-labs-backpack');
    await checkoutPage.openCart();
    await checkoutPage.startCheckout();
    await checkoutPage.firstNameInput.fill(customer.firstName);
    await checkoutPage.continueCheckout();

    await expect(checkoutPage.errorMessage).toContainText(
      'Last Name is required'
    );
  });

  test('Required postal code validation', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.addProductToCart('sauce-labs-backpack');
    await checkoutPage.openCart();
    await checkoutPage.startCheckout();
    await checkoutPage.firstNameInput.fill(customer.firstName);
    await checkoutPage.lastNameInput.fill(customer.lastName);
    await checkoutPage.continueCheckout();

    await expect(checkoutPage.errorMessage).toContainText(
      'Postal Code is required'
    );
  });
});
