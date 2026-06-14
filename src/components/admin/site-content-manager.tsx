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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Database } from '@/types/supabase.generated';
import { asLocalizedRecord } from '@/lib/localized-json';

type SiteContent = Database['public']['Tables']['site_content']['Row'];

interface Props { content: SiteContent[]; }

const emptyForm = {
  slug: '', content_type: 'page',
  title_de: '', title_tr: '', title_en: '',
  body_de: '', body_tr: '', body_en: '',
  is_published: true,
  sort_order: 0,
};

export function SiteContentManager({ content }: Props) {
  const t = useTranslations('admin');
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };

  const openEdit = (item: SiteContent) => {
    const title = asLocalizedRecord(item.title);
    const body = asLocalizedRecord(item.body);
    setEditingId(item.id);
    setForm({
      slug: item.slug, content_type: item.content_type,
      title_de: title.de || '', title_tr: title.tr || '', title_en: title.en || '',
      body_de: body.de || '', body_tr: body.tr || '', body_en: body.en || '',
      is_published: item.is_published ?? true,
      sort_order: item.sort_order ?? 0,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const payload = {
      slug: form.slug, content_type: form.content_type,
      title: { de: form.title_de, tr: form.title_tr, en: form.title_en },
      body: { de: form.body_de, tr: form.body_tr, en: form.body_en },
      is_published: form.is_published,
      sort_order: form.sort_order,
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

  const handleTogglePublished = (id: string, published: boolean) => {
    startTransition(async () => {
      try {
        await updateSiteContent(id, { is_published: published });
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
          content.map((item) => {
            const title = asLocalizedRecord(item.title);
            const body = asLocalizedRecord(item.body);
            return (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  <CardTitle className="text-base">{title.de || item.slug}</CardTitle>
                  <Badge variant="secondary">{typeLabels[item.content_type] || item.content_type}</Badge>
                  <Badge variant="outline">{item.slug}</Badge>
                  <Badge variant={item.is_published ? 'default' : 'outline'}>
                    {item.is_published ? t('published') : t('draft')}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">{t('published')}</Label>
                    <Switch
                      checked={Boolean(item.is_published)}
                      onCheckedChange={(v) => handleTogglePublished(item.id, v)}
                      disabled={isPending}
                    />
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(item)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{body.de || body.tr || ''}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('sortOrder')}: {item.sort_order ?? 0}</p>
              </CardContent>
            </Card>
          );
          })
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
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>{t('sortOrder')}</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })} />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} />
                <Label>{t('published')}</Label>
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
