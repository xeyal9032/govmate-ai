import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { getE2ECredentials, loginAsE2EUser } from './helpers/auth';

const OUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

test.describe('README ekran görüntüleri', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(() => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  });

  test.use({
    viewport: { width: 1280, height: 800 },
    colorScheme: 'light',
  });

  test('landing ve bölümler', async ({ page }) => {
    await page.goto('/tr');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.screenshot({
      path: path.join(OUT_DIR, 'landing-hero.png'),
      fullPage: false,
    });

    await page.locator('#how-it-works').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(OUT_DIR, 'landing-how-it-works.png'),
      fullPage: false,
    });

    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(OUT_DIR, 'landing-pricing.png'),
      fullPage: false,
    });
  });

  test('dashboard (oturum)', async ({ page }) => {
    test.skip(
      !getE2ECredentials().configured,
      'E2E kullanıcısı .env.local içinde tanımlı olmalı'
    );

    const ok = await loginAsE2EUser(page);
    test.skip(!ok, 'E2E girişi başarısız');

    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(OUT_DIR, 'dashboard.png'),
      fullPage: false,
    });

    await page.goto('/tr/dashboard/templates');
    await expect(page).toHaveURL(/\/templates/);
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(OUT_DIR, 'templates.png'),
      fullPage: false,
    });

    await page.goto('/tr/dashboard/upload');
    await expect(page).toHaveURL(/\/upload/);
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(OUT_DIR, 'upload.png'),
      fullPage: false,
    });
  });

  test('demo GIF kareleri', async ({ page }) => {
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

    const loginLink = page.getByRole('link', { name: /giriş|login|anmelden/i }).first();
    await loginLink.scrollIntoViewIfNeeded();
    await loginLink.click();
    await expect(page).toHaveURL(/\/auth\/login/);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(framesDir, 'frame-04.png') });
  });
});
