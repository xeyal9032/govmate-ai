import type { Json } from '@/types/supabase.generated';

/** Json alanını çok dilli metin kaydı olarak okur. */
export function asLocalizedRecord(value: Json | null | undefined): Record<string, string> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const result: Record<string, string> = {};
    for (const [key, val] of Object.entries(value)) {
      if (typeof val === 'string') result[key] = val;
    }
    return result;
  }
  return {};
}

/** Json alanını genel kayıt olarak okur (audit metadata vb.). */
export function asJsonRecord(value: Json | null | undefined): Record<string, unknown> | null {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

export function asVariableList(value: Json | null | undefined): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) =>
    item !== null && typeof item === 'object' && !Array.isArray(item)
      ? [item as Record<string, unknown>]
      : [],
  );
}
