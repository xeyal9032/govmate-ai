'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocumentStatus } from '@/types/database';

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

const statusConfig: Record<
  DocumentStatus,
  { icon: typeof Upload; className: string }
> = {
  uploaded: {
    icon: Upload,
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  },
  analyzing: {
    icon: Loader2,
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
  completed: {
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  },
  failed: {
    icon: AlertCircle,
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  },
};

export function DocumentStatusBadge({ status, className }: DocumentStatusBadgeProps) {
  const t = useTranslations('documents.status');
  const config = statusConfig[status] || statusConfig.uploaded;
  const Icon = config.icon;

  return (
    <Badge
      variant="secondary"
      className={cn('gap-1 border-0', config.className, className)}
    >
      <Icon
        className={cn('size-3', status === 'analyzing' && 'animate-spin')}
      />
      {t(status)}
    </Badge>
  );
}
