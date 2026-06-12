#!/usr/bin/env node
/**
 * Supabase TypeScript tiplerini üretir.
 *
 * Kullanım:
 *   SUPABASE_PROJECT_ID=xxx npm run gen:types
 *
 * veya yerel Supabase CLI ile:
 *   npm run gen:types:local
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outFile = path.join(root, 'src', 'types', 'supabase.generated.ts');

const projectId = process.env.SUPABASE_PROJECT_ID;

if (!projectId) {
  console.error('Hata: SUPABASE_PROJECT_ID ortam değişkeni gerekli.');
  console.error('Supabase Dashboard → Project Settings → General → Reference ID');
  console.error('Örnek: SUPABASE_PROJECT_ID=abcdefgh npm run gen:types');
  process.exit(1);
}

const header = `/* eslint-disable */
/**
 * Otomatik üretilmiş dosya — elle düzenlemeyin.
 * Güncellemek için: SUPABASE_PROJECT_ID=xxx npm run gen:types
 */
`;

try {
  const types = execSync(
    `npx supabase gen types typescript --project-id ${projectId}`,
    { encoding: 'utf8', cwd: root, stdio: ['pipe', 'pipe', 'pipe'] }
  );
  fs.writeFileSync(outFile, `${header}${types}`, 'utf8');
  console.log(`Tipler yazıldı: ${path.relative(root, outFile)}`);
} catch (error) {
  console.error('Supabase CLI tip üretimi başarısız.');
  if (error instanceof Error && 'stderr' in error) {
    console.error(String((error as { stderr?: Buffer }).stderr ?? error.message));
  } else {
    console.error(error);
  }
  console.error('\nSupabase CLI giriş: npx supabase login');
  process.exit(1);
}
