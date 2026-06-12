#!/usr/bin/env node
/** oauthFailed i18n anahtarını tüm locale dosyalarına ekler */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const messagesDir = path.join(__dirname, '..', 'messages');

const patches = {
  de: 'Google-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.',
  en: 'Google sign-in failed. Please try again.',
  az: 'Google ilə giriş uğursuz oldu. Yenidən cəhd edin.',
  ru: 'Не удалось войти через Google. Попробуйте снова.',
  uk: 'Не вдалося увійти через Google. Спробуйте ще раз.',
  ar: 'فشل تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.',
};

for (const [locale, text] of Object.entries(patches)) {
  const file = path.join(messagesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.auth.errors.oauthFailed = text;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`[${locale}] oauthFailed eklendi`);
}
