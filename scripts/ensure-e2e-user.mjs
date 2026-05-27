#!/usr/bin/env node
/**
 * Supabase'de E2E test kullanıcısını oluşturur veya günceller.
 * .env.local içinde SUPABASE_SERVICE_ROLE_KEY gerekir.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadEnvLocal() {
  const envPath = path.join(root, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('.env.local bulunamadı');
    process.exit(1);
  }
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    const value = trimmed.slice(eq + 1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.E2E_USER_EMAIL || 'test@example.com';
const password = process.env.E2E_USER_PASSWORD || 'GovMate_E2E_Test_2026!';

if (!url || !serviceKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli');
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(targetEmail) {
  let page = 1;
  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase());
    if (found) return found;
    if (data.users.length < 200) break;
    page += 1;
  }
  return null;
}

async function main() {
  let user = await findUserByEmail(email);

  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'E2E Test Kullanıcı' },
    });
    if (error) throw error;
    user = data.user;
    console.log('Yeni E2E kullanıcısı oluşturuldu:', email);
  } else {
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      password,
      user_metadata: { full_name: 'E2E Test Kullanıcı' },
    });
    if (error) throw error;
    console.log('Mevcut E2E kullanıcısı güncellendi:', email);
  }

  const { error: profileError } = await admin
    .from('profiles')
    .update({
      full_name: 'E2E Test Kullanıcı',
      preferred_language: 'tr',
      role: 'user',
    })
    .eq('id', user.id);

  if (profileError) {
    console.warn('Profil güncelleme uyarısı:', profileError.message);
  }

  console.log('\n.env.local içinde şunların tanımlı olduğundan emin olun:');
  console.log(`E2E_USER_EMAIL=${email}`);
  console.log(`E2E_USER_PASSWORD=${password}`);
  console.log('\nArdından: npm run test:e2e');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
