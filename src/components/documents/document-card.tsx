'use client';

import { Link } from '@/i18n/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Image, File } from 'lucide-react';
import type { Document } from '@/types/database';
import { timeAgo, formatFileSize } from '@/lib/utils/format';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/lib/utils/language';

interface DocumentCardProps {
  document: Document;
}

const fileIcons: Record<string, typeof FileText> = {
  'application/pdf': FileText,
  'image/jpeg': Image,
  'image/png': Image,
  'image/webp': Image,
  'text/plain': File,
};

const statusColors: Record<string, string> = {
  uploaded: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  analyzing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export function DocumentCard({ document: doc }: DocumentCardProps) {
  const locale = useLocale() as Locale;
  const tDocs = useTranslations('documents');
  const Icon = fileIcons[doc.file_type] || FileText;

  return (
    <Link href={`/dashboard/documents/${doc.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{doc.title || doc.original_file_name}</p>
              {doc.authority_name && (
                <p className="text-xs text-muted-foreground mt-1">{doc.authority_name}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge className={statusColors[doc.status] || ''} variant="secondary">
                  {tDocs(`status.${doc.status}`)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(doc.file_size)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{timeAgo(doc.created_at, locale)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
