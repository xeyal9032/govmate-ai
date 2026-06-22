import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { getE2ECredentials, loginAsE2EUser } from './helpers/auth';

const LOCALES = ['tr', 'de', 'en', 'az', 'ru', 'uk', 'ar'] as const;

const OUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
const MARKETING_DIR = path.join(__dirname, '..', 'public', 'marketing');

const LOCALE_SHOWCASE_FILES = [
  'dashboard.png',
  'upload.png',
  'templates.png',
  'landing-how-it-works.png',
  'landing-pricing.png',
] as const;

const ROOT_MARKETING_FILES = ['demo.gif', 'landing-hero.png'] as const;

function localeDir(base: string, locale: string) {
  return path.join(base, locale);
}

function syncToMarketing() {
  fs.mkdirSync(MARKETING_DIR, { recursive: true });

  for (const file of ROOT_MARKETING_FILES) {
    const src = path.join(OUT_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(MARKETING_DIR, file));
    }
  }

  for (const locale of LOCALES) {
    const srcLocale = localeDir(OUT_DIR, locale);
    const destLocale = localeDir(MARKETING_DIR, locale);
    if (!fs.existsSync(srcLocale)) continue;

    fs.mkdirSync(destLocale, { recursive: true });
    for (const file of LOCALE_SHOWCASE_FILES) {
      const src = path.join(srcLocale, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(destLocale, file));
      }
    }
  }
}

test.describe('README ekran görüntüleri', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(() => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  });

  test.afterAll(() => {
    syncToMarketing();
  });

  test.use({
    viewport: { width: 1280, height: 800 },
    colorScheme: 'light',
  });

  test('landing hero (tr)', async ({ page }) => {
    await page.goto('/tr');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.screenshot({
      path: path.join(OUT_DIR, 'landing-hero.png'),
      fullPage: false,
    });
  });

  for (const locale of LOCALES) {
    test(`landing bölümleri (${locale})`, async ({ page }) => {
      const out = localeDir(OUT_DIR, locale);
      fs.mkdirSync(out, { recursive: true });

      await page.goto(`/${locale}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      const howItWorks = page.locator('#how-it-works');
      await expect(howItWorks).toBeVisible();
      await howItWorks.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(out, 'landing-how-it-works.png'),
        fullPage: false,
      });

      await page.locator('#pricing').scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(out, 'landing-pricing.png'),
        fullPage: false,
      });
    });
  }

  for (const locale of LOCALES) {
    test(`dashboard görselleri (${locale})`, async ({ page }) => {
      test.skip(
        !getE2ECredentials().configured,
        'E2E kullanıcısı .env.local içinde tanımlı olmalı'
      );

      const ok = await loginAsE2EUser(page, locale);
      test.skip(!ok, 'E2E girişi başarısız');

      const out = localeDir(OUT_DIR, locale);
      fs.mkdirSync(out, { recursive: true });

      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: path.join(out, 'dashboard.png'),
        fullPage: false,
      });

      await page.goto(`/${locale}/dashboard/templates`);
      await expect(page).toHaveURL(/\/templates/);
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: path.join(out, 'templates.png'),
        fullPage: false,
      });

      await page.goto(`/${locale}/dashboard/upload`);
      await expect(page).toHaveURL(/\/upload/);
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: path.join(out, 'upload.png'),
        fullPage: false,
      });
    });
  }

  test('demo GIF kareleri (tr)', async ({ page }) => {
    const framesDir = path.join(OUT_DIR, 'gif-frames');
    fs.mkdirSync(framesDir, { recursive: true });

    await page.goto('/tr');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.screenshot({ path: path.join(framesDir, 'frame-01.png') });

    await page.locator('#how-it-works').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(framesDir, 'frame-02.png') });

    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(framesDir, 'frame-03.png') });

    const loginLink = page.locator('nav').getByRole('link', { name: /giriş|login|anmelden/i });
    await expect(loginLink).toBeVisible();
    await Promise.all([page.waitForURL(/\/auth\/login/), loginLink.click()]);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(framesDir, 'frame-04.png') });
  });
});
