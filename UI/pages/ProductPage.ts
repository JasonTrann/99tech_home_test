import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {

  private readonly addToCartButton: Locator;

  /// Locator ///
  constructor(page: Page) {
    super(page);
    this.addToCartButton = page.getByRole('link', { name: 'Add to cart', exact: true });
  }
  ///////////////

  async addToCart(): Promise<string> {
    await this.waitForVisible(this.addToCartButton);
    return this.captureDialogMessage(() => this.addToCartButton.click());
  }
}
