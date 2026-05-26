const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'text/plain',
] as const;

type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

const MAGIC_BYTES: Record<string, number[][]> = {
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]], // .PNG
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF
};

export function validateMagicBytes(
  buffer: ArrayBuffer,
  declaredType: string
): boolean {
  const signatures = MAGIC_BYTES[declaredType];
  if (!signatures) return true; // text/plain vb. imza kontrolü gereksiz

  const bytes = new Uint8Array(buffer).slice(0, 8);
  return signatures.some((sig) =>
    sig.every((byte, i) => bytes[i] === byte)
  );
}

export function validateFile(
  file: { type: string; size: number; name: string },
  maxSizeMb: number
): FileValidationResult {
  if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedMimeType)) {
    return {
      valid: false,
      error: `Desteklenmeyen dosya formatı: ${file.type}. Desteklenen: PDF, JPG, PNG, WEBP, TXT`,
    };
  }

  const maxSizeBytes = maxSizeMb * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Dosya çok büyük. Maksimum: ${maxSizeMb} MB`,
    };
  }

  const extension = file.name.split('.').pop()?.toLowerCase();
  const validExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'txt'];
  if (!extension || !validExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Desteklenmeyen dosya uzantısı: .${extension}`,
    };
  }

  return { valid: true };
}

// Virus scan adapter interface — gələcəkdə ClamAV və ya başqa provider ilə tətbiq oluna bilər
export interface VirusScanProvider {
  scan(fileBuffer: Buffer): Promise<{ clean: boolean; threat?: string }>;
}

export class NoOpVirusScanner implements VirusScanProvider {
  async scan(): Promise<{ clean: boolean }> {
    return { clean: true };
  }
}

export function getVirusScanner(): VirusScanProvider {
  return new NoOpVirusScanner();
}
