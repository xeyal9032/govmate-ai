import { getLetter } from '@/actions/letters';
import { createClient } from '@/lib/supabase/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { LetterPreview } from '@/components/letters/letter-preview';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default async function LetterDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('letters');

  const letter = await getLetter(id);
  if (!letter) {
    redirect('/dashboard/letters');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from('profiles').select('full_name, address').eq('id', user.id).single()
    : { data: null };

  const disclaimerSplit = letter.translated_explanation?.split('\n\n---\n\n');
  const explanation = disclaimerSplit?.[0] || '';
  const disclaimer = disclaimerSplit?.[1] || '';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/letters">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{letter.subject || t('title')}</h1>
      </div>

      <LetterPreview
        germanBody={letter.german_body}
        translatedExplanation={explanation}
        subject={letter.subject}
        senderName={profile?.full_name || undefined}
        senderAddress={profile?.address || undefined}
        date={new Date(letter.created_at).toLocaleDateString('de-DE')}
      />

      {disclaimer && (
        <Alert>
          <AlertDescription className="text-sm text-muted-foreground">
            {disclaimer}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
