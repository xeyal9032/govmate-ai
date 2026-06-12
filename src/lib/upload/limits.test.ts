import { describe, expect, it } from 'vitest';
import {
  assertStoragePathOwnedByUser,
  buildStoragePath,
  validateMagicPrefix,
  validateUploadMetadata,
} from '@/lib/upload/limits';

describe('upload limits — path güvenliği', () => {
  it('kullanıcıya ait storage path kabul eder', () => {
    const userId = 'user-123';
    const path = buildStoragePath(userId, 'pdf');
    expect(assertStoragePathOwnedByUser(path, userId)).toBe(true);
  });

  it('başka kullanıcının path reddedilir', () => {
    expect(assertStoragePathOwnedByUser('other-user/file.pdf', 'user-123')).toBe(false);
  });

  it('path traversal reddedilir', () => {
    expect(assertStoragePathOwnedByUser('user-123/../admin/secret.pdf', 'user-123')).toBe(false);
  });
});

describe('validateUploadMetadata', () => {
  it('geçerli PDF kabul eder', () => {
    const result = validateUploadMetadata(
      { type: 'application/pdf', size: 1024, name: 'letter.pdf' },
      20
    );
    expect(result.ok).toBe(true);
  });

  it('desteklenmeyen tip reddedilir', () => {
    const result = validateUploadMetadata(
      { type: 'application/x-msdownload', size: 1024, name: 'virus.exe' },
      20
    );
    expect(result.ok).toBe(false);
  });
});

describe('validateMagicPrefix', () => {
  it('PDF magic byte doğrular', () => {
    const pdfMagic = [0x25, 0x50, 0x44, 0x46]; // %PDF
    expect(validateMagicPrefix(pdfMagic, 'application/pdf')).toBe(true);
  });

  it('kısa prefix reddedilir', () => {
    expect(validateMagicPrefix([0x25, 0x50], 'application/pdf')).toBe(false);
  });
});
