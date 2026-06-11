import type { SupabaseClient } from '@supabase/supabase-js';
import { validateFile, validateMagicBytes } from '@/lib/security/file-validation';
import { resolveServerFileMeta } from '@/lib/utils/upload-file';
import { resolveActivePlan } from '@/lib/utils/plan-limits';
import { API_ERROR_CODES } from '@/lib/utils/api-error-codes';
import { countMonthlyDocuments } from '@/lib/utils/usage-counts';

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

  const plan = resolveActivePlan(subscription);

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
): Promise<
  | { ok: true }
  | { ok: false; error: string; errorCode: typeof API_ERROR_CODES.DOCUMENT_LIMIT }
> {
  if (monthlyDocumentLimit <= 0) return { ok: true };

  const count = await countMonthlyDocuments(supabase, userId);

  if (count >= monthlyDocumentLimit) {
    return {
      ok: false,
      error: 'Monthly document limit reached',
      errorCode: API_ERROR_CODES.DOCUMENT_LIMIT,
    };
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
