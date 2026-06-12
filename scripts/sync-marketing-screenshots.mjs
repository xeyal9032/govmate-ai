#!/usr/bin/env node
/**
 * docs/screenshots/ → public/marketing/ kopyalar (landing görselleri).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcDir = path.join(root, 'docs', 'screenshots');
const destDir = path.join(root, 'public', 'marketing');

const files = [
  'dashboard.png',
  'demo.gif',
  'landing-hero.png',
  'landing-how-it-works.png',
  'landing-pricing.png',
  'templates.png',
  'upload.png',
];

fs.mkdirSync(destDir, { recursive: true });

let copied = 0;
for (const file of files) {
  const src = path.join(srcDir, file);
  if (!fs.existsSync(src)) continue;
  fs.copyFileSync(src, path.join(destDir, file));
  copied++;
  console.log(`Kopyalandı: ${file}`);
}

if (copied === 0) {
  console.warn('Kopyalanacak dosya bulunamadı. Önce: npm run screenshots');
  process.exit(1);
}

console.log(`${copied} dosya public/marketing/ altına senkronize edildi.`);
