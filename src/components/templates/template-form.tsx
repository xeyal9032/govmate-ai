'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VariableForm } from '@/components/templates/variable-form';
import { Eye, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'date' | 'textarea';
  required?: boolean;
}

interface TemplateFormProps {
  templateId: string;
  templateTitle: string;
  templateBody: string;
  variables: TemplateVariable[];
  category?: string;
}

export function TemplateForm({
  templateId,
  templateTitle,
  templateBody,
  variables,
  category = '',
}: TemplateFormProps) {
  const t = useTranslations('templates');
  const tErrors = useTranslations('errors');
  const [preview, setPreview] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm({
    defaultValues: variables.reduce(
      (acc, v) => ({ ...acc, [v.key]: '' }),
      {} as Record<string, string>
    ),
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const hasDateField = variables.some(v => v.key === 'date');
    if (hasDateField) {
      form.setValue('date', today);
    }

    const fetchProfile = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, address')
          .eq('id', user.id)
          .single();

        if (profile) {
          if (profile.full_name && !form.getValues('full_name')) {
            form.setValue('full_name', profile.full_name);
          }
          if (profile.address && !form.getValues('address')) {
            form.setValue('address', profile.address);
          }
        }
      } catch {
        // Profil yüklenemezse sessizce devam et
      }
    };

    fetchProfile();
  }, [variables, form]);

  const generatePreview = async (data: Record<string, string>) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai/translate-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: data }),
      });

      let processedData = data;
      if (res.ok) {
        const json = await res.json();
        processedData = { ...data, ...json.fields };
      }

      let result = templateBody;
      for (const [key, value] of Object.entries(processedData)) {
        result = result.replace(
          new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
          value || `{{${key}}}`
        );
      }
      setPreview(result);
      setShowPreview(true);
    } catch {
      let result = templateBody;
      for (const [key, value] of Object.entries(data)) {
        result = result.replace(
          new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
          value || `{{${key}}}`
        );
      }
      setPreview(result);
      setShowPreview(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      const response = await fetch('/api/pdf/template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          content: preview,
          title: templateTitle,
        }),
      });

      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${templateTitle.replace(/\s+/g, '_')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error(tErrors('pdfFailed'));
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{templateTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(generatePreview)}
            className="space-y-4"
          >
            <VariableForm variables={variables} form={form} category={category} />

            <div className="flex gap-2">
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Eye className="size-4" />
                )}
                {isProcessing ? t('processing') : t('preview')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>{t('preview')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-4 font-mono text-sm whitespace-pre-wrap">
              {preview}
            </div>
            <Button onClick={handleExportPdf}>
              <Download className="size-4" />
              {t('downloadPdf')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
