import { expect, type Page } from '@playwright/test';

export function getE2ECredentials() {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;
  return { email, password, configured: Boolean(email && password) };
}

export function getE2EAdminCredentials() {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  return { email, password, configured: Boolean(email && password) };
}

export async function loginWithCredentials(
  page: Page,
  email: string,
  password: string,
  locale = 'tr'
) {
  await page.goto(`/${locale}/auth/login`);
  await page.getByLabel(/e-posta|email/i).fill(email);
  await page.getByLabel(/şifre|password/i).fill(password);
  await page.getByRole('button', { name: /giriş|login|anmelden/i }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 45_000 });
  return true;
}

export async function loginAsE2EUser(page: Page, locale = 'tr') {
  const { email, password, configured } = getE2ECredentials();
  if (!configured || !email || !password) {
    return false;
  }
  return loginWithCredentials(page, email, password, locale);
}

export async function loginAsE2EAdmin(page: Page, locale = 'tr') {
  const { email, password, configured } = getE2EAdminCredentials();
  if (!configured || !email || !password) {
    return false;
  }
  return loginWithCredentials(page, email, password, locale);
}
