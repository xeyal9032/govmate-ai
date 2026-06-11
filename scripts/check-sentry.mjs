/**
 * Sentry ortam değişkenlerini doğrular.
 * DSN tanımlıysa source map yüklemesi için AUTH_TOKEN önerilir.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(process.cwd(), '.env.local');
if (!existsSync(envPath)) {
  console.log('[sentry] .env.local yok — atlanıyor');
  process.exit(0);
}

const env = readFileSync(envPath, 'utf8');

function getValue(key) {
  const match = env.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : '';
}

const dsn = getValue('NEXT_PUBLIC_SENTRY_DSN') || getValue('SENTRY_DSN');
const token = getValue('SENTRY_AUTH_TOKEN');
const org = getValue('SENTRY_ORG');
const project = getValue('SENTRY_PROJECT');

if (!dsn) {
  console.log('[sentry] DSN yok — Sentry devre dışı (OK)');
  process.exit(0);
}

const missing = [];
if (!org) missing.push('SENTRY_ORG');
if (!project) missing.push('SENTRY_PROJECT');

if (missing.length > 0) {
  console.warn(`[sentry] UYARI: DSN var ama eksik: ${missing.join(', ')}`);
  process.exit(1);
}

if (!token) {
  console.warn('[sentry] UYARI: SENTRY_AUTH_TOKEN boş — production build source map yüklenmez.');
  console.warn('[sentry] Token: https://sentry.io/settings/account/api/auth-tokens/');
  console.warn('[sentry] İzinler: org:read, project:releases, project:write');
  console.warn('[sentry] Vercel → Project → Settings → Environment Variables → SENTRY_AUTH_TOKEN');
  process.exit(0);
}

console.log('[sentry] OK — DSN, org, project ve auth token tanımlı');
