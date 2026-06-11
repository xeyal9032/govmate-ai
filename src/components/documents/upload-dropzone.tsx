'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Upload, FileText, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import { normalizeUploadFile } from '@/lib/utils/upload-file';

interface UploadDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
  maxSizeMb?: number;
}

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'text/plain': ['.txt'],
};

export function UploadDropzone({ onFileSelect, selectedFile, disabled, maxSizeMb }: UploadDropzoneProps) {
  const t = useTranslations('documents.upload');
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // capture mobilde arka kamerayı tercih eder; JSX'te statik yazmıyoruz (Edge Tools uyumluluk uyarısı)
  useEffect(() => {
    const input = cameraInputRef.current;
    if (!input) return;
    input.setAttribute('capture', 'environment');
  }, []);

  const handleFile = useCallback((files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const normalized = normalizeUploadFile(file);
    if (!normalized.ok) {
      if (normalized.reason === 'heic') {
        toast.error(t('heicNotSupported'));
      } else {
        toast.error(t('unsupportedOnDevice'));
      }
      return;
    }
    onFileSelect(normalized.file);
  }, [onFileSelect, t]);

  const onDrop = useCallback((files: File[]) => {
    handleFile(files);
  }, [handleFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    disabled,
  });

  return (
    <div>
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors sm:p-12',
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm font-medium">{t('dropzone')}</p>
          <p className="text-xs text-muted-foreground mt-2">{t('supportedFormats')}</p>
          {maxSizeMb != null && (
            <p className="text-xs text-muted-foreground mt-1">
              {t('maxFileSizeHint', { size: maxSizeMb })}
            </p>
          )}
          <div
            className="mt-4 sm:hidden"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <label
              className={cn(
                'inline-flex cursor-pointer items-center justify-center rounded-md bg-secondary px-3 py-2 text-sm font-medium',
                disabled && 'pointer-events-none opacity-50'
              )}
            >
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={disabled}
                onChange={(e) => handleFile(e.target.files)}
              />
              <Camera className="mr-2 h-4 w-4" />
              {t('cameraCapture')}
            </label>
          </div>
        </div>
      ) : (
        <div className="border rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); onFileSelect(null); }}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
