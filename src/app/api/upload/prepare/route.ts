import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimitOrNull, UPLOAD_RATE_LIMIT } from '@/lib/security/rate-limit-response';
import {
  assertMonthlyDocumentQuota,
  buildStoragePath,
  getUserUploadLimits,
  validateUploadMetadata,
} from '@/lib/upload/limits';

/** Dosya meta doğrulama — gövde taşınmaz (Vercel 4.5MB limiti bypass) */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimited = await rateLimitOrNull(`upload:${user.id}`, UPLOAD_RATE_LIMIT);
    if (rateLimited) return rateLimited;

    const body = await request.json();
    const fileName = String(body.fileName ?? '');
    const fileSize = Number(body.fileSize ?? 0);
    const fileType = String(body.fileType ?? '');
    const targetLanguage = String(body.targetLanguage ?? 'tr');

    if (!fileName || !fileSize || fileSize <= 0) {
      return NextResponse.json({ error: 'Invalid file metadata' }, { status: 400 });
    }

    const limits = await getUserUploadLimits(supabase, user.id);
    const quota = await assertMonthlyDocumentQuota(
      supabase,
      user.id,
      limits.monthlyDocumentLimit
    );
    if (!quota.ok) {
      return NextResponse.json({ error: quota.error }, { status: 403 });
    }

    const meta = validateUploadMetadata(
      { type: fileType, size: fileSize, name: fileName },
      limits.maxFileSizeMb
    );
    if (!meta.ok) {
      return NextResponse.json({ error: meta.error }, { status: 400 });
    }

    const storagePath = buildStoragePath(user.id, meta.fileMeta.ext);

    return NextResponse.json({
      storagePath,
      contentType: meta.fileMeta.type,
      targetLanguage,
      maxFileSizeMb: limits.maxFileSizeMb,
    });
  } catch (error) {
    console.error('Upload prepare error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
