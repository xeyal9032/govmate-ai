'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Check, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ExtractedTextViewProps {
  text: string;
  sourceLanguage?: string | null;
  maxHeight?: string;
}

export function ExtractedTextView({
  text,
  sourceLanguage,
  maxHeight = '400px',
}: ExtractedTextViewProps) {
  const t = useTranslations('documents');
  const tCommon = useTranslations('common');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(tCommon('copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  if (!text) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="size-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">
            {t('noExtractedText')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="size-4" />
          {t('extractedText')}
          {sourceLanguage && (
            <span className="text-xs font-normal text-muted-foreground">
              ({sourceLanguage.toUpperCase()})
            </span>
          )}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {copied ? tCommon('copied') : tCommon('copy')}
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea style={{ maxHeight }} className="w-full">
          <pre className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap font-mono">
            {text}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
