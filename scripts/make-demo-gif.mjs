#!/usr/bin/env node
/**
 * docs/screenshots/gif-frames/*.png dosyalarından demo.gif üretir.
 * ffmpeg yüklü değilse uyarı verir ve çıkar.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const framesDir = path.join(root, 'docs', 'screenshots', 'gif-frames');
const outGif = path.join(root, 'docs', 'screenshots', 'demo.gif');
const marketingGif = path.join(root, 'public', 'marketing', 'demo.gif');

if (!fs.existsSync(framesDir)) {
  console.error('Önce: npm run screenshots');
  process.exit(1);
}

const frames = fs
  .readdirSync(framesDir)
  .filter((f) => /^frame-\d+\.png$/i.test(f))
  .sort();

if (frames.length === 0) {
  console.error('gif-frames klasöründe kare bulunamadı.');
  process.exit(1);
}

const ffmpeg = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' });
if (ffmpeg.status !== 0) {
  console.warn('ffmpeg bulunamadı — demo.gif atlanıyor. README yalnızca PNG kullanacak.');
  process.exit(0);
}

const inputPattern = path.join(framesDir, 'frame-%02d.png');
const result = spawnSync(
  'ffmpeg',
  [
    '-y',
    '-framerate',
    '0.5',
    '-start_number',
    '1',
    '-i',
    inputPattern,
    '-vf',
    'scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse',
    '-loop',
    '0',
    outGif,
  ],
  { stdio: 'inherit' }
);

if (result.status === 0) {
  console.log('Oluşturuldu:', outGif);
  fs.mkdirSync(path.dirname(marketingGif), { recursive: true });
  fs.copyFileSync(outGif, marketingGif);
  console.log('Kopyalandı:', marketingGif);
} else {
  process.exit(result.status ?? 1);
}
