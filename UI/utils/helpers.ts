import { Page } from '@playwright/test';

/**
 * helpers.ts
 * ----------
 * Shared utility functions used across test files.
 * These are stateless helpers — they do not belong to any single page.
 */

/**
 * Read an environment variable and throw a descriptive error if it is missing.
 * Prefer this over raw `process.env` access in tests.
 *
 * @example
 *   const baseUrl = requireEnv('BASE_URL');
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Environment variable "${key}" is not set. ` +
      `Check your .env file or CI environment.`
    );
  }
  return value;
}

/**
 * Optionally read an environment variable, returning a default if absent.
 */
export function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Take a labelled screenshot and save it to the test-results directory.
 * Useful for visual debugging during test development.
 *
 * @param page     - Active Playwright Page instance
 * @param label    - Descriptive name for the screenshot file (no extension)
 */
export async function takeDebugScreenshot(page: Page, label: string): Promise<void> {
  const sanitised = label.replace(/[^a-zA-Z0-9_-]/g, '_');
  await page.screenshot({
    path: `test-results/debug_${sanitised}_${Date.now()}.png`,
    fullPage: true,
  });
}

/**
 * Build a full locale-aware URL from a base and a path segment.
 *
 * @example
 *   buildLocaleUrl('https://www.haba-play.com', 'en-gb', 'highlights')
 *   // → 'https://www.haba-play.com/en-gb/highlights/'
 */
export function buildLocaleUrl(base: string, locale: string, path: string = ''): string {
  const cleanBase = base.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '').replace(/\/$/, '');
  return cleanPath
    ? `${cleanBase}/${locale}/${cleanPath}/`
    : `${cleanBase}/${locale}/`;
}
