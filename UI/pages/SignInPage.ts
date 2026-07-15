import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignInPage extends BasePage {


  private readonly EnterUsernameBox: Locator;
  private readonly EnterPasswordBox: Locator;
  private readonly LoginButton: Locator;

  /// Locator ///
  constructor(page: Page) {
    super(page);
    // The modal's <label for="log-name"/"log-pass"> don't match the input ids
    // (a bug in the real markup), so role/label-based lookup can't be used here.
    this.EnterUsernameBox = page.locator('#loginusername');
    this.EnterPasswordBox = page.locator('#loginpassword');
    this.LoginButton      = page.getByRole('button', { name: 'Log in', exact: true });
  }
  ///////////////

  async InputUsername(username: string): Promise<void> {
    await this.waitForVisible(this.EnterUsernameBox);
    await this.EnterUsernameBox.fill(username);
  }

  async InputPassword(password: string): Promise<void> {
    await this.waitForVisible(this.EnterPasswordBox);
    await this.EnterPasswordBox.fill(password);
  }

  async ClickLoginButton(): Promise<void> {
    await this.waitForVisible(this.LoginButton);
    await this.LoginButton.click();
  }

  get usernameBox(): Locator {
    return this.EnterUsernameBox;
  }
}
