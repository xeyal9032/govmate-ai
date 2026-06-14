'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
import { UsageBanner } from '@/components/billing/usage-banner';
import { readApiErrorBody } from '@/lib/utils/api-response';
import { mapApiError } from '@/lib/utils/map-api-error';
import { toast } from 'sonner';
import { getRecommendedLetterType, isLetterType } from '@/lib/letters/recommended-letter-type';
import type { AnalysisResult } from '@/types/database';

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

export default function NewLetterPage() {
  const t = useTranslations('letters');
  const tRoot = useTranslations();
  const tCommon = useTranslations('common');
  const tErrors = useTranslations('errors');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();

  const documentId = searchParams.get('documentId');
  const letterTypeParam = searchParams.get('letterType');
  const autoGenerate = searchParams.get('auto') === '1';

  const [letterType, setLetterType] = useState<LetterType | null>(
    letterTypeParam && isLetterType(letterTypeParam) ? letterTypeParam : null
  );
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
  const autoStarted = useRef(false);

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

        const { data: analysisRow } = await supabase
          .from('document_analyses')
          .select('summary_simple, summary_detailed, required_actions, analysis_json')
          .eq('document_id', documentId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        const analysisJson = analysisRow?.analysis_json as AnalysisResult | null;

        if (doc?.authority_name) {
          setAuthorityName(doc.authority_name);
        } else if (analysisJson?.sender_authority) {
          setAuthorityName(analysisJson.sender_authority);
        }

        if (analysisRow) {
          if (analysisRow.summary_simple) setSummary(analysisRow.summary_simple);
          const actions = analysisRow.required_actions as Array<{ action?: string }> | null;
          if (actions?.length) {
            setAction(actions.map((a) => a.action || '').filter(Boolean).join('\n'));
          } else if (analysisJson?.required_actions?.length) {
            setAction(
              analysisJson.required_actions
                .map((a) => a.action)
                .filter(Boolean)
                .join('\n')
            );
          } else if (analysisRow.summary_simple) {
            // Otomatik mektup için minimum aksiyon metni
            setAction(analysisRow.summary_simple);
          }
        }

        if (!letterTypeParam && analysisJson) {
          const suggested = getRecommendedLetterType(analysisJson);
          if (suggested) setLetterType(suggested);
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
  }, [documentId, letterTypeParam]);

  const toTitleCase = (str: string) =>
    str.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

  const canSubmit = Boolean(
    letterType && authorityName.trim() && summary.trim() && action.trim() && fullName.trim()
  );

  const handleSubmit = useCallback(async () => {
    if (!letterType || !authorityName.trim() || !summary.trim() || !action.trim() || !fullName.trim()) {
      return;
    }

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
        const body = await readApiErrorBody(response, tRoot('errors.generic'));
        throw new Error(mapApiError(body, (key, values) => tRoot(key, values)));
      }

      const data = await response.json();
      if (!data.letter) {
        throw new Error('No letter data returned');
      }
      setResult(data.letter);
      toast.success(t('generate.success'));

      if (data.letterId) {
        router.push(`/dashboard/letters/${data.letterId}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : tErrors('generic');
      setError(message);
      toast.error(message);
      // Otomatik deneme başarısızsa sonsuz döngüyü önle; kullanıcı formdan tekrar dener
      autoStarted.current = true;
    } finally {
      setLoading(false);
    }
  }, [
    letterType,
    authorityName,
    summary,
    action,
    fullName,
    address,
    customerNumber,
    notes,
    documentId,
    locale,
    router,
    t,
    tRoot,
    tErrors,
  ]);

  useEffect(() => {
    if (!autoGenerate || prefilling || autoStarted.current || result) return;
    if (!canSubmit || loading) return;
    autoStarted.current = true;
    const timer = window.setTimeout(() => {
      void handleSubmit();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [autoGenerate, prefilling, canSubmit, loading, result, handleSubmit]);

  if (prefilling || (autoGenerate && loading && !result)) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {autoGenerate ? t('generate.autoFromDocument') : tCommon('loading')}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex min-w-0 items-center gap-2">
        <Link href="/dashboard/letters" className="shrink-0">
          <Button variant="ghost" size="icon" className="touch-target">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold sm:text-2xl">{t('generate.title')}</h1>
      </div>

      <UsageBanner variant="letters" />

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

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="h-11 w-full sm:w-auto" onClick={() => setResult(null)}>
              {t('generate.editForm')}
            </Button>
            <Button
              variant="outline"
              className="h-11 w-full sm:w-auto"
              onClick={() => router.push('/dashboard/letters')}
            >
              {t('generate.backToList')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
