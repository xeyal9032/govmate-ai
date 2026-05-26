'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { updatePlanLimit } from '@/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

interface PlanLimit {
  id: string;
  plan: string;
  monthly_document_limit: number;
  monthly_letter_limit: number;
  max_file_size_mb: number;
  translation_enabled: boolean;
  reminders_enabled: boolean;
  pdf_export_enabled: boolean;
}

interface Props {
  plans: PlanLimit[];
}

export function PlanLimitsManager({ plans }: Props) {
  const t = useTranslations('admin');
  const [isPending, startTransition] = useTransition();
  const [editedPlans, setEditedPlans] = useState<Record<string, Partial<PlanLimit>>>({});

  const getValue = (plan: PlanLimit, field: keyof PlanLimit) => {
    return editedPlans[plan.id]?.[field] ?? plan[field];
  };

  const updateField = (planId: string, field: string, value: unknown) => {
    setEditedPlans(prev => ({
      ...prev,
      [planId]: { ...prev[planId], [field]: value },
    }));
  };

  const handleSave = (plan: PlanLimit) => {
    const changes = editedPlans[plan.id];
    if (!changes || Object.keys(changes).length === 0) return;
    startTransition(async () => {
      try {
        await updatePlanLimit(plan.id, changes);
        setEditedPlans(prev => { const n = { ...prev }; delete n[plan.id]; return n; });
        toast.success(t('planUpdated'));
      } catch {
        toast.error(t('operationError'));
      }
    });
  };

  const planLabels: Record<string, string> = {
    free: 'Free',
    pro: 'Pro',
    business: 'Business',
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.id}>
          <CardHeader>
            <CardTitle>{planLabels[plan.plan] || plan.plan}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>{t('monthlyDocLimit')}</Label>
              <Input
                type="number"
                value={getValue(plan, 'monthly_document_limit') as number}
                onChange={(e) => updateField(plan.id, 'monthly_document_limit', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t('monthlyLetterLimit')}</Label>
              <Input
                type="number"
                value={getValue(plan, 'monthly_letter_limit') as number}
                onChange={(e) => updateField(plan.id, 'monthly_letter_limit', parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">{t('unlimitedHint')}</p>
            </div>
            <div className="grid gap-2">
              <Label>{t('maxFileSizeMb')}</Label>
              <Input
                type="number"
                value={getValue(plan, 'max_file_size_mb') as number}
                onChange={(e) => updateField(plan.id, 'max_file_size_mb', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('translationEnabled')}</Label>
              <Switch
                checked={getValue(plan, 'translation_enabled') as boolean}
                onCheckedChange={(v) => updateField(plan.id, 'translation_enabled', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('remindersEnabled')}</Label>
              <Switch
                checked={getValue(plan, 'reminders_enabled') as boolean}
                onCheckedChange={(v) => updateField(plan.id, 'reminders_enabled', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('pdfExportEnabled')}</Label>
              <Switch
                checked={getValue(plan, 'pdf_export_enabled') as boolean}
                onCheckedChange={(v) => updateField(plan.id, 'pdf_export_enabled', v)}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => handleSave(plan)}
              disabled={isPending || !editedPlans[plan.id]}
            >
              <Save className="size-4" data-icon="inline-start" />
              {t('saveChanges')}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
