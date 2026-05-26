import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getDocument } from '@/actions/documents';
import { notFound } from 'next/navigation';
import { DocumentAnalysisView } from '@/components/documents/document-analysis-view';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Shield, Mail } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('documents.detail');
  const tLegal = await getTranslations('legal');

  let data;
  try {
    data = await getDocument(id);
  } catch {
    notFound();
  }

  const { document: doc, analysis, deadlines, letters } = data;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/documents">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{doc.title || doc.original_file_name}</h1>
          <div className="flex items-center gap-2 mt-1">
            {doc.authority_name && (
              <span className="text-sm text-muted-foreground">{doc.authority_name}</span>
            )}
            {doc.created_at && (
              <span className="text-sm text-muted-foreground">
                · {formatDate(doc.created_at, locale as 'tr')}
              </span>
            )}
          </div>
        </div>
        <Link href={`/dashboard/letters/new?documentId=${doc.id}`}>
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            {t('generateReply')}
          </Button>
        </Link>
      </div>

      {analysis ? (
        <DocumentAnalysisView analysis={analysis} deadlines={deadlines} />
      ) : doc.status === 'analyzing' ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
              <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
              <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
            </div>
            <p className="text-sm text-muted-foreground mt-4">{t('analyzing')}</p>
          </CardContent>
        </Card>
      ) : doc.status === 'failed' ? (
        <Alert variant="destructive">
          <AlertDescription>{t('analysisFailed')}</AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            {t('notAnalyzed')}
          </CardContent>
        </Card>
      )}

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>{tLegal('disclaimer')}</AlertDescription>
      </Alert>
    </div>
  );
}
