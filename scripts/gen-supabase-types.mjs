#!/usr/bin/env node
/**
 * Supabase TypeScript tiplerini üretir.
 *
 * Kullanım:
 *   npm run gen:types
 *
 * Project ID kaynakları (sırayla):
 *   1. SUPABASE_PROJECT_ID
 *   2. NEXT_PUBLIC_SUPABASE_URL → https://<id>.supabase.co
 *
 * veya yerel Supabase CLI ile:
 *   npm run gen:types:local
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outFile = path.join(root, 'src', 'types', 'supabase.generated.ts');

dotenv.config({ path: path.join(root, '.env.local') });

function resolveProjectId() {
  if (process.env.SUPABASE_PROJECT_ID) {
    return process.env.SUPABASE_PROJECT_ID.trim();
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    const id = host.split('.')[0];
    return id && id !== 'localhost' ? id : null;
  } catch {
    return null;
  }
}

const projectId = resolveProjectId();

if (!projectId) {
  console.error('Hata: Supabase project ID bulunamadı.');
  console.error('SUPABASE_PROJECT_ID veya NEXT_PUBLIC_SUPABASE_URL tanımlayın (.env.local).');
  console.error('Dashboard → Project Settings → General → Reference ID');
  process.exit(1);
}

const header = `/* eslint-disable */
/**
 * Otomatik üretilmiş dosya — elle düzenlemeyin.
 * Güncellemek için: npm run gen:types
 */
`;

try {
  const types = execSync(
    `npx supabase gen types typescript --project-id ${projectId}`,
    { encoding: 'utf8', cwd: root, stdio: ['pipe', 'pipe', 'pipe'] }
  );
  fs.writeFileSync(outFile, `${header}${types}`, 'utf8');
  console.log(`Tipler yazıldı: ${path.relative(root, outFile)} (project: ${projectId})`);
} catch (error) {
  console.error('Supabase CLI tip üretimi başarısız.');
  const err = error;
  if (err && typeof err === 'object' && 'stderr' in err && err.stderr) {
    console.error(String(err.stderr));
  } else if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error(error);
  }
  console.error('\nSupabase CLI giriş: npx supabase login');
  process.exit(1);
}
