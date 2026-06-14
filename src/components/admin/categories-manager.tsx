'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '@/actions/admin';
import type { Database } from '@/types/supabase.generated';
import { asLocalizedRecord } from '@/lib/localized-json';

const LANGS = ['de', 'tr', 'en', 'az', 'ru', 'uk', 'ar'] as const;
type Lang = (typeof LANGS)[number];

type Category = Database['public']['Tables']['template_categories']['Row'];

interface CategoriesManagerProps {
  categories: Category[];
}

function emptyForm() {
  const form: Record<string, string> = { slug: '' };
  for (const lang of LANGS) {
    form[`name_${lang}`] = '';
    form[`description_${lang}`] = '';
  }
  return form;
}

export function CategoriesManager({ categories }: CategoriesManagerProps) {
  const t = useTranslations('admin.categories');
  const tCommon = useTranslations('common');
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>(emptyForm());

  const openCreateDialog = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEditDialog = (cat: Category) => {
    setEditingId(cat.id);
    const next = emptyForm();
    const name = asLocalizedRecord(cat.name);
    const description = asLocalizedRecord(cat.description);
    next.slug = cat.slug;
    for (const lang of LANGS) {
      next[`name_${lang}`] = name[lang] || '';
      next[`description_${lang}`] = description[lang] || '';
    }
    setForm(next);
    setDialogOpen(true);
  };

  const buildPayload = () => {
    const name: Record<string, string> = {};
    const description: Record<string, string> = {};
    for (const lang of LANGS) {
      const n = form[`name_${lang}`]?.trim();
      const d = form[`description_${lang}`]?.trim();
      if (n) name[lang] = n;
      if (d) description[lang] = d;
    }
    return { slug: form.slug, name, description };
  };

  const handleSave = () => {
    if (!form.slug || !form.name_de) {
      toast.error(t('slugRequired'));
      return;
    }
    const payload = buildPayload();
    startTransition(async () => {
      try {
        if (editingId) {
          await adminUpdateCategory(editingId, payload);
          toast.success(t('updated'));
        } else {
          await adminCreateCategory(payload);
          toast.success(t('created'));
        }
        setDialogOpen(false);
      } catch {
        toast.error(t('operationError'));
      }
    });
  };

  const handleDelete = () => {
    if (!deletingId) return;
    startTransition(async () => {
      try {
        await adminDeleteCategory(deletingId);
        toast.success(t('deleted'));
        setDeleteDialogOpen(false);
        setDeletingId(null);
      } catch {
        toast.error(t('deleteError'));
      }
    });
  };

  const langLabel = (lang: Lang) => {
    const key = `lang${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as 'langDe';
    try {
      return t(key as Parameters<typeof t>[0]);
    } catch {
      return lang.toUpperCase();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreateDialog}>
          <Plus className="size-4" data-icon="inline-start" />
          {t('newCategory')}
        </Button>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('slugColumn')}</TableHead>
              <TableHead>{t('germanColumn')}</TableHead>
              <TableHead>{t('turkishColumn')}</TableHead>
              <TableHead>{t('englishColumn')}</TableHead>
              <TableHead>{t('createdColumn')}</TableHead>
              <TableHead className="w-[100px]">{t('actionsColumn')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {t('empty')}
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => {
                const name = asLocalizedRecord(cat.name);
                return (
                <TableRow key={cat.id}>
                  <TableCell className="font-mono text-xs">{cat.slug}</TableCell>
                  <TableCell className="font-medium">{name.de || '—'}</TableCell>
                  <TableCell>{name.tr || '—'}</TableCell>
                  <TableCell>{name.en || '—'}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(cat.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEditDialog(cat)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => { setDeletingId(cat.id); setDeleteDialogOpen(true); }}>
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? t('editCategory') : t('createCategory')}</DialogTitle>
            <DialogDescription>{t('formDesc')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="slug">{t('slugLabel')}</Label>
              <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={t('slugPlaceholder')} className="font-mono" />
            </div>
            <Tabs defaultValue="de">
              <TabsList className="flex flex-wrap h-auto">
                {LANGS.map((lang) => (
                  <TabsTrigger key={lang} value={lang}>{langLabel(lang)}</TabsTrigger>
                ))}
              </TabsList>
              {LANGS.map((lang) => (
                <TabsContent key={lang} value={lang} className="mt-3 space-y-3">
                  <div className="grid gap-2">
                    <Label>{t('nameDe').replace('(DE)', `(${lang.toUpperCase()})`)}</Label>
                    <Input
                      value={form[`name_${lang}`] || ''}
                      onChange={(e) => setForm({ ...form, [`name_${lang}`]: e.target.value })}
                      placeholder={t('namePlaceholder')}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t('descDe').replace('(DE)', `(${lang.toUpperCase()})`)}</Label>
                    <Textarea
                      value={form[`description_${lang}`] || ''}
                      onChange={(e) => setForm({ ...form, [`description_${lang}`]: e.target.value })}
                      placeholder={t('descPlaceholder')}
                      rows={2}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={isPending || !form.slug || !form.name_de}>
              {isPending ? t('saving') : editingId ? t('update') : t('create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('deleteCategory')}</DialogTitle>
            <DialogDescription>{t('deleteConfirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>{tCommon('cancel')}</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? t('deleting') : tCommon('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
