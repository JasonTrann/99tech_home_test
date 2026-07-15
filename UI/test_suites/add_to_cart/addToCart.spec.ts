import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { SignInPage } from '../../pages/SignInPage';
import { CartPage } from '../../pages/CartPage';
import { requireEnv } from '../../utils/helpers';
import loginAccounts from '../../data/login_acc.json';
import ccInfoData from '../../data/cc_info.json';
import { TIMEOUT } from 'dns';

const PRODUCT_NAME = 'Sony xperia z5';
const PRODUCT_PRICE = '320';

test.describe('Add to Cart Suite', () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let signInPage: SignInPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    signInPage = new SignInPage(page);
    cartPage = new CartPage(page);
    await homePage.open(requireEnv('BASE_URL'));
  });

  test('TC-005: Verify User Can Add a Product to Cart', async () => {
    let alertMessage = '';
    const { username, password } = loginAccounts.valid_user_account;

    await test.step('Log in with valid account', async () => {
      await homePage.clickLoginButton();
      await signInPage.InputUsername(username);
      await signInPage.InputPassword(password);
      await signInPage.ClickLoginButton();
      await homePage.assertVisible(homePage.logoutButtonLocator);

      /// Check if Cart if not empty then Empty Cart ///
      await homePage.clickCartButton();
      await cartPage.deleteAllItems();
      await homePage.clickHomeButton();
      //////////////////////////////////////////////////
    });

    await test.step('Click on product "Sony xperia z5" from Home page', async () => {
      await homePage.clickProduct(PRODUCT_NAME);
    });

    await test.step('Click Add to cart button', async () => {
      alertMessage = await productPage.addToCart();
    });

    await test.step('Click "Ok" button', async () => {
      expect(alertMessage).toBe('Product added.');
    });

    await test.step('Click "Cart" button on navigation bar', async () => {
      await homePage.clickCartButton();
    });

    await test.step('Verify Cart Page Displayed Correct Informations', async () => {
      const productRow = cartPage.getProductRow(PRODUCT_NAME);
      await cartPage.assertVisible(productRow);
      await cartPage.assertVisible(cartPage.getProductImage(PRODUCT_NAME));
      await expect(cartPage.getProductImage(PRODUCT_NAME)).toHaveAttribute('src', /.+/);
      await expect(cartPage.getProductTitle(PRODUCT_NAME)).toHaveText(PRODUCT_NAME);
      await expect(cartPage.getProductPrice(PRODUCT_NAME)).toHaveText(PRODUCT_PRICE);
      await expect(cartPage.totalLabelLocator).toHaveText(PRODUCT_PRICE);
      await cartPage.assertVisible(cartPage.placeOrderButtonLocator);
    });
  });

  test('TC-006: Verify User Can Add Multiple Different Products to Cart', async () => {
    const { username, password } = loginAccounts.valid_user_account;

    const products = [
      { category: 'Phones', name: 'Samsung galaxy s6', price: '360' },
      { category: 'Laptops', name: 'Sony vaio i5', price: '790' },
      { category: 'Monitors', name: 'Apple monitor 24', price: '400' },
    ];
    const expectedTotal = '1550';

    /// Todo: Will store value of each item into json file then call to get ///
    /// value when needed                                                   ///    

    await test.step('Log in with valid account', async () => {
      await homePage.clickLoginButton();
      await signInPage.InputUsername(username);
      await signInPage.InputPassword(password);
      await signInPage.ClickLoginButton();
      await homePage.assertVisible(homePage.logoutButtonLocator);

      /// Check if Cart if not empty then Empty Cart ///
      await homePage.clickCartButton();
      await cartPage.deleteAllItems();
      await homePage.clickHomeButton();
      //////////////////////////////////////////////////
    });

    await test.step('Add Samsung galaxy s6 (Phones) to cart', async () => {
      await homePage.clickCategory(products[0].category);
      await homePage.clickProduct(products[0].name);
      const alertMessage = await productPage.addToCart();
      expect(alertMessage).toBe('Product added.');
      await homePage.clickHomeButton();
    });

    await test.step('Return Home, add Sony vaio i5 (Laptops)', async () => {
      await homePage.clickCategory(products[1].category);
      await homePage.clickProduct(products[1].name);
      const alertMessage = await productPage.addToCart();
      expect(alertMessage).toBe('Product added.');
      await homePage.clickHomeButton();
    });

    await test.step('Return Home, add Apple monitor 24 (Monitors)', async () => {
      await homePage.clickCategory(products[2].category);
      await homePage.clickProduct(products[2].name);
      const alertMessage = await productPage.addToCart();
      expect(alertMessage).toBe('Product added.');
      await homePage.clickHomeButton();
    });

    await test.step('Navigate to Cart page', async () => {
      await homePage.clickCartButton();
    });

    await test.step('Verify User Can Add Multiple Different Products to Cart and Cart displayed correct info', async () => {
      for (const product of products) {
        await cartPage.assertVisible(cartPage.getProductRow(product.name));
        await expect(cartPage.getProductTitle(product.name)).toHaveText(product.name);
        await expect(cartPage.getProductPrice(product.name)).toHaveText(product.price);
      }
      await expect(cartPage.totalLabelLocator).toHaveText(expectedTotal);
    });
  });

  test('TC-007: Verify Cart Total Recalculates After Deleting an Item', async () => {
    const { username, password } = loginAccounts.valid_user_account;

    const samsung = { category: 'Phones', name: 'Samsung galaxy s6', price: '360' };
    const sony = { category: 'Laptops', name: 'Sony vaio i5', price: '790' };
    const totalBeforeDelete = '1150';
    const totalAfterDelete = sony.price;

    /// Todo: Will store value of each item into json file then call to get ///
    /// value when needed                                                   ///   

    await test.step('Log in with valid account, then add Samsung galaxy s6, Sony vaio i5', async () => {
      await homePage.clickLoginButton();
      await signInPage.InputUsername(username);
      await signInPage.InputPassword(password);
      await signInPage.ClickLoginButton();
      await homePage.assertVisible(homePage.logoutButtonLocator);

      /// Check if Cart if not empty then Empty Cart ///
      await homePage.clickCartButton();
      await cartPage.deleteAllItems();
      await homePage.clickHomeButton();
      //////////////////////////////////////////////////

      await homePage.clickCategory(samsung.category);
      await homePage.clickProduct(samsung.name);
      expect(await productPage.addToCart()).toBe('Product added.');
      await homePage.clickHomeButton();

      await homePage.clickCategory(sony.category);
      await homePage.clickProduct(sony.name);
      expect(await productPage.addToCart()).toBe('Product added.');
      await homePage.clickHomeButton();
    });

    await test.step('Navigate to Cart page', async () => {
      await homePage.clickCartButton();
    });

    await test.step('Verify total = 1150', async () => {
      await cartPage.assertVisible(cartPage.getProductRow(samsung.name));
      await cartPage.assertVisible(cartPage.getProductRow(sony.name));
      await expect(cartPage.totalLabelLocator).toHaveText(totalBeforeDelete);
    });

    await test.step('Click Delete button on Samsung galaxy s6 row', async () => {
      await cartPage.deleteProduct(samsung.name);
    });

    await test.step('Verify total updated', async () => {
      await cartPage.waitForHidden(cartPage.getProductRow(samsung.name));
      await cartPage.assertVisible(cartPage.getProductRow(sony.name));
      await expect(cartPage.totalLabelLocator).toHaveText(totalAfterDelete);
    });
  });

  test('TC-008: Verify User Can Place Order Successfully with Valid Information', async () => {
    const { username, password } = loginAccounts.valid_user_account;
    const orderInfo = ccInfoData.valid_cc_info;

    await test.step('Log in with valid account', async () => {
      await homePage.clickLoginButton();
      await signInPage.InputUsername(username);
      await signInPage.InputPassword(password);
      await signInPage.ClickLoginButton();
      await homePage.assertVisible(homePage.logoutButtonLocator);

      /// Check if Cart if not empty then Empty Cart, then add one product to order ///
      await homePage.clickCartButton();
      await cartPage.deleteAllItems();
      await homePage.clickHomeButton();
      await homePage.clickProduct(PRODUCT_NAME);
      expect(await productPage.addToCart()).toBe('Product added.');
      //////////////////////////////////////////////////////////////////////////////
    });

    await test.step('Navigate to Cart page', async () => {
      await homePage.clickCartButton();
      await cartPage.assertVisible(cartPage.getProductRow(PRODUCT_NAME));
    });

    await test.step('Click Place Order button', async () => {
      await cartPage.clickPlaceOrder();
    });

    await test.step('Fill in all order fields', async () => {
      await cartPage.fillOrderForm(orderInfo);
    });

    await test.step('Click Purchase button', async () => {
      await cartPage.clickPurchase();
    });

    await test.step('Verify confirmation popup', async () => {
      await cartPage.assertVisible(cartPage.confirmationPopupLocator);
      await expect(cartPage.confirmationPopupLocator).toContainText('Thank you for your purchase!');
      await expect(cartPage.confirmationPopupLocator).toContainText(`Card Number: ${orderInfo.card}`);
      await expect(cartPage.confirmationPopupLocator).toContainText(`Name: ${orderInfo.name}`);
    });

    await test.step('Click OK', async () => {
      await cartPage.clickConfirmationOk();
    });

    await test.step('Verify cart is cleared', async () => {
      await homePage.clickCartButton();
      await expect(cartPage.deleteLinksLocator.first()).toBeHidden();
    });
  });

  test('TC-009: Verify Item Still In Cart After Refresh Page', async () => {
    const { username, password } = loginAccounts.valid_user_account;

    await test.step('Log in with valid account', async () => {
      await homePage.clickLoginButton();
      await signInPage.InputUsername(username);
      await signInPage.InputPassword(password);
      await signInPage.ClickLoginButton();
      await homePage.assertVisible(homePage.logoutButtonLocator);

      /// Check if Cart if not empty then Empty Cart ///
      await homePage.clickCartButton();
      await cartPage.deleteAllItems();
      await homePage.clickHomeButton();
      //////////////////////////////////////////////////
    });

    await test.step('Add product to cart', async () => {
      await homePage.clickProduct(PRODUCT_NAME);
      expect(await productPage.addToCart()).toBe('Product added.');
    });

    await test.step('Navigate to Cart page', async () => {
      await homePage.clickCartButton();
      await cartPage.assertVisible(cartPage.getProductRow(PRODUCT_NAME));
      await expect(cartPage.totalLabelLocator).toHaveText(PRODUCT_PRICE);
    });

    await test.step('Refresh the page', async () => {
      await cartPage.reload();
    });

    await test.step('Verify cart information still displayed correctly after refresh', async () => {
      await cartPage.assertVisible(cartPage.getProductRow(PRODUCT_NAME));
      await expect(cartPage.getProductTitle(PRODUCT_NAME)).toHaveText(PRODUCT_NAME);
      await expect(cartPage.getProductPrice(PRODUCT_NAME)).toHaveText(PRODUCT_PRICE);
      await expect(cartPage.totalLabelLocator).toHaveText(PRODUCT_PRICE);
    });
  });


  /////// NEGATIVE TESTCASES //////

  test('TC-017: Verify User Cannot Place Order with Empty Name and Credit Card', async () => {
    const { username, password } = loginAccounts.valid_user_account;
    const orderInfo = ccInfoData.valid_cc_info;

    await test.step('Log in with valid account', async () => {
      await homePage.clickLoginButton();
      await signInPage.InputUsername(username);
      await signInPage.InputPassword(password);
      await signInPage.ClickLoginButton();
      await homePage.assertVisible(homePage.logoutButtonLocator);

      /// Check if Cart if not empty then Empty Cart, then add one product to order ///
      await homePage.clickCartButton();
      await cartPage.deleteAllItems();
      await homePage.clickHomeButton();
      await homePage.clickProduct(PRODUCT_NAME);
      expect(await productPage.addToCart()).toBe('Product added.');
      //////////////////////////////////////////////////////////////////////////////
    });

    await test.step('Navigate to Cart page', async () => {
      await homePage.clickCartButton();
      await cartPage.assertVisible(cartPage.getProductRow(PRODUCT_NAME));
    });

    await test.step('Click Place Order button', async () => {
      await cartPage.clickPlaceOrder();
    });

    await test.step('Input all fields with correct info, leave name and credit card field empty', async () => {
      await cartPage.fillOrderForm({
        country: orderInfo.country,
        city: orderInfo.city,
        month: orderInfo.month,
        year: orderInfo.year,
      });
    });

    await test.step('Click Purchase button', async () => {
      const alertMessage = await cartPage.captureDialogMessage(() => cartPage.clickPurchase());
      expect(alertMessage).toBe('Please fill out Name and Creditcard.');
    });

    await test.step('Verify user cannot place order', async () => {
      await cartPage.assertVisible(cartPage.orderModalLocator);
      await expect(cartPage.confirmationPopupLocator).toBeHidden();
      await cartPage.assertVisible(cartPage.getProductRow(PRODUCT_NAME));
    });
  });

  test('TC-018: Verify User Cannot Place Order with Non-numeric Credit Card', async () => {
    const { username, password } = loginAccounts.valid_user_account;
    const orderInfo = ccInfoData.non_numeric_card_info;

    await test.step('Log in with valid account', async () => {
      await homePage.clickLoginButton();
      await signInPage.InputUsername(username);
      await signInPage.InputPassword(password);
      await signInPage.ClickLoginButton();
      await homePage.assertVisible(homePage.logoutButtonLocator);

      /// Check if Cart if not empty then Empty Cart, then add one product to order ///
      await homePage.clickCartButton();
      await cartPage.deleteAllItems();
      await homePage.clickHomeButton();
      await homePage.clickProduct(PRODUCT_NAME);
      expect(await productPage.addToCart()).toBe('Product added.');
      //////////////////////////////////////////////////////////////////////////////
    });

    await test.step('Navigate to Cart page', async () => {
      await homePage.clickCartButton();
      await cartPage.assertVisible(cartPage.getProductRow(PRODUCT_NAME));
    });

    await test.step('Click Place Order button', async () => {
      await cartPage.clickPlaceOrder();
    });

    await test.step('Enter valid Name', async () => {
      await cartPage.fillOrderForm({ name: orderInfo.name });
    });

    await test.step('Enter non-numeric text in Credit card field', async () => {
      await cartPage.fillOrderForm({
        country: orderInfo.country,
        city: orderInfo.city,
        card: orderInfo.card,
        month: orderInfo.month,
        year: orderInfo.year,
      });
    });

    await test.step('Click Purchase button', async () => {
      await cartPage.clickPurchase();
    });

    await test.step('Verify user cannot place order and invalid credit card format error is displayed', async () => {
      await cartPage.assertVisible(cartPage.orderErrorLocator);
      await expect(cartPage.orderErrorLocator).toContainText(/invalid credit card/i);
      await expect(cartPage.confirmationPopupLocator).toBeHidden();
      await cartPage.assertVisible(cartPage.getProductRow(PRODUCT_NAME));
    });
  });

  test('TC-019: Verify User Cannot Place Order with Empty Cart', async () => {
    const { username, password } = loginAccounts.valid_user_account;

    await test.step('Log in with valid account', async () => {
      await homePage.clickLoginButton();
      await signInPage.InputUsername(username);
      await signInPage.InputPassword(password);
      await signInPage.ClickLoginButton();
      await homePage.assertVisible(homePage.logoutButtonLocator);
    });

    await test.step('Navigate to Cart page (empty)', async () => {
      await homePage.clickCartButton();
      await cartPage.deleteAllItems();
    });

    await test.step('Click Place Order button', async () => {
      await cartPage.clickPlaceOrder();
    });

    await test.step('Verify user cannot place order and "Cart is empty" error is displayed', async () => {
      await expect(cartPage.orderModalLocator).toBeHidden();
      await cartPage.assertVisible(cartPage.orderErrorLocator);
      await expect(cartPage.orderErrorLocator).toContainText(/cart is empty/i);
    });
  });

  /////// EDGE CASES  //////

  test('TC-022: Verify Adding Same Product Multiple Times to Cart', async () => {
    const { username, password } = loginAccounts.valid_user_account;
    const samsung = { category: 'Phones', name: 'Samsung galaxy s6', price: '360' };
    const expectedTotal = '720';

    await test.step('Log in with valid account', async () => {
      await homePage.clickLoginButton();
      await signInPage.InputUsername(username);
      await signInPage.InputPassword(password);
      await signInPage.ClickLoginButton();
      await homePage.assertVisible(homePage.logoutButtonLocator);

      /// Check if Cart if not empty then Empty Cart ///
      await homePage.clickCartButton();
      await cartPage.deleteAllItems();
      await homePage.clickHomeButton();
      //////////////////////////////////////////////////
    });

    await test.step('Open Samsung galaxy s6 product page', async () => {
      await homePage.clickCategory(samsung.category);
      await homePage.clickProduct(samsung.name);
    });

    await test.step('Click Add to cart button', async () => {
      expect(await productPage.addToCart()).toBe('Product added.');
    });

    await test.step('Click Add to cart button again', async () => {
      expect(await productPage.addToCart()).toBe('Product added.');
    });

    await test.step('Navigate to Cart page', async () => {
      await homePage.clickCartButton();
    });

    await test.step('Verify user can add duplicate item', async () => {
      await expect(cartPage.getProductRow(samsung.name)).toHaveCount(2);
      for (const row of await cartPage.getProductRow(samsung.name).all()) {
        await expect(row).toContainText(samsung.price);
      }
      await expect(cartPage.totalLabelLocator).toHaveText(expectedTotal);
    });
  });

  test('TC-023: Verify Guest User Can Add Product to Cart Without Login', async () => {
    let alertMessage = '';

    await test.step('User is logged out', async () => {
      await homePage.assertVisible(homePage.loginButtonLocator);
    });

    await test.step('Click Add to cart button', async () => {
      await homePage.clickProduct(PRODUCT_NAME);
      alertMessage = await productPage.addToCart();
      expect(alertMessage).toBe('Product added');
    });

    await test.step('Navigate to Cart page', async () => {
      await homePage.clickCartButton();
    });

    await test.step('Verify product displayed (Guest add to cart succeed)', async () => {
      await cartPage.assertVisible(cartPage.getProductRow(PRODUCT_NAME));
      await expect(cartPage.getProductTitle(PRODUCT_NAME)).toHaveText(PRODUCT_NAME);
      await expect(cartPage.getProductPrice(PRODUCT_NAME)).toHaveText(PRODUCT_PRICE);
    });
  });
});
