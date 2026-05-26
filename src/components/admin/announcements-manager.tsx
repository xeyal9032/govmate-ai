'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { createAnnouncement, toggleAnnouncement, deleteAnnouncement } from '@/actions/admin';
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
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

interface Props { announcements: Announcement[]; }

const typeVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  info: 'default', warning: 'secondary', success: 'outline', maintenance: 'destructive',
};

export function AnnouncementsManager({ announcements }: Props) {
  const t = useTranslations('admin');
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [expiresAt, setExpiresAt] = useState('');

  const handleCreate = () => {
    startTransition(async () => {
      try {
        await createAnnouncement({
          title, message, type,
          expires_at: expiresAt || undefined,
        });
        toast.success(t('announcementCreated'));
        setDialogOpen(false);
        setTitle(''); setMessage(''); setType('info'); setExpiresAt('');
      } catch { toast.error(t('operationError')); }
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
        <Button onClick={() => setDialogOpen(true)}>
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
                  <Switch checked={a.is_active} onCheckedChange={(v) => handleToggle(a.id, v)} disabled={isPending} />
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
            <DialogTitle>{t('newAnnouncement')}</DialogTitle>
            <DialogDescription>{t('announcementFormDesc')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>{t('announcementTitleLabel')}</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>{t('announcementMessage')}</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>{t('announcementType')}</Label>
                <Select value={type} onValueChange={(v) => setType(v ?? 'info')}>
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
                <Input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreate} disabled={isPending || !title || !message}>
              {isPending ? t('saving') : t('create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
