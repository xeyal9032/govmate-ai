'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { localeNames } from '@/lib/utils/language';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/store/app-store';
import { deleteAllDocuments } from '@/actions/documents';
import { toast } from 'sonner';
import { Loader2, Trash2, Download, AlertTriangle } from 'lucide-react';
import { readApiErrorBody } from '@/lib/utils/api-response';
import { mapApiError } from '@/lib/utils/map-api-error';

const REMINDER_PREF_KEY = 'govmate_email_reminders';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tRoot = useTranslations();
  const { user, setUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDocsDialogOpen, setDeleteDocsDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingDocs, setDeletingDocs] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailReminders, setEmailReminders] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem(REMINDER_PREF_KEY);
    return stored === null ? true : stored === 'true';
  });

  async function handleSaveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      toast.error(t('profileUpdateFailed'));
      setLoading(false);
      return;
    }

    const updates = {
      full_name: formData.get('fullName') as string,
      address: (formData.get('address') as string) || null,
      city: formData.get('city') as string || null,
      country_of_origin: formData.get('country') as string || null,
      preferred_language: formData.get('language') as string,
    };

    const { error, status, statusText } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', authUser.id)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', JSON.stringify(error), 'status:', status, statusText);

      if (error.code === 'PGRST116' || status === 406) {
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: authUser.id,
            email: authUser.email || '',
            ...updates,
          });

        if (upsertError) {
          toast.error(t('profileUpdateFailed'));
        } else {
          toast.success(t('profileUpdated'));
          if (user) setUser({ ...user, ...updates });
        }
      } else {
        toast.error(t('profileUpdateFailed'));
      }
    } else {
      toast.success(t('profileUpdated'));
      if (user) {
        setUser({ ...user, ...updates });
      }
    }
    setLoading(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error(t('passwordTooShort'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t('passwordMismatch'));
      return;
    }

    setPasswordLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);

    if (error) {
      toast.error(t('passwordUpdateFailed'));
      return;
    }

    toast.success(t('passwordUpdated'));
    setNewPassword('');
    setConfirmPassword('');
  }

  function handleReminderChange(checked: boolean) {
    setEmailReminders(checked);
    localStorage.setItem(REMINDER_PREF_KEY, String(checked));
    toast.success(t('notificationsSaved'));
  }

  const [exporting, setExporting] = useState(false);

  async function handleExportData() {
    setExporting(true);
    try {
      const res = await fetch('/api/pdf/export');
      if (!res.ok) {
        const body = await readApiErrorBody(res, t('exportFailed'));
        toast.error(mapApiError(body, (key, values) => tRoot(key, values)));
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GovMate_Rapor_${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(t('dataDownloaded'));
    } catch {
      toast.error(t('exportFailed'));
    } finally {
      setExporting(false);
    }
  }

  async function handleDeleteAllDocuments() {
    setDeletingDocs(true);
    try {
      await deleteAllDocuments();
      toast.success(t('deleteAllDocumentsSuccess'));
      setDeleteDocsDialogOpen(false);
    } catch {
      toast.error(t('deleteAllDocumentsFailed'));
    } finally {
      setDeletingDocs(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' });
      if (!res.ok) {
        const body = await readApiErrorBody(res, t('deleteAccountFailed'));
        toast.error(body.error);
        return;
      }
      toast.success(t('deleteAccountSuccess'));
      window.location.assign('/api/auth/signout');
    } catch {
      toast.error(t('deleteAccountFailed'));
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t('title')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form key={user?.id || 'loading'} onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('fullName')}</Label>
              <Input id="fullName" name="fullName" defaultValue={user?.full_name || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">{t('address')}</Label>
              <Textarea
                id="address"
                name="address"
                defaultValue={user?.address || ''}
                placeholder={t('addressPlaceholder')}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('email')}</Label>
              <Input value={user?.email || ''} disabled />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">{t('city')}</Label>
                <Input id="city" name="city" defaultValue={user?.city || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">{t('countryOfOrigin')}</Label>
                <Input id="country" name="country" defaultValue={user?.country_of_origin || ''} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">{t('language')}</Label>
              <Select name="language" defaultValue={user?.preferred_language || 'tr'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(localeNames).map(([code, name]) => (
                    <SelectItem key={code} value={code}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('save')}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('notifications')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{t('emailReminders')}</p>
              <p className="text-xs text-muted-foreground">{t('emailRemindersDesc')}</p>
            </div>
            <Switch checked={emailReminders} onCheckedChange={handleReminderChange} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('changePassword')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t('newPassword')}</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('changePassword')}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>{t('security')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={handleExportData} disabled={exporting}>
            {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {t('exportData')}
          </Button>

          <Button variant="outline" onClick={() => setDeleteDocsDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t('deleteAllDocuments')}
          </Button>

          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t('deleteAccount')}
          </Button>

          <Dialog open={deleteDocsDialogOpen} onOpenChange={setDeleteDocsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('deleteAllDocuments')}</DialogTitle>
                <DialogDescription>{t('deleteAllDocumentsConfirm')}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDocsDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button variant="destructive" onClick={handleDeleteAllDocuments} disabled={deletingDocs}>
                  {deletingDocs && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('deleteAllDocuments')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('deleteAccount')}</DialogTitle>
                <DialogDescription>
                  {t('deleteWarning')}
                </DialogDescription>
              </DialogHeader>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {t('deleteConfirm')}
                </AlertDescription>
              </Alert>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
                  {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('deleteAccount')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

