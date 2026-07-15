import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './test_suites',
  testMatch: '**/*.spec.ts',

  // ── Global Settings ───────────────────────────────────────────────────────
  fullyParallel: true,
  forbidOnly: !!process.env.CI,   // Fail the build if .only is committed
  retries: process.env.CI ? 2 : 0, // Retry on CICD
  // retries: 2, // retry failed tests 2 times on LOCAL
  workers: process.env.CI ? 1 : 2,
  timeout: Number(process.env.DEFAULT_TIMEOUT) || 30_000,

  // ── Reporters ─────────────────────────────────────────────────────────────
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'on-failure' }],

    // Report Config  /////////////////////////
    // always → auto‑open after run
    // never → manual via show-report
    // on-failure → open only if tests fail
    //////////////////////////////////////////

    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list'],   // Console output during test run
  ],

  // ── Shared Browser Context ────────────────────────────────────────────────
  use: {
    baseURL: process.env.BASE_URL || 'https://www.demoblaze.com/',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,    //time out wait
    navigationTimeout: 30_000,
    headless: !!process.env.CI, // headed locally, headless on CI runners (no display server)
  },

  
  projects: [
    {
      name: 'language',
      testDir: './test_suites/language',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { slowMo: Number(process.env.SLOW_MO) || 0 },
      },
    },
    {
      name: 'magazine',
      testDir: './test_suites/magazine',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { slowMo: Number(process.env.SLOW_MO) || 0 },
      },
    },
    {
      name: 'login',
      testDir: './test_suites/login',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { slowMo: Number(process.env.SLOW_MO) || 0 },
      },
    },
    {
      name: 'add_to_cart',
      testDir: './test_suites/add_to_cart',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { slowMo: Number(process.env.SLOW_MO) || 0 },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: { slowMo: Number(process.env.SLOW_MO) || 0 },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        launchOptions: { slowMo: Number(process.env.SLOW_MO) || 0 },
      },
    },
  ],

  
  outputDir: 'test-results',
});
