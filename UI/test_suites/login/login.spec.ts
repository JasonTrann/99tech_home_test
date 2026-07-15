import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { SignInPage } from '../../pages/SignInPage';
import { requireEnv } from '../../utils/helpers';
import loginAccounts from '../../data/login_acc.json';

test.describe('Login Suite', () => {
  let homePage: HomePage;
  let signInPage: SignInPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signInPage = new SignInPage(page);
  });

  test('TC-001: Verify User Can Login with Valid Credentials', async () => {
    const { username, password } = loginAccounts.valid_user_account;

    await test.step('Navigate to the homepage', async () => {
      await homePage.open(requireEnv('BASE_URL'));
    });

    await test.step('Click Login Button', async () => {
      await homePage.clickLoginButton();
    });

    await test.step('Enter username', async () => {
      await signInPage.InputUsername(username);
    });

    await test.step('Enter password', async () => {
      await signInPage.InputPassword(password);
    });

    await test.step('Click Login Button', async () => {
      await signInPage.ClickLoginButton();
    });

    await test.step('Verify the user is logged in', async () => {
      await homePage.waitForHidden(homePage.loginButtonLocator);
      await homePage.waitForHidden(homePage.signUpButtonLocator);
      await homePage.assertVisible(homePage.logoutButtonLocator);
      await homePage.assertVisible(homePage.welcomeUserLocator);
      await expect(homePage.welcomeUserLocator).toHaveText(`Welcome ${username}`);
    });
  });

  test('TC-003: Verify User Can Logout Successfully', async () => {
    const { username, password } = loginAccounts.valid_user_account;

    await test.step('Navigate to the homepage', async () => {
      await homePage.open(requireEnv('BASE_URL'));
    });

    await test.step('Click Login Button', async () => {
      await homePage.clickLoginButton();
    });

    await test.step('Enter username', async () => {
      await signInPage.InputUsername(username);
    });

    await test.step('Enter password', async () => {
      await signInPage.InputPassword(password);
    });

    await test.step('Click Login Button', async () => {
      await signInPage.ClickLoginButton();
    });

    await test.step('Verify the user is logged in', async () => {
      await homePage.assertVisible(homePage.logoutButtonLocator);
    });

    await test.step('Click Log out button on navigation bar', async () => {
      await homePage.clickLogoutButton();
    });

    await test.step('Observe navigation bar behavior', async () => {
      await homePage.assertVisible(homePage.loginButtonLocator);
      await homePage.assertVisible(homePage.signUpButtonLocator);
      await homePage.waitForHidden(homePage.logoutButtonLocator);
      await homePage.waitForHidden(homePage.welcomeUserLocator);
    });

    await test.step('Refresh the page', async () => {
      await homePage.reload();
    });

    await test.step('Verify user stays logged out', async () => {
      await homePage.assertVisible(homePage.loginButtonLocator);
      await homePage.assertVisible(homePage.signUpButtonLocator);
      await homePage.waitForHidden(homePage.logoutButtonLocator);
      await homePage.waitForHidden(homePage.welcomeUserLocator);
    });
  });

  test('TC-011: Verify User Cannot Login with Non-existing Username', async () => {
    const { username, password } = loginAccounts.not_exit_user_account;
    let alertMessage = '';

    await test.step('Navigate to the homepage', async () => {
      await homePage.open(requireEnv('BASE_URL'));
    });

    await test.step('Click Log in button', async () => {
      await homePage.clickLoginButton();
    });

    await test.step('Enter non-existing username', async () => {
      await signInPage.InputUsername(username);
    });

    await test.step('Enter password', async () => {
      await signInPage.InputPassword(password);
    });

    await test.step('Click Log in button', async () => {
      alertMessage = await signInPage.captureDialogMessage(() => signInPage.ClickLoginButton());
    });

    await test.step('with Non-existing Username', async () => {
      expect(alertMessage).toBe('User does not exist.');
      await homePage.assertVisible(homePage.loginButtonLocator);
      await homePage.assertVisible(homePage.signUpButtonLocator);
      await homePage.waitForHidden(homePage.logoutButtonLocator);
    });
  });

  test('TC-012: Verify User Cannot Login with Wrong Password', async () => {
    const { username, password } = loginAccounts.wrong_pass_user_account;
    let alertMessage = '';

    await test.step('Navigate to the homepage', async () => {
      await homePage.open(requireEnv('BASE_URL'));
    });

    await test.step('Click Log in button', async () => {
      await homePage.clickLoginButton();
    });

    await test.step('Enter valid username', async () => {
      await signInPage.InputUsername(username);
    });

    await test.step('Enter wrong password', async () => {
      await signInPage.InputPassword(password);
    });

    await test.step('Click Log in button', async () => {
      alertMessage = await signInPage.captureDialogMessage(() => signInPage.ClickLoginButton());
    });

    await test.step('Verify User cant Login with wrong Password', async () => {
      expect(alertMessage).toBe('Wrong password.');
      await homePage.assertVisible(homePage.loginButtonLocator);
      await homePage.assertVisible(homePage.signUpButtonLocator);
      await homePage.waitForHidden(homePage.logoutButtonLocator);
    });
  });
});
