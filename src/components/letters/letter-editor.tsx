'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateLetter } from '@/actions/letters';
import { Copy, Save, Check, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface LetterEditorProps {
  letterId: string;
  initialSubject: string;
  initialBody: string;
  onPreview?: () => void;
}

export function LetterEditor({
  letterId,
  initialSubject,
  initialBody,
  onPreview,
}: LetterEditorProps) {
  const t = useTranslations('letters');
  const tCommon = useTranslations('common');
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await updateLetter(letterId, { subject, german_body: body });
      toast.success(tCommon('save'));
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    toast.success(tCommon('copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('preview.edit')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject">{t('editor.subject')}</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t('editor.subjectPlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">{t('editor.body')}</Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
            placeholder={t('editor.bodyPlaceholder')}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSave} disabled={isPending}>
            <Save className="size-4" />
            {tCommon('save')}
          </Button>

          <Button variant="outline" onClick={handleCopy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {tCommon('copyToClipboard')}
          </Button>

          {onPreview && (
            <Button variant="secondary" onClick={onPreview}>
              <Eye className="size-4" />
              {t('preview.germanOriginal')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
