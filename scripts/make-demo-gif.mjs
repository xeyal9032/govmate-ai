#!/usr/bin/env node
/**
 * demo.gif üretir:
 * 1) docs/screenshots/gif-frames/*.png varsa onlardan
 * 2) yoksa public/marketing/en/ vitrin PNG'lerinden (temiz İngilizce ekran görüntüleri)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const framesDir = path.join(root, 'docs', 'screenshots', 'gif-frames');
const enMarketingDir = path.join(root, 'public', 'marketing', 'en');
const outGif = path.join(root, 'docs', 'screenshots', 'demo.gif');
const marketingGif = path.join(root, 'public', 'marketing', 'demo.gif');

const FALLBACK_FILES = [
  'upload.png',
  'dashboard.png',
  'templates.png',
  'landing-how-it-works.png',
  'landing-pricing.png',
];

const ffmpeg = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' });
if (ffmpeg.status !== 0) {
  console.warn('ffmpeg bulunamadı — demo.gif atlanıyor.');
  process.exit(0);
}

function prepareFramesFromMarketing() {
  const tempDir = path.join(root, 'docs', 'screenshots', '_gif-temp');
  fs.mkdirSync(tempDir, { recursive: true });

  FALLBACK_FILES.forEach((file, index) => {
    const src = path.join(enMarketingDir, file);
    if (!fs.existsSync(src)) {
      throw new Error(`Eksik: ${src}`);
    }
    const dest = path.join(tempDir, `frame-${String(index + 1).padStart(2, '0')}.png`);
    fs.copyFileSync(src, dest);
  });

  return tempDir;
}

let inputDir = null;
let tempDir = null;

const enSourcesReady = FALLBACK_FILES.every((file) =>
  fs.existsSync(path.join(enMarketingDir, file)),
);

if (enSourcesReady) {
  console.log('public/marketing/en/ görselleri kullanılıyor.');
  tempDir = prepareFramesFromMarketing();
  inputDir = tempDir;
} else if (fs.existsSync(framesDir)) {
  const frameFiles = fs
    .readdirSync(framesDir)
    .filter((f) => /^frame-\d+\.png$/i.test(f));
  if (frameFiles.length > 0) {
    inputDir = framesDir;
  }
}

if (!inputDir) {
  console.error('demo.gif için kaynak bulunamadı.');
  process.exit(1);
}

const inputPattern = path.join(inputDir, 'frame-%02d.png');
const result = spawnSync(
  'ffmpeg',
  [
    '-y',
    '-framerate',
    '0.35',
    '-start_number',
    '1',
    '-i',
    inputPattern,
    '-vf',
    'scale=1280:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse',
    '-loop',
    '0',
    outGif,
  ],
  { stdio: 'inherit' },
);

if (tempDir) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

if (result.status === 0) {
  console.log('Oluşturuldu:', outGif);
  fs.mkdirSync(path.dirname(marketingGif), { recursive: true });
  fs.copyFileSync(outGif, marketingGif);
  console.log('Kopyalandı:', marketingGif);
} else {
  process.exit(result.status ?? 1);
}
