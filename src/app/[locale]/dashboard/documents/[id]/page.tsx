import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getDocument } from '@/actions/documents';
import { notFound } from 'next/navigation';
import { DocumentAnalysisView } from '@/components/documents/document-analysis-view';
import { DocumentRetryAnalysis } from '@/components/documents/document-retry-analysis';
import { DocumentDeleteButton } from '@/components/documents/document-delete-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
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

  const { document: doc, analysis, deadlines } = data;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-2 sm:flex-1">
          <Link href="/dashboard/documents" className="shrink-0">
            <Button variant="ghost" size="icon" className="touch-target">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold break-words sm:text-2xl">
              {doc.title || doc.original_file_name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              {doc.authority_name && <span>{doc.authority_name}</span>}
              {doc.created_at && (
                <span>
                  {doc.authority_name ? '· ' : ''}
                  {formatDate(doc.created_at, locale as 'tr')}
                </span>
              )}
            </div>
          </div>
        </div>
        <DocumentDeleteButton documentId={doc.id} redirectAfter />
      </div>

      {analysis ? (
        <DocumentAnalysisView
          analysis={analysis}
          deadlines={deadlines}
          documentId={doc.id}
          authorityName={doc.authority_name}
        />
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
        <DocumentRetryAnalysis
          documentId={doc.id}
          targetLanguage={doc.target_language || locale}
        />
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
