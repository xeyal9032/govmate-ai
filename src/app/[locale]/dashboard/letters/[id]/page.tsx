import { getLetter } from '@/actions/letters';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { LetterPreview } from '@/components/letters/letter-preview';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
    redirect(`/${locale}/dashboard/letters`);
  }

  const disclaimerSplit = letter.translated_explanation?.split('\n\n---\n\n');
  const explanation = disclaimerSplit?.[0] || '';
  const disclaimer = disclaimerSplit?.[1] || '';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/dashboard/letters`}>
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
