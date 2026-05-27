'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { updateSubscriptionStatus } from '@/actions/admin';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Props {
  subscriptionId: string;
  currentStatus: string;
}

export function SubscriptionStatusChanger({ subscriptionId, currentStatus }: Props) {
  const t = useTranslations('admin');
  const [isPending, startTransition] = useTransition();

  const handleChange = (newStatus: string) => {
    if (newStatus === currentStatus) return;
    startTransition(async () => {
      try {
        await updateSubscriptionStatus(
          subscriptionId,
          newStatus as 'active' | 'inactive' | 'canceled' | 'past_due'
        );
        toast.success(t('statusUpdated'));
      } catch {
        toast.error(t('operationError'));
      }
    });
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={(v) => v && handleChange(v)}
      disabled={isPending}
    >
      <SelectTrigger className="h-7 w-[120px]" size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">{t('statusActive')}</SelectItem>
        <SelectItem value="inactive">{t('statusInactive')}</SelectItem>
        <SelectItem value="canceled">{t('statusCanceled')}</SelectItem>
        <SelectItem value="past_due">{t('statusPastDue')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
