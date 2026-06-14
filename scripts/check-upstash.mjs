/**
 * Production ortamında Upstash Redis yapılandırmasını doğrular.
 * Vercel deploy öncesi veya CI'da NODE_ENV=production ile çalıştırılabilir.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(process.cwd(), '.env.local');
const isProdCheck = process.env.CHECK_PRODUCTION_ENV === '1';

function getEnvValue(key) {
  if (process.env[key]) return process.env[key].trim();
  if (!existsSync(envPath)) return '';
  const env = readFileSync(envPath, 'utf8');
  const match = env.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : '';
}

const url = getEnvValue('UPSTASH_REDIS_REST_URL');
const token = getEnvValue('UPSTASH_REDIS_REST_TOKEN');

if (!isProdCheck) {
  if (url && token) {
    console.log('[upstash] Redis yapılandırıldı (OK)');
  } else {
    console.log('[upstash] Redis yok — geliştirmede bellek modu kullanılır (OK)');
  }
  process.exit(0);
}

if (!url || !token) {
  console.error('[upstash] HATA: Production için UPSTASH_REDIS_REST_URL ve UPSTASH_REDIS_REST_TOKEN zorunlu.');
  console.error('Upstash Console → Database → REST API → URL + Token');
  process.exit(1);
}

console.log('[upstash] Production Redis yapılandırması tamam (OK)');
