'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import {
  adminCreateTemplate,
  adminUpdateTemplate,
  adminDeleteTemplate,
} from '@/actions/admin';
import type { Database, Json } from '@/types/supabase.generated';
import { asLocalizedRecord, asVariableList } from '@/lib/localized-json';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';

type Template = Database['public']['Tables']['templates']['Row'];
type CategoryOption = Pick<
  Database['public']['Tables']['template_categories']['Row'],
  'slug' | 'name'
>;

interface TemplatesTableProps {
  templates: Template[];
  categories: CategoryOption[];
}

const emptyForm = {
  title: '',
  category: '',
  description: '',
  content: '',
  variables: '[]',
  language: 'de',
};

export function TemplatesTable({ templates, categories }: TemplatesTableProps) {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = search
    ? templates.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase())
      )
    : templates;

  const openCreateDialog = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (template: Template) => {
    setEditingId(template.id);
    setForm({
      title: template.title,
      category: template.category,
      description: template.description || '',
      content: template.content,
      variables: JSON.stringify(asVariableList(template.variables), null, 2),
      language: template.language || 'de',
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        let parsedVars: Record<string, unknown>[] = [];
        try {
          parsedVars = JSON.parse(form.variables);
        } catch {
          toast.error(t('variablesJsonError'));
          return;
        }

        if (editingId) {
          await adminUpdateTemplate(editingId, {
            title: form.title,
            category: form.category,
            description: form.description,
            content: form.content,
            variables: parsedVars as Json,
            language: form.language,
          });
          toast.success(t('templateUpdated'));
        } else {
          await adminCreateTemplate({
            title: form.title,
            category: form.category,
            description: form.description,
            content: form.content,
            variables: parsedVars,
            language: form.language,
          });
          toast.success(t('templateCreated'));
        }
        setDialogOpen(false);
      } catch {
        toast.error(t('templateError'));
      }
    });
  };

  const handleDelete = () => {
    if (!deletingId) return;
    startTransition(async () => {
      try {
        await adminDeleteTemplate(deletingId);
        toast.success(t('templateDeleted'));
        setDeleteDialogOpen(false);
        setDeletingId(null);
      } catch {
        toast.error(t('deleteError'));
      }
    });
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    startTransition(async () => {
      try {
        await adminUpdateTemplate(id, { is_active: isActive });
        toast.success(isActive ? t('templateActivated') : t('templateDeactivated'));
      } catch {
        toast.error(t('statusUpdateError'));
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchTemplates')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="size-4" data-icon="inline-start" />
          {t('newTemplate')}
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('titleColumn')}</TableHead>
              <TableHead>{t('categoryColumn')}</TableHead>
              <TableHead>{t('statusColumn')}</TableHead>
              <TableHead>{t('createdColumn')}</TableHead>
              <TableHead className="w-[120px]">{t('actionsColumn')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {t('noTemplatesFound')}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{template.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={Boolean(template.is_active)}
                      onCheckedChange={(checked) =>
                        handleToggleActive(template.id, checked)
                      }
                      disabled={isPending}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(template.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => { setPreviewTemplate(template); setPreviewOpen(true); }}
                      >
                        <Eye className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(template)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setDeletingId(template.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
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

      {/* Oluştur / Düzenle dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? t('editTemplate') : t('createTemplate')}
            </DialogTitle>
            <DialogDescription>
              {t('templateFormDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title">{t('titleLabel')}</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={t('titleLabel')}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t('categoryLabel')}</Label>
              <Select value={form.category} onValueChange={(val) => val && setForm({ ...form, category: val })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('categoryLabel')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => {
                    const name = asLocalizedRecord(cat.name);
                    return (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {name.de || cat.slug} ({cat.slug})
                    </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>{t('languageLabel')}</Label>
              <Select value={form.language} onValueChange={(val) => val && setForm({ ...form, language: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="tr">Türkçe</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="az">Azərbaycan</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="uk">Українська</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t('descriptionLabel')}</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder={t('descriptionLabel')}
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">{t('contentLabel')}</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder={t('contentLabel')}
                rows={6}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="variables">{t('variablesLabel')}</Label>
              <Textarea
                id="variables"
                value={form.variables}
                onChange={(e) => setForm({ ...form, variables: e.target.value })}
                placeholder='[{"name": "ad", "type": "text"}]'
                rows={3}
                className="font-mono text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={isPending || !form.title || !form.category}>
              {isPending ? t('saving') : editingId ? t('update') : t('create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Önizleme dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.title}</DialogTitle>
            <DialogDescription>
              {previewTemplate?.category} · {previewTemplate?.language || 'de'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <pre className="whitespace-pre-wrap text-sm font-mono">{previewTemplate?.content}</pre>
            </div>
            {(() => {
              const vars = asVariableList(previewTemplate?.variables);
              if (vars.length === 0) return null;
              return (
              <div>
                <p className="text-sm font-medium mb-2">{t('variablesLabel')}</p>
                <div className="flex flex-wrap gap-2">
                  {vars.map((v, i) => (
                    <Badge key={i} variant="outline">{(v.name as string) || JSON.stringify(v)}</Badge>
                  ))}
                </div>
              </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Silme onay dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('deleteTemplate')}</DialogTitle>
            <DialogDescription>
              {t('deleteConfirm')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? t('deleting') : tCommon('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
