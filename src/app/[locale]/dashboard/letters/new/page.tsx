'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { LetterTypeSelector } from '@/components/letters/letter-type-selector';
import { LetterPreview } from '@/components/letters/letter-preview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { toast } from 'sonner';

type LetterType =
  | 'simple_reply'
  | 'formal_letter'
  | 'appointment_request'
  | 'document_submission'
  | 'deadline_extension'
  | 'clarification_request'
  | 'objection';

interface GeneratedLetter {
  subject: string;
  german_body: string;
  explanation_in_user_language: string;
  disclaimer: string;
}

interface DocumentData {
  id: string;
  title?: string;
  authority_name?: string;
  document_type?: string;
}

interface AnalysisData {
  summary_simple?: string;
  summary_detailed?: string;
  required_actions?: Array<{ action?: string }>;
}

export default function NewLetterPage() {
  const t = useTranslations('letters');
  const tCommon = useTranslations('common');
  const tErrors = useTranslations('errors');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();

  const documentId = searchParams.get('documentId');
  const documentType = searchParams.get('documentType');

  const [letterType, setLetterType] = useState<LetterType | null>(null);
  const [authorityName, setAuthorityName] = useState('');
  const [summary, setSummary] = useState('');
  const [action, setAction] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [prefilling, setPrefilling] = useState(!!documentId);
  const [result, setResult] = useState<GeneratedLetter | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) return;

    const fetchDocumentData = async () => {
      try {
        const supabase = createClient();
        const { data: doc } = await supabase
          .from('documents')
          .select('id, title, authority_name, document_type')
          .eq('id', documentId)
          .single();

        if (doc) {
          if (doc.authority_name) setAuthorityName(doc.authority_name);
        }

        const { data: analysis } = await supabase
          .from('document_analyses')
          .select('summary_simple, summary_detailed, required_actions')
          .eq('document_id', documentId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (analysis) {
          if (analysis.summary_simple) setSummary(analysis.summary_simple);
          const actions = analysis.required_actions as Array<{ action?: string }> | null;
          if (actions?.length) {
            setAction(actions.map((a) => a.action || '').filter(Boolean).join('\n'));
          }
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, address')
            .eq('id', user.id)
            .single();

          if (profile) {
            if (profile.full_name) setFullName(profile.full_name);
            if (profile.address) setAddress(profile.address);
          }
        }
      } catch {
        // Ön doldurma başarısız olursa devam et
      } finally {
        setPrefilling(false);
      }
    };

    fetchDocumentData();
  }, [documentId]);

  const canSubmit =
    letterType && authorityName.trim() && summary.trim() && action.trim() && fullName.trim();

  const toTitleCase = (str: string) =>
    str.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formattedName = toTitleCase(fullName);
      setFullName(formattedName);

      const response = await fetch('/api/ai/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: documentId || undefined,
          letterType,
          authorityName: authorityName.trim(),
          summary: summary.trim(),
          action: action.trim(),
          userProfile: {
            fullName: formattedName,
            address: address.trim() || undefined,
            customerNumber: customerNumber.trim() || undefined,
          },
          notes: notes.trim() || undefined,
          targetLanguage: locale,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${response.status})`);
      }

      const data = await response.json();
      if (!data.letter) {
        throw new Error('No letter data returned');
      }
      setResult(data.letter);
      toast.success(t('generate.success'));
    } catch (err) {
      const message = err instanceof Error ? err.message : tErrors('generic');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (prefilling) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/letters">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{t('generate.title')}</h1>
      </div>

      {!result ? (
        <div className="space-y-6">
          <LetterTypeSelector
            selected={letterType}
            onSelect={(type) => setLetterType(type as LetterType)}
          />

          <Card>
            <CardHeader>
              <CardTitle>{t('generate.details')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="authorityName">{t('generate.authority')}</Label>
                <Input
                  id="authorityName"
                  value={authorityName}
                  onChange={(e) => setAuthorityName(e.target.value)}
                  placeholder={t('generate.authorityPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">{t('generate.summary')}</Label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder={t('generate.summaryPlaceholder')}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">{t('generate.action')}</Label>
                <Textarea
                  id="action"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  placeholder={t('generate.actionPlaceholder')}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">{t('generate.notes')}</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('generate.notesPlaceholder')}
                  className="min-h-[60px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('generate.senderInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('generate.fullName')}</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('generate.fullNamePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerNumber">{t('generate.customerNumber')}</Label>
                  <Input
                    id="customerNumber"
                    value={customerNumber}
                    onChange={(e) => setCustomerNumber(e.target.value)}
                    placeholder={t('generate.customerNumberPlaceholder')}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">{t('generate.address')}</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t('generate.addressPlaceholder')}
                  className="min-h-[60px]"
                />
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!letterType && (
            <Alert>
              <AlertDescription>{t('generate.selectType')}</AlertDescription>
            </Alert>
          )}

          <Button
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {loading ? t('generate.generating') : t('generate.submit')}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <LetterPreview
            germanBody={result.german_body}
            translatedExplanation={result.explanation_in_user_language}
            subject={result.subject}
            senderName={fullName}
            senderAddress={address}
            recipientName={authorityName}
            date={new Date().toLocaleDateString('de-DE')}
          />

          {result.disclaimer && (
            <Alert>
              <AlertDescription className="text-sm text-muted-foreground">
                {result.disclaimer}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setResult(null)}>
              {t('generate.editForm')}
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard/letters')}>
              {t('generate.backToList')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
