import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {

  private readonly loginButton: Locator;
  private readonly signUpButton: Locator;
  private readonly logoutButton: Locator;
  private readonly welcomeUser: Locator;
  private readonly cartButton: Locator;
  private readonly homeButton: Locator;

  /// Locator ///
  constructor(page: Page) {
    super(page);
    // Nav "Log in"/"Sign up"/"Cart" are <a> tags, not <button>s — ids are the most stable handle.
    this.loginButton = page.locator('#login2');
    this.signUpButton = page.locator('#signin2');
    this.logoutButton = page.locator('#logout2');
    this.welcomeUser = page.locator('#nameofuser');
    this.cartButton = page.locator('#cartur');
    // No id on the nav "Home" link; its name is "Home (current)" on the homepage itself.
    this.homeButton = page.getByRole('link', { name: 'Home', exact: false });
  }
  ///////////////

  async open(url: string): Promise<void> {
    await this.navigate(url);
  }

  async clickLoginButton(): Promise<void> {
    await this.waitForVisible(this.loginButton);
    await this.loginButton.click();
  }

  async clickLogoutButton(): Promise<void> {
    await this.waitForVisible(this.logoutButton);
    await this.logoutButton.click();
  }

  /**
   * Click a product card by its visible name (e.g. "Sony xperia z5").
   */
  async clickProduct(productName: string): Promise<void> {
    const productLink = this.page.getByRole('link', { name: productName, exact: true });
    await this.waitForVisible(productLink);
    await productLink.click();
  }

  /**
   * Switch the product listing to a category (e.g. "Phones", "Laptops", "Monitors").
   */
  async clickCategory(categoryName: string): Promise<void> {
    const categoryLink = this.page.getByRole('link', { name: categoryName, exact: true });
    await this.waitForVisible(categoryLink);
    await categoryLink.click();
  }

  async clickCartButton(): Promise<void> {
    await this.waitForVisible(this.cartButton);
    await this.cartButton.click();
  }

  async clickHomeButton(): Promise<void> {
    await this.waitForVisible(this.homeButton);
    await this.homeButton.click();
  }

  // ── Getters ────────────────────────────────────────────────────────────────

  get loginButtonLocator(): Locator {
    return this.loginButton;
  }

  get signUpButtonLocator(): Locator {
    return this.signUpButton;
  }

  get logoutButtonLocator(): Locator {
    return this.logoutButton;
  }

  get welcomeUserLocator(): Locator {
    return this.welcomeUser;
  }
}
