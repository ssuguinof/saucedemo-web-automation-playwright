import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

const validPassword = 'secret_sauce';
const customer = {
  firstName: 'Silvio',
  lastName: 'Filho',
  postalCode: '01001-000',
};

async function loginAs(page, username) {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(username, validPassword);

  return loginPage;
}

test.describe('@exploratory Special users', () => {
  test('locked_out_user cannot access the inventory', async ({ page }) => {
    const loginPage = await loginAs(page, 'locked_out_user');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      'Sorry, this user has been locked out'
    );
    await expect(page).not.toHaveURL(/.*inventory\.html/);
  });

  test('problem_user exposes inventory visual problems', async ({ page }) => {
    await loginAs(page, 'problem_user');

    await expect(page.getByTestId('inventory-container')).toBeVisible();

    const imageSources = await page
      .locator('.inventory_item_img img')
      .evaluateAll((images) => images.map((image) => image.getAttribute('src')));
    const uniqueImageSources = new Set(imageSources);

    expect(imageSources.length).toBeGreaterThan(1);
    expect(uniqueImageSources.size).toBe(1);
  });

  test('performance_glitch_user loads inventory with extended timeout', async ({
    page,
  }) => {
    test.setTimeout(60000);

    await loginAs(page, 'performance_glitch_user');

    await expect(page.getByTestId('inventory-container')).toBeVisible({
      timeout: 45000,
    });
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('error_user exposes issues in the checkout flow', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await loginAs(page, 'error_user');
    await checkoutPage.addProductToCart('sauce-labs-backpack');
    await checkoutPage.openCart();
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

  test('visual_user exposes issues in the purchase flow', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await loginAs(page, 'visual_user');
    await checkoutPage.addProductToCart('sauce-labs-backpack');
    await checkoutPage.openCart();
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
});
