import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface OrderInfo {
  name: string;
  country: string;
  city: string;
  card: string;
  month: string;
  year: string;
}

export class CartPage extends BasePage {

  private readonly rows: Locator;
  private readonly deleteLinks: Locator;
  private readonly totalLabel: Locator;
  private readonly placeOrderButton: Locator;
  private readonly nameInput: Locator;
  private readonly countryInput: Locator;
  private readonly cityInput: Locator;
  private readonly cardInput: Locator;
  private readonly monthInput: Locator;
  private readonly yearInput: Locator;
  private readonly purchaseButton: Locator;
  private readonly confirmationPopup: Locator;
  private readonly confirmationOkButton: Locator;
  private readonly orderModal: Locator;
  private readonly orderError: Locator;

  /// Locator ///
  constructor(page: Page) {
    super(page);
    this.rows = page.locator('#tbodyid tr');
    this.deleteLinks = page.locator('#tbodyid tr td a:has-text("Delete")');
    this.totalLabel = page.locator('#totalp');
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order', exact: true });
    this.nameInput = page.locator('#name');
    this.countryInput = page.locator('#country');
    this.cityInput = page.locator('#city');
    this.cardInput = page.locator('#card');
    this.monthInput = page.locator('#month');
    this.yearInput = page.locator('#year');
    this.purchaseButton = page.getByRole('button', { name: 'Purchase', exact: true });
    this.confirmationPopup = page.locator('.sweet-alert');
    this.confirmationOkButton = this.confirmationPopup.getByRole('button', { name: 'OK', exact: true });
    this.orderModal = page.locator('#orderModal');
    // #errors id is duplicated on the page (sign-up modal also has one); scope to the order modal.
    this.orderError = this.orderModal.locator('#errors');
  }
  ///////////////

  ///////  DELETE ALL ITEM IN CART PAGE /////////
  async deleteAllItems(): Promise<string | void> {
    await this.sleep(3000);

    if (!(await this.deleteLinks.first().isVisible())) {
      return 'Cart is empty';
    }

    while (await this.deleteLinks.first().isVisible()) {
      await this.deleteLinks.first().click();
      await this.sleep(3000);
    }
  }

  async deleteProduct(productName: string): Promise<void> {
    const deleteLink = this.getProductDeleteLink(productName);
    await this.waitForVisible(deleteLink);
    await deleteLink.click();
    await this.waitForHidden(this.getProductRow(productName));
  }

  getProductRow(productName: string): Locator {
    return this.rows.filter({ hasText: productName });
  }

  getProductDeleteLink(productName: string): Locator {
    return this.getProductRow(productName).getByRole('link', { name: 'Delete', exact: true });
  }

  getProductImage(productName: string): Locator {
    return this.getProductRow(productName).locator('img');
  }

  getProductTitle(productName: string): Locator {
    return this.getProductRow(productName).locator('td').nth(1);
  }

  getProductPrice(productName: string): Locator {
    return this.getProductRow(productName).locator('td').nth(2);
  }

  async clickPlaceOrder(): Promise<void> {
    await this.waitForVisible(this.placeOrderButton);
    await this.placeOrderButton.click();
  }

  async fillOrderForm(order: Partial<OrderInfo>): Promise<void> {
    await this.waitForVisible(this.nameInput);
    if (order.name !== undefined) await this.nameInput.fill(order.name);
    if (order.country !== undefined) await this.countryInput.fill(order.country);
    if (order.city !== undefined) await this.cityInput.fill(order.city);
    if (order.card !== undefined) await this.cardInput.fill(order.card);
    if (order.month !== undefined) await this.monthInput.fill(order.month);
    if (order.year !== undefined) await this.yearInput.fill(order.year);
  }

  async clickPurchase(): Promise<void> {
    await this.waitForVisible(this.purchaseButton);
    await this.purchaseButton.click();
  }

  async clickConfirmationOk(): Promise<void> {
    await this.waitForVisible(this.confirmationOkButton);
    await this.confirmationOkButton.click();
  }

  get totalLabelLocator(): Locator {
    return this.totalLabel;
  }

  get placeOrderButtonLocator(): Locator {
    return this.placeOrderButton;
  }

  get confirmationPopupLocator(): Locator {
    return this.confirmationPopup;
  }

  get rowsLocator(): Locator {
    return this.rows;
  }

  get deleteLinksLocator(): Locator {
    return this.deleteLinks;
  }

  get orderModalLocator(): Locator {
    return this.orderModal;
  }

  get orderErrorLocator(): Locator {
    return this.orderError;
  }
}
