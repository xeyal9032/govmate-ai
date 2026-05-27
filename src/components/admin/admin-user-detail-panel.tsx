'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import {
  updateUserRole,
  updateUserProfile,
  updateSubscriptionPlan,
  updateSubscriptionStatus,
} from '@/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Props {
  userId: string;
  initialFullName: string;
  initialAddress: string;
  initialRole: string;
  subscriptionId: string | null;
  initialPlan: string;
  initialStatus: string;
  isAdmin: boolean;
}

export function AdminUserDetailPanel({
  userId,
  initialFullName,
  initialAddress,
  initialRole,
  subscriptionId,
  initialPlan,
  initialStatus,
  isAdmin,
}: Props) {
  const t = useTranslations('admin');
  const [isPending, startTransition] = useTransition();
  const [fullName, setFullName] = useState(initialFullName);
  const [address, setAddress] = useState(initialAddress);
  const [role, setRole] = useState(initialRole);
  const [plan, setPlan] = useState(initialPlan);
  const [status, setStatus] = useState(initialStatus);

  const saveProfile = () => {
    if (!isAdmin) return;
    startTransition(async () => {
      try {
        await updateUserProfile(userId, { full_name: fullName, address });
        toast.success(t('profileUpdated'));
      } catch {
        toast.error(t('operationError'));
      }
    });
  };

  const saveRole = (newRole: string) => {
    if (!isAdmin) return;
    setRole(newRole);
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole as 'user' | 'admin' | 'support');
        toast.success(t('roleUpdated'));
      } catch {
        toast.error(t('operationError'));
      }
    });
  };

  const savePlan = (newPlan: string) => {
    if (!isAdmin || !subscriptionId) return;
    setPlan(newPlan);
    startTransition(async () => {
      try {
        await updateSubscriptionPlan(subscriptionId, newPlan);
        toast.success(t('planChanged'));
      } catch {
        toast.error(t('operationError'));
      }
    });
  };

  const saveStatus = (newStatus: string) => {
    if (!isAdmin || !subscriptionId) return;
    setStatus(newStatus);
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
    <Card>
      <CardHeader>
        <CardTitle>{t('userSettings')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t('fullNameLabel')}</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isAdmin || isPending}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('roleColumn')}</Label>
            <Select
              value={role}
              onValueChange={(v) => v && saveRole(v)}
              disabled={!isAdmin || isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">{t('roles.user')}</SelectItem>
                <SelectItem value="admin">{t('roles.admin')}</SelectItem>
                <SelectItem value="support">{t('roles.support')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('addressLabel')}</Label>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={!isAdmin || isPending}
            rows={2}
          />
        </div>

        {isAdmin && (
          <Button onClick={saveProfile} disabled={isPending}>
            {isPending ? t('saving') : t('saveProfile')}
          </Button>
        )}

        {subscriptionId && isAdmin && (
          <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
            <div className="space-y-2">
              <Label>{t('planColumn')}</Label>
              <Select
                value={plan}
                onValueChange={(v) => v && savePlan(v)}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('subscriptionStatus')}</Label>
              <Select
                value={status}
                onValueChange={(v) => v && saveStatus(v)}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('statusActive')}</SelectItem>
                  <SelectItem value="inactive">{t('statusInactive')}</SelectItem>
                  <SelectItem value="canceled">{t('statusCanceled')}</SelectItem>
                  <SelectItem value="past_due">{t('statusPastDue')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
