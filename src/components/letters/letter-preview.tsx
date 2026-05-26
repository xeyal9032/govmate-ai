'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Download } from 'lucide-react';
import { toast } from 'sonner';

interface LetterPreviewProps {
  germanBody: string;
  translatedExplanation?: string;
  subject?: string;
  senderName?: string;
  senderAddress?: string;
  recipientName?: string;
  recipientAddress?: string;
  date?: string;
}

export function LetterPreview({
  germanBody,
  translatedExplanation,
  subject,
  senderName,
  senderAddress,
  recipientName,
  recipientAddress,
  date,
}: LetterPreviewProps) {
  const t = useTranslations('letters');
  const tCommon = useTranslations('common');
  const tErrors = useTranslations('errors');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(germanBody);
    setCopied(true);
    toast.success(tCommon('copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch('/api/pdf/letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          germanBody,
          subject,
          senderName,
          senderAddress,
          recipientName,
          recipientAddress,
          date,
        }),
      });

      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `brief_${subject?.replace(/\s+/g, '_') || 'letter'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error(tErrors('pdfFailed'));
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Almanca orijinal panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-base">🇩🇪</span>
            {t('preview.germanOriginal')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/30 p-4 font-mono text-sm whitespace-pre-wrap">
            {senderName && (
              <div className="mb-4">
                <p className="font-medium">{senderName}</p>
                {senderAddress && <p>{senderAddress}</p>}
              </div>
            )}
            {recipientName && (
              <div className="mb-4">
                <p>{recipientName}</p>
                {recipientAddress && <p>{recipientAddress}</p>}
              </div>
            )}
            {date && <p className="mb-2 text-right">{date}</p>}
            {subject && <p className="mb-4 font-bold">Betreff: {subject}</p>}
            <p>{germanBody}</p>
          </div>
        </CardContent>
      </Card>

      {/* İstifadəçi dilində izah paneli */}
      {translatedExplanation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-base">💬</span>
              {t('preview.translation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/30 p-4 text-sm whitespace-pre-wrap leading-relaxed">
              {translatedExplanation}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aksiya butonları */}
      <div className="flex flex-wrap gap-2 lg:col-span-2">
        <Button variant="outline" onClick={handleCopy}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {t('preview.copyText')}
        </Button>
        <Button onClick={handleDownloadPdf}>
          <Download className="size-4" />
          {t('preview.downloadPdf')}
        </Button>
      </div>
    </div>
  );
}
