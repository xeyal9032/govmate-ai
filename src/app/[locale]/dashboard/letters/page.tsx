import { getLetters } from '@/actions/letters';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Mail, Globe, Calendar, Plus } from 'lucide-react';
import Link from 'next/link';
import type { GeneratedLetter, LetterType } from '@/types/database';

type LetterListItem = GeneratedLetter & {
  documents: { title: string; authority_name: string | null } | null;
};

export default async function LettersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('letters');
  const tCommon = await getTranslations('common');
  const letters = (await getLetters()) as LetterListItem[];

  const letterTypeLabel = (type: LetterType) => t(`generate.types.${type}`);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Link href={`/${locale}/dashboard/letters/new`}>
          <Button className="gap-2">
            <Plus className="size-4" />
            {t('generate.title')}
          </Button>
        </Link>
      </div>

      {letters.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="size-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">{tCommon('noResults')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {letters.map((letter) => (
            <Link key={letter.id} href={`/${locale}/dashboard/letters/${letter.id}`}>
            <Card className="hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2">
                    {letter.subject || t('generate.title')}
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0">
                    {letterTypeLabel(letter.letter_type)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <span>{format(new Date(letter.created_at), 'dd.MM.yyyy')}</span>
                </div>
                {letter.target_language && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="size-3.5" />
                    <span>{letter.target_language}</span>
                  </div>
                )}
                {letter.documents && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {letter.documents.authority_name}
                  </p>
                )}
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
