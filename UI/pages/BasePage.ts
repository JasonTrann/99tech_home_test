import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'load' });
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'load' });
  }

  async waitForVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }

  async waitForHidden(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'hidden' });
  }

  async sleep(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  async captureDialogMessage(trigger: () => Promise<void>): Promise<string> {
    const dialogMessage = new Promise<string>((resolve) => {
      this.page.once('dialog', async (dialog) => {
        const message = dialog.message();
        await dialog.dismiss();
        resolve(message);
      });
    });
    await trigger();
    return dialogMessage;
  }

  async assertUrlContains(substring: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(substring));
  }

  async assertTitle(titleOrRegex: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(titleOrRegex);
  }

  async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  getCurrentUrl(): string {
    return this.page.url();
  }
}
