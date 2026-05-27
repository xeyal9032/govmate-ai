#!/usr/bin/env node
/**
 * Tüm messages/*.json dosyalarında tr.json ile aynı anahtar yapısını doğrular.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const messagesDir = path.join(__dirname, '..', 'messages');
const baseLocale = 'tr';
const locales = ['tr', 'de', 'en', 'az', 'ru', 'uk', 'ar'];

function flattenKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, full));
    } else {
      keys.push(full);
    }
  }
  return keys.sort();
}

function loadLocale(locale) {
  const file = path.join(messagesDir, `${locale}.json`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const base = loadLocale(baseLocale);
const baseKeys = new Set(flattenKeys(base));

let failed = false;

for (const locale of locales) {
  if (locale === baseLocale) continue;
  const data = loadLocale(locale);
  const keys = new Set(flattenKeys(data));

  const missing = [...baseKeys].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !baseKeys.has(k));

  if (missing.length || extra.length) {
    failed = true;
    console.error(`\n[${locale}]`);
    if (missing.length) {
      console.error(`  Eksik (${missing.length}):`, missing.slice(0, 15).join(', '));
      if (missing.length > 15) console.error(`  ... ve ${missing.length - 15} tane daha`);
    }
    if (extra.length) {
      console.error(`  Fazla (${extra.length}):`, extra.slice(0, 15).join(', '));
    }
  } else {
    console.log(`[${locale}] OK (${keys.size} anahtar)`);
  }
}

console.log(`\n[${baseLocale}] referans: ${baseKeys.size} anahtar`);

// Kritik yeni anahtarlar
const critical = [
  'documents.detail.createLetterTitle',
  'documents.detail.createLetterButtonAuto',
  'letters.generate.autoFromDocument',
  'admin.supportTitle',
];

for (const locale of locales) {
  const data = loadLocale(locale);
  const flat = new Set(flattenKeys(data));
  for (const key of critical) {
    if (!flat.has(key)) {
      failed = true;
      console.error(`[${locale}] KRİTİK EKSİK: ${key}`);
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log('\nTüm dil dosyaları senkron.');
