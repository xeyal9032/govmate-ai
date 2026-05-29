import type { SupabaseClient } from '@supabase/supabase-js';
import { validateFile, validateMagicBytes } from '@/lib/security/file-validation';
import { resolveServerFileMeta } from '@/lib/utils/upload-file';

export interface UploadLimits {
  plan: string;
  maxFileSizeMb: number;
  monthlyDocumentLimit: number;
}

export async function getUserUploadLimits(
  supabase: SupabaseClient,
  userId: string
): Promise<UploadLimits> {
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', userId)
    .single();

  const plan =
    (subscription?.status === 'active' ? subscription?.plan : 'free') || 'free';

  const { data: limits } = await supabase
    .from('plan_limits')
    .select('max_file_size_mb, monthly_document_limit')
    .eq('plan', plan)
    .single();

  return {
    plan,
    maxFileSizeMb: limits?.max_file_size_mb ?? 20,
    monthlyDocumentLimit: limits?.monthly_document_limit ?? 20,
  };
}

export async function assertMonthlyDocumentQuota(
  supabase: SupabaseClient,
  userId: string,
  monthlyDocumentLimit: number
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (monthlyDocumentLimit <= 0) return { ok: true };

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString());

  if ((count || 0) >= monthlyDocumentLimit) {
    return { ok: false, error: 'Monthly document limit reached' };
  }

  return { ok: true };
}

export function validateUploadMetadata(
  file: { type: string; size: number; name: string },
  maxSizeMb: number
) {
  const fileMeta = resolveServerFileMeta({ type: file.type, name: file.name });
  if ('error' in fileMeta) {
    return { ok: false as const, error: fileMeta.error };
  }

  const validation = validateFile(
    { type: fileMeta.type, size: file.size, name: file.name },
    maxSizeMb
  );

  if (!validation.valid) {
    return { ok: false as const, error: validation.error ?? 'Invalid file' };
  }

  return { ok: true as const, fileMeta };
}

export function buildStoragePath(userId: string, ext: string | undefined) {
  const safeExt = ext || 'bin';
  return `${userId}/${Date.now()}.${safeExt}`;
}

export function assertStoragePathOwnedByUser(storagePath: string, userId: string) {
  const prefix = `${userId}/`;
  if (!storagePath.startsWith(prefix) || storagePath.includes('..')) {
    return false;
  }
  return true;
}

/** İstemciden gelen magic byte dizisini doğrular */
export function validateMagicPrefix(
  magicPrefix: number[] | undefined,
  declaredType: string
): boolean {
  if (!magicPrefix || magicPrefix.length < 4) return false;

  const buffer = new Uint8Array(magicPrefix).buffer;
  return validateMagicBytes(buffer, declaredType);
}
