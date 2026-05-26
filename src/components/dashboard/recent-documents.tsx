'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';
import type { Document } from '@/types/database';
import { timeAgo } from '@/lib/utils/format';
import { useLocale } from 'next-intl';
import type { Locale } from '@/lib/utils/language';

interface RecentDocumentsProps {
  documents: Document[];
}

export function RecentDocuments({ documents }: RecentDocumentsProps) {
  const t = useTranslations('dashboard');
  const tDocs = useTranslations('documents');
  const locale = useLocale() as Locale;

  const statusColors: Record<string, string> = {
    uploaded: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    analyzing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{t('recentDocuments')}</CardTitle>
        <Link href="/dashboard/documents">
          <Button variant="ghost" size="sm">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">{t('noDocuments')}</p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <Link key={doc.id} href={`/dashboard/documents/${doc.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {doc.title || doc.original_file_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doc.authority_name && `${doc.authority_name} · `}
                      {timeAgo(doc.created_at, locale)}
                    </p>
                  </div>
                  <Badge className={statusColors[doc.status] || ''} variant="secondary">
                    {tDocs(`status.${doc.status}`)}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
