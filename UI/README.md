Assignment for 99tech (https://www.demoblaze.com/)

## Table of Contents

- [Framework Structure](#framework-structure)
  - [Why this structure](#why-this-structure)
  - [Why Playwright](#why-playwright)
- [Prerequisites](#prerequisites)
- [Steps to Run the Demo (Test Suite)](#steps-to-run-the-demo-test-suite)
  - [1. Install dependencies](#1-install-dependencies)
  - [2. Install Playwright browsers (one-time)](#2-install-playwright-browsers-one-time)
  - [3. Set up environment variables](#3-set-up-environment-variables)
  - [4. Run the tests](#4-run-the-tests)
  - [5. View the report](#5-view-the-report)
- [TODO](#todo)

## Framework Structure

```
99tech_assigntment/
├── playwright.config.ts    # Central Playwright configuration
├── pages/                  # Page Object Models — all selectors live here
│   ├── BasePage.ts         # Abstract base: navigation, waits, assertions, dialog
│   ├── HomePage.ts         # Nav bar (login/logout/cart/category links), product
│   ├── SignInPage.ts       # Login modal
│   ├── ProductPage.ts      # Product detail page ("Add to cart")
│   └── CartPage.ts         # Cart table, delete, Place Order + Purchase flow
├── data/                   # JSON test-data fixtures
│   ├── login_acc.json      # data for login accounts
│   └── cc_info.json        # data for credit card info
├── test_suites/
│   ├── login/              # Login suite
│   │   └── login.spec.ts
│   └── add_to_cart/        # Cart & checkout suite
│       └── addToCart.spec.ts
└── utils/
    └── helpers.ts          # requireEnv/optionalEnv, screenshot helper, URL builder
```

### Why this structure

- Follow POM design pattern:
    - Each page only contain possible action/method/locator on that specific page.
    - When there is a change in code, tester only need to edit on that specific page => save time and cost when maintainance.
    - Data store on seperated folder, using json format
    - Easy to understand and training.

### Why Playwright

- Much faster than traditional Selenium.
- Suport native pararel execution.
- Suport built-in auto-waiting.

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9

## Steps to Run the Demo (for MAC os)

### 1. Install dependencies

```bash
npm install
```

### 2. Install Playwright browsers (one-time)

```bash
npx playwright install --with-deps
```

### 3. Set up environment variables

Create a `.env` file in the project root (tests read `BASE_URL` directly and will fail without it):

```bash
BASE_URL=https://www.demoblaze.com/
DEFAULT_TIMEOUT=30000
SLOW_MO=0
```

### 4. Run the tests

```bash
# Run everything (headed by default — a visible browser window opens)
npm test
```

Or target one suite/project:

```bash
npx playwright test --project=login
npx playwright test --project=add_to_cart
```

Run a single spec file:

```bash
npx playwright test test_suites/add_to_cart/addToCart.spec.ts
```

Run a single test case by name:

```bash
npx playwright test --project=add_to_cart -g "TC-005"
```

Run on a specific browser:

```bash
npx playwright test --project=firefox
npx playwright test --project=webkit
```

Run headless instead of headed:

```bash
npx playwright test --headed=false
```

Step through a test interactively:

```bash
npm run test:debug
# or the Playwright UI runner:
npm run test:ui
```

### 5. View the report

After a run, open the HTML report (auto-opens only on failure otherwise):

```bash
npm run report
```

Reports land in `playwright-report/` (HTML + JSON); screenshots, videos, and traces for failed tests land in `test-results/`.

## TODO

- Add test data for item 's prices.
- Implement API testcase.
- Implement NFT testcase.
- Interage report (grafana etc..)
- Add more test data so can execute paralel to save time, right now only have 1 testdata => cant run paralel.
- Add Chrome to brower list.
