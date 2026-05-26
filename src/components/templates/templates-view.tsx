'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { TemplateCard } from '@/components/templates/template-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LayoutGrid } from 'lucide-react';

interface TemplatesViewProps {
  templates: any[];
  categories: any[];
}

export function TemplatesView({ templates, categories }: TemplatesViewProps) {
  const t = useTranslations('templates');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered =
    activeCategory === 'all'
      ? templates
      : templates.filter((tmpl) => tmpl.category === activeCategory);

  function getCategoryLabel(slug: string): string {
    if (slug === 'all') return t('allCategories');
    try {
      return t(`categories.${slug}` as any);
    } catch {
      return slug;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LayoutGrid className="h-5 w-5 text-muted-foreground" />
        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger className="w-[280px]">
            <span>{getCategoryLabel(activeCategory)}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t('allCategories')}
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {getCategoryLabel(cat.slug)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filtered.length} {t('templateCount')}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {t('noTemplates')}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
