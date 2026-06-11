import type { PlanLimit } from '@/types/database';

export interface PlanFeatureDescriptor {
  key: string;
  params?: Record<string, string | number>;
}

/** plan_limits tablosundan özellik listesi türetir */
export function getPlanFeatureDescriptors(limits: PlanLimit): PlanFeatureDescriptor[] {
  const items: PlanFeatureDescriptor[] = [];

  if (limits.monthly_document_limit === -1) {
    items.push({ key: 'unlimitedDocuments' });
  } else {
    items.push({
      key: 'documents',
      params: { count: limits.monthly_document_limit },
    });
  }

  items.push({
    key: 'maxUpload',
    params: { size: limits.max_file_size_mb },
  });

  if (limits.monthly_letter_limit === -1) {
    items.push({ key: 'unlimitedLetters' });
  } else {
    items.push({
      key: 'letters',
      params: { count: limits.monthly_letter_limit },
    });
  }

  if (limits.translation_enabled) {
    items.push({ key: 'translation' });
  }
  if (limits.reminders_enabled) {
    items.push({ key: 'reminders' });
  }
  if (limits.pdf_export_enabled) {
    items.push({ key: 'pdfExport' });
  }

  return items;
}
