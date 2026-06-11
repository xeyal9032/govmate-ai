'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { localeNames } from '@/lib/utils/language';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/store/app-store';
import { toast } from 'sonner';
import { Loader2, Trash2, Download, AlertTriangle } from 'lucide-react';
import { readApiError } from '@/lib/utils/api-response';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const { user, setUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
          console.error('Profile upsert error:', JSON.stringify(upsertError));
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

  const [exporting, setExporting] = useState(false);

  async function handleExportData() {
    setExporting(true);
    try {
      const res = await fetch('/api/pdf/export');
      if (!res.ok) {
        const message = await readApiError(res, t('exportFailed'));
        toast.error(message);
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

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' });
      if (!res.ok) {
        const message = await readApiError(res, t('deleteAccountFailed'));
        toast.error(message);
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

          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t('deleteAccount')}
          </Button>

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
