'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export interface PublicPlatformStats {
  totalUsers: number;
  totalDocuments: number;
  totalLetters: number;
}

/** Landing görüntüleme tabanı — gerçek kullanım üzerine eklenir. */
const DISPLAY_BASE = {
  totalUsers: 1_240,
  totalDocuments: 8_700,
  totalLetters: 3_150,
} as const;

/** Landing sayfası için platform istatistikleri (görüntüleme değerleri). */
export async function getPublicPlatformStats(): Promise<PublicPlatformStats> {
  try {
    const admin = createAdminClient();

    const { count: totalUsers } = await admin
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    const { count: totalDocuments } = await admin
      .from('documents')
      .select('*', { count: 'exact', head: true });
    const { count: totalLetters } = await admin
      .from('generated_letters')
      .select('*', { count: 'exact', head: true });

    const users = totalUsers ?? 0;
    const docs = totalDocuments ?? 0;
    const letters = totalLetters ?? 0;

    return {
      totalUsers: DISPLAY_BASE.totalUsers + users,
      totalDocuments: DISPLAY_BASE.totalDocuments + docs,
      totalLetters: DISPLAY_BASE.totalLetters + letters,
    };
  } catch {
    return {
      totalUsers: DISPLAY_BASE.totalUsers,
      totalDocuments: DISPLAY_BASE.totalDocuments,
      totalLetters: DISPLAY_BASE.totalLetters,
    };
  }
}
