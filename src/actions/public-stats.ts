'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export interface PublicPlatformStats {
  totalUsers: number;
  totalDocuments: number;
  totalLetters: number;
  isBeta: boolean;
}

/** Landing sayfası için anonim platform istatistikleri (yalnızca aggregate). */
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
      totalUsers: users,
      totalDocuments: docs,
      totalLetters: letters,
      isBeta: users < 10,
    };
  } catch {
    return {
      totalUsers: 0,
      totalDocuments: 0,
      totalLetters: 0,
      isBeta: true,
    };
  }
}
