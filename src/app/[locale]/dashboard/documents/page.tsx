import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getDocuments } from '@/actions/documents';
import { DocumentList } from '@/components/documents/document-list';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('documents');
  const documents = await getDocuments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Link href="/dashboard/upload">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            {t('upload.title')}
          </Button>
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-lg text-muted-foreground">{t('empty')}</p>
          <Link href="/dashboard/upload" className="mt-4">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              {t('upload.title')}
            </Button>
          </Link>
        </div>
      ) : (
        <DocumentList documents={documents} />
      )}
    </div>
  );
}
