import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { writeAuditLog } from '@/lib/security/audit-log';
import { rateLimitOrNull, UPLOAD_RATE_LIMIT } from '@/lib/security/rate-limit-response';
import {
  assertMonthlyDocumentQuota,
  assertStoragePathOwnedByUser,
  getUserUploadLimits,
  validateMagicPrefix,
  validateUploadMetadata,
} from '@/lib/upload/limits';

/** Supabase Storage yüklemesi sonrası DB kaydı oluşturur */
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
    const storagePath = String(body.storagePath ?? '');
    const fileName = String(body.fileName ?? '');
    const fileSize = Number(body.fileSize ?? 0);
    const fileType = String(body.fileType ?? '');
    const targetLanguage = String(body.targetLanguage ?? 'tr');
    const magicPrefix = Array.isArray(body.magicPrefix)
      ? (body.magicPrefix as number[])
      : undefined;

    if (!storagePath || !fileName || !fileSize) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (!assertStoragePathOwnedByUser(storagePath, user.id)) {
      return NextResponse.json({ error: 'Invalid storage path' }, { status: 400 });
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

    if (!validateMagicPrefix(magicPrefix, meta.fileMeta.type)) {
      return NextResponse.json(
        { error: 'File content does not match declared type' },
        { status: 400 }
      );
    }

    const folder = user.id;
    const fileBaseName = storagePath.split('/').pop() ?? '';
    const { data: listed, error: listError } = await supabase.storage
      .from('documents')
      .list(folder, { search: fileBaseName, limit: 1 });

    if (listError || !listed?.some((f) => f.name === fileBaseName)) {
      return NextResponse.json({ error: 'File not found in storage' }, { status: 400 });
    }

    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        title: fileName.replace(/\.[^/.]+$/, ''),
        original_file_name: fileName,
        file_path: storagePath,
        file_type: meta.fileMeta.type,
        file_size: fileSize,
        status: 'uploaded',
        target_language: targetLanguage,
      })
      .select('id')
      .single();

    if (dbError || !document) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    await writeAuditLog({
      userId: user.id,
      action: 'document_uploaded',
      metadata: { documentId: document.id, fileName, storagePath },
    });

    return NextResponse.json({ documentId: document.id });
  } catch (error) {
    console.error('Upload complete error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
