'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import {
  createAnnouncement,
  updateAnnouncement,
  toggleAnnouncement,
  deleteAnnouncement,
} from '@/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';

import type { Database } from '@/types/supabase.generated';

type Announcement = Database['public']['Tables']['announcements']['Row'];

interface Props { announcements: Announcement[]; }

const typeVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  info: 'default', warning: 'secondary', success: 'outline', maintenance: 'destructive',
};

const emptyForm = { title: '', message: '', type: 'info', expiresAt: '' };

export function AnnouncementsManager({ announcements }: Props) {
  const t = useTranslations('admin');
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditingId(a.id);
    setForm({
      title: a.title,
      message: a.message,
      type: a.type,
      expiresAt: a.expires_at
        ? new Date(a.expires_at).toISOString().slice(0, 16)
        : '',
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        const payload = {
          title: form.title,
          message: form.message,
          type: form.type,
          expires_at: form.expiresAt || undefined,
        };
        if (editingId) {
          await updateAnnouncement(editingId, {
            ...payload,
            expires_at: form.expiresAt || null,
          });
          toast.success(t('announcementUpdated'));
        } else {
          await createAnnouncement(payload);
          toast.success(t('announcementCreated'));
        }
        setDialogOpen(false);
      } catch {
        toast.error(t('operationError'));
      }
    });
  };

  const handleToggle = (id: string, active: boolean) => {
    startTransition(async () => {
      try { await toggleAnnouncement(id, active); } catch { toast.error(t('operationError')); }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteAnnouncement(id);
        toast.success(t('announcementDeleted'));
      } catch { toast.error(t('operationError')); }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="size-4" data-icon="inline-start" />
          {t('newAnnouncement')}
        </Button>
      </div>

      {announcements.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">{t('noAnnouncements')}</p>
      ) : (
        <div className="grid gap-4">
          {announcements.map((a) => (
            <Card key={a.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base">{a.title}</CardTitle>
                  <Badge variant={typeVariant[a.type] || 'outline'}>{a.type}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(a)} disabled={isPending}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Switch checked={Boolean(a.is_active)} onCheckedChange={(v) => handleToggle(a.id, v)} disabled={isPending} />
                  <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(a.id)} disabled={isPending}>
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{a.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(a.created_at).toLocaleDateString()}
                  {a.expires_at && ` · ${t('expiresAt')}: ${new Date(a.expires_at).toLocaleDateString()}`}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? t('editAnnouncement') : t('newAnnouncement')}</DialogTitle>
            <DialogDescription>{t('announcementFormDesc')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>{t('announcementTitleLabel')}</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>{t('announcementMessage')}</Label>
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>{t('announcementType')}</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v ?? 'info' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{t('expiresAt')}</Label>
                <Input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={isPending || !form.title || !form.message}>
              {isPending ? t('saving') : editingId ? t('update') : t('create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
