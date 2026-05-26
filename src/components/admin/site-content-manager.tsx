'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { updateSiteContent, createSiteContent, deleteSiteContent } from '@/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface SiteContent {
  id: string;
  slug: string;
  content_type: string;
  title: Record<string, string>;
  body: Record<string, string>;
  is_published: boolean;
  sort_order: number;
}

interface Props { content: SiteContent[]; }

const emptyForm = {
  slug: '', content_type: 'page',
  title_de: '', title_tr: '', title_en: '',
  body_de: '', body_tr: '', body_en: '',
};

export function SiteContentManager({ content }: Props) {
  const t = useTranslations('admin');
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };

  const openEdit = (item: SiteContent) => {
    setEditingId(item.id);
    setForm({
      slug: item.slug, content_type: item.content_type,
      title_de: item.title?.de || '', title_tr: item.title?.tr || '', title_en: item.title?.en || '',
      body_de: item.body?.de || '', body_tr: item.body?.tr || '', body_en: item.body?.en || '',
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const payload = {
      slug: form.slug, content_type: form.content_type,
      title: { de: form.title_de, tr: form.title_tr, en: form.title_en },
      body: { de: form.body_de, tr: form.body_tr, en: form.body_en },
    };
    startTransition(async () => {
      try {
        if (editingId) {
          await updateSiteContent(editingId, payload);
          toast.success(t('contentUpdated'));
        } else {
          await createSiteContent(payload);
          toast.success(t('contentCreated'));
        }
        setDialogOpen(false);
      } catch { toast.error(t('operationError')); }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteSiteContent(id);
        toast.success(t('contentDeleted'));
      } catch { toast.error(t('operationError')); }
    });
  };

  const typeLabels: Record<string, string> = { legal: 'Legal', pricing: 'Pricing', faq: 'FAQ', page: 'Page' };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="size-4" data-icon="inline-start" />
          {t('newContent')}
        </Button>
      </div>

      <div className="grid gap-4">
        {content.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{t('noData')}</p>
        ) : (
          content.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base">{item.title?.de || item.slug}</CardTitle>
                  <Badge variant="secondary">{typeLabels[item.content_type] || item.content_type}</Badge>
                  <Badge variant="outline">{item.slug}</Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(item)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.body?.de || item.body?.tr || ''}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? t('editContent') : t('newContent')}</DialogTitle>
            <DialogDescription>{t('siteContentFormDesc')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="disclaimer" className="font-mono" disabled={!!editingId} />
              </div>
              <div className="grid gap-2">
                <Label>{t('contentTypeLabel')}</Label>
                <Select value={form.content_type} onValueChange={(v) => v && setForm({ ...form, content_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="pricing">Pricing</SelectItem>
                    <SelectItem value="faq">FAQ</SelectItem>
                    <SelectItem value="page">Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Tabs defaultValue="de">
              <TabsList>
                <TabsTrigger value="de">DE</TabsTrigger>
                <TabsTrigger value="tr">TR</TabsTrigger>
                <TabsTrigger value="en">EN</TabsTrigger>
              </TabsList>
              <TabsContent value="de" className="mt-3 space-y-3">
                <div className="grid gap-2">
                  <Label>{t('contentTitle')} (DE)</Label>
                  <Input value={form.title_de} onChange={(e) => setForm({ ...form, title_de: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>{t('contentBody')} (DE)</Label>
                  <Textarea value={form.body_de} onChange={(e) => setForm({ ...form, body_de: e.target.value })} rows={8} />
                </div>
              </TabsContent>
              <TabsContent value="tr" className="mt-3 space-y-3">
                <div className="grid gap-2">
                  <Label>{t('contentTitle')} (TR)</Label>
                  <Input value={form.title_tr} onChange={(e) => setForm({ ...form, title_tr: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>{t('contentBody')} (TR)</Label>
                  <Textarea value={form.body_tr} onChange={(e) => setForm({ ...form, body_tr: e.target.value })} rows={8} />
                </div>
              </TabsContent>
              <TabsContent value="en" className="mt-3 space-y-3">
                <div className="grid gap-2">
                  <Label>{t('contentTitle')} (EN)</Label>
                  <Input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>{t('contentBody')} (EN)</Label>
                  <Textarea value={form.body_en} onChange={(e) => setForm({ ...form, body_en: e.target.value })} rows={8} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={isPending || !form.slug}>
              {isPending ? t('saving') : editingId ? t('update') : t('create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
