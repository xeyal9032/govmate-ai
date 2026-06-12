#!/usr/bin/env node
/**
 * docs/screenshots/{locale}/ → public/marketing/{locale}/ kopyalar.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcDir = path.join(root, 'docs', 'screenshots');
const destDir = path.join(root, 'public', 'marketing');

const locales = ['tr', 'de', 'en', 'az', 'ru', 'uk', 'ar'];
const localeFiles = [
  'dashboard.png',
  'upload.png',
  'templates.png',
  'landing-how-it-works.png',
  'landing-pricing.png',
];
const rootFiles = ['demo.gif', 'landing-hero.png'];

let copied = 0;

fs.mkdirSync(destDir, { recursive: true });

for (const file of rootFiles) {
  const src = path.join(srcDir, file);
  if (!fs.existsSync(src)) continue;
  fs.copyFileSync(src, path.join(destDir, file));
  copied++;
  console.log(`Kopyalandı: ${file}`);
}

for (const locale of locales) {
  const srcLocale = path.join(srcDir, locale);
  const destLocale = path.join(destDir, locale);
  if (!fs.existsSync(srcLocale)) continue;

  fs.mkdirSync(destLocale, { recursive: true });
  for (const file of localeFiles) {
    const src = path.join(srcLocale, file);
    if (!fs.existsSync(src)) continue;
    fs.copyFileSync(src, path.join(destLocale, file));
    copied++;
    console.log(`Kopyalandı: ${locale}/${file}`);
  }
}

if (copied === 0) {
  console.warn('Kopyalanacak dosya bulunamadı. Önce: npm run screenshots');
  process.exit(1);
}

console.log(`${copied} dosya public/marketing/ altına senkronize edildi.`);
