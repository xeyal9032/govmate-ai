import { describe, expect, it } from 'vitest';
import { validateFile, validateMagicBytes } from './file-validation';

describe('validateFile', () => {
  it('izin verilen PDF dosyasını kabul eder', () => {
    const result = validateFile(
      { type: 'application/pdf', size: 1024, name: 'test.pdf' },
      10
    );
    expect(result.valid).toBe(true);
  });

  it('desteklenmeyen MIME reddeder', () => {
    const result = validateFile(
      { type: 'application/zip', size: 1024, name: 'archive.zip' },
      10
    );
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Desteklenmeyen');
  });

  it('boyut limitini aşan dosyayı reddeder', () => {
    const result = validateFile(
      { type: 'application/pdf', size: 11 * 1024 * 1024, name: 'big.pdf' },
      10
    );
    expect(result.valid).toBe(false);
    expect(result.error).toContain('büyük');
  });

  it('geçersiz uzantıyı reddeder', () => {
    const result = validateFile(
      { type: 'application/pdf', size: 1024, name: 'evil.exe' },
      10
    );
    expect(result.valid).toBe(false);
  });
});

describe('validateMagicBytes', () => {
  it('PDF magic bytes doğrular', () => {
    const buf = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]).buffer;
    expect(validateMagicBytes(buf, 'application/pdf')).toBe(true);
  });

  it('yanlış PDF imzasını reddeder', () => {
    const buf = new Uint8Array([0x00, 0x00, 0x00, 0x00]).buffer;
    expect(validateMagicBytes(buf, 'application/pdf')).toBe(false);
  });
});
