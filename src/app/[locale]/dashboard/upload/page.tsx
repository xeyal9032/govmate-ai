'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { UploadDropzone } from '@/components/documents/upload-dropzone';
import { useUpload } from '@/hooks/use-upload';
import { localeNames, type Locale } from '@/lib/utils/language';
import { Loader2, AlertCircle } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function UploadPage() {
  const t = useTranslations('documents.upload');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [targetLang, setTargetLang] = useState<string>(locale);
  const { uploading, analyzing, progress, error, uploadAndAnalyze } = useUpload();

  async function handleUpload() {
    if (!file) return;
    const result = await uploadAndAnalyze(file, targetLang);
    if (result?.documentId) {
      router.push(`/dashboard/documents/${result.documentId}`);
    }
  }

  const isProcessing = uploading || analyzing;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t('title')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <UploadDropzone
            onFileSelect={setFile}
            selectedFile={file}
            disabled={isProcessing}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('selectLanguage')}</label>
            <Select value={targetLang} onValueChange={(v) => { if (v) setTargetLang(v); }} disabled={isProcessing}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {localeNames[targetLang as Locale] ?? targetLang}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(localeNames).map(([code, name]) => (
                  <SelectItem key={code} value={code}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground text-center">
                {uploading ? t('uploading') : t('analyzing')}
              </p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="button"
            onClick={handleUpload}
            disabled={!file || isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('analyze')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
