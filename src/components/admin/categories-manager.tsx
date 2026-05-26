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

interface Category {
  id: string;
  slug: string;
  name: Record<string, string>;
  description: Record<string, string>;
  created_at: string;
}

interface CategoriesManagerProps {
  categories: Category[];
}

const emptyForm = {
  slug: '',
  name_de: '', name_tr: '', name_en: '',
  description_de: '', description_tr: '', description_en: '',
};

export function CategoriesManager({ categories }: CategoriesManagerProps) {
  const t = useTranslations('admin.categories');
  const tCommon = useTranslations('common');
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreateDialog = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (cat: Category) => {
    setEditingId(cat.id);
    setForm({
      slug: cat.slug,
      name_de: cat.name?.de || '',
      name_tr: cat.name?.tr || '',
      name_en: cat.name?.en || '',
      description_de: cat.description?.de || '',
      description_tr: cat.description?.tr || '',
      description_en: cat.description?.en || '',
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.slug || !form.name_de) {
      toast.error(t('slugRequired'));
      return;
    }

    const payload = {
      slug: form.slug,
      name: { de: form.name_de, tr: form.name_tr, en: form.name_en },
      description: { de: form.description_de, tr: form.description_tr, en: form.description_en },
    };

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

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreateDialog}>
          <Plus className="size-4" data-icon="inline-start" />
          {t('newCategory')}
        </Button>
      </div>

      <div className="rounded-lg border">
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
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-mono text-xs">{cat.slug}</TableCell>
                  <TableCell className="font-medium">{cat.name?.de || '—'}</TableCell>
                  <TableCell>{cat.name?.tr || '—'}</TableCell>
                  <TableCell>{cat.name?.en || '—'}</TableCell>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? t('editCategory') : t('createCategory')}</DialogTitle>
            <DialogDescription>{t('formDesc')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="slug">{t('slugLabel')}</Label>
              <Input id="slug" value={form.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder={t('slugPlaceholder')} className="font-mono" />
            </div>
            <Tabs defaultValue="de">
              <TabsList>
                <TabsTrigger value="de">{t('langDe')}</TabsTrigger>
                <TabsTrigger value="tr">{t('langTr')}</TabsTrigger>
                <TabsTrigger value="en">{t('langEn')}</TabsTrigger>
              </TabsList>
              <TabsContent value="de" className="mt-3 space-y-3">
                <div className="grid gap-2">
                  <Label>{t('nameDe')}</Label>
                  <Input value={form.name_de} onChange={(e) => updateField('name_de', e.target.value)} placeholder={t('namePlaceholder')} />
                </div>
                <div className="grid gap-2">
                  <Label>{t('descDe')}</Label>
                  <Textarea value={form.description_de} onChange={(e) => updateField('description_de', e.target.value)} placeholder={t('descPlaceholder')} rows={2} />
                </div>
              </TabsContent>
              <TabsContent value="tr" className="mt-3 space-y-3">
                <div className="grid gap-2">
                  <Label>{t('nameTr')}</Label>
                  <Input value={form.name_tr} onChange={(e) => updateField('name_tr', e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>{t('descTr')}</Label>
                  <Textarea value={form.description_tr} onChange={(e) => updateField('description_tr', e.target.value)} rows={2} />
                </div>
              </TabsContent>
              <TabsContent value="en" className="mt-3 space-y-3">
                <div className="grid gap-2">
                  <Label>{t('nameEn')}</Label>
                  <Input value={form.name_en} onChange={(e) => updateField('name_en', e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>{t('descEn')}</Label>
                  <Textarea value={form.description_en} onChange={(e) => updateField('description_en', e.target.value)} rows={2} />
                </div>
              </TabsContent>
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
