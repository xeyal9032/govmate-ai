'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { updateSubscriptionPlan } from '@/actions/admin';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Props {
  subscriptionId: string;
  currentPlan: string;
}

export function SubscriptionPlanChanger({ subscriptionId, currentPlan }: Props) {
  const t = useTranslations('admin');
  const [isPending, startTransition] = useTransition();

  const handleChange = (newPlan: string) => {
    if (newPlan === currentPlan) return;
    startTransition(async () => {
      try {
        await updateSubscriptionPlan(subscriptionId, newPlan);
        toast.success(t('planChanged'));
      } catch {
        toast.error(t('operationError'));
      }
    });
  };

  return (
    <Select value={currentPlan} onValueChange={(v) => v && handleChange(v)} disabled={isPending}>
      <SelectTrigger className="h-7 w-[110px]" size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">Free</SelectItem>
        <SelectItem value="pro">Pro</SelectItem>
        <SelectItem value="business">Business</SelectItem>
      </SelectContent>
    </Select>
  );
}
