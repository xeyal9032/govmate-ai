import { describe, expect, it } from 'vitest';
import { normalizeUploadFile, resolveServerFileMeta } from './upload-file';

describe('normalizeUploadFile', () => {
  it('boş MIME + .jpeg uzantısında image/jpeg üretir', () => {
    const raw = new File([new Uint8Array([0xff, 0xd8, 0xff])], 'IMG_2555.jpeg', {
      type: '',
    });
    const result = normalizeUploadFile(raw);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.file.type).toBe('image/jpeg');
    }
  });

  it('HEIC dosyasını reddeder', () => {
    const raw = new File([new Uint8Array(10)], 'photo.heic', {
      type: 'image/heic',
    });
    expect(normalizeUploadFile(raw)).toEqual({ ok: false, reason: 'heic' });
  });
});

describe('resolveServerFileMeta', () => {
  it('sunucuda boş MIME için uzantıdan tip çıkarır', () => {
    const meta = resolveServerFileMeta({ type: '', name: 'scan.JPG' });
    expect('error' in meta).toBe(false);
    if (!('error' in meta)) {
      expect(meta.type).toBe('image/jpeg');
    }
  });
});
