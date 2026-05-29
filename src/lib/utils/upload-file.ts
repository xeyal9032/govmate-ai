const EXT_TO_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  txt: 'text/plain',
};

export type NormalizeUploadResult =
  | { ok: true; file: File }
  | { ok: false; reason: 'heic' | 'unknown_type' };

/** iOS / WhatsApp: boş MIME veya HEIC için dosyayı yüklemeden önce normalize eder */
export function normalizeUploadFile(file: File): NormalizeUploadResult {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const type = (file.type || '').toLowerCase();

  if (
    type === 'image/heic' ||
    type === 'image/heif' ||
    ext === 'heic' ||
    ext === 'heif'
  ) {
    return { ok: false, reason: 'heic' };
  }

  if (!type || type === 'application/octet-stream') {
    const inferred = EXT_TO_MIME[ext];
    if (!inferred) {
      return { ok: false, reason: 'unknown_type' };
    }
    return {
      ok: true,
      file: new File([file], file.name, {
        type: inferred,
        lastModified: file.lastModified,
      }),
    };
  }

  return { ok: true, file };
}

export function resolveServerFileMeta(file: { type: string; name: string }) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  let type = (file.type || '').toLowerCase();

  if (type === 'image/heic' || type === 'image/heif' || ext === 'heic' || ext === 'heif') {
    return { error: 'HEIC format is not supported. Please use JPG or PNG.' as const };
  }

  if (!type || type === 'application/octet-stream') {
    const inferred = EXT_TO_MIME[ext];
    if (inferred) type = inferred;
  }

  return { type, ext: ext || undefined };
}
