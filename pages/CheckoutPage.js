export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
    this.cancelButton = page.getByTestId('cancel');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.errorMessage = page.getByTestId('error');
    this.inventoryContainer = page.getByTestId('inventory-container');
    this.cartItems = page.getByTestId('inventory-item');
    this.itemTotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.completeHeader = page.getByTestId('complete-header');
  }

  productAddButton(productSlug) {
    return this.page.getByTestId(`add-to-cart-${productSlug}`);
  }

  productRemoveButton(productSlug) {
    return this.page.getByTestId(`remove-${productSlug}`);
  }

  async addProductToCart(productSlug) {
    await this.productAddButton(productSlug).click();
  }

  async removeProductFromCart(productSlug) {
    await this.productRemoveButton(productSlug).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async startCheckout() {
    await this.checkoutButton.click();
  }

  async fillCustomerInformation(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueCheckout() {
    await this.continueButton.click();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async completeCheckout(firstName, lastName, postalCode) {
    await this.fillCustomerInformation(firstName, lastName, postalCode);
    await this.continueCheckout();
    await this.finishCheckout();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }
}
