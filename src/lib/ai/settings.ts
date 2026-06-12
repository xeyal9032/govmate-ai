import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import {
  DEFAULT_AI_MODEL,
  DEFAULT_TRANSLATION_MODEL,
  sanitizeAiModel,
} from '@/lib/ai/model-options';

const SETTINGS_KEYS = ['ai_model', 'ai_translation_model', 'ai_system_prompt'] as const;

type CachedSettings = {
  values: Record<string, string>;
  expiresAt: number;
};

let settingsCache: CachedSettings | null = null;
const CACHE_TTL_MS = 60_000;

async function fetchSettings(supabase: SupabaseClient): Promise<Record<string, string>> {
  const now = Date.now();
  if (settingsCache && settingsCache.expiresAt > now) {
    return settingsCache.values;
  }

  const { data } = await supabase
    .from('app_settings')
    .select('key, value')
    .in('key', [...SETTINGS_KEYS]);

  const values: Record<string, string> = {};
  for (const row of data ?? []) {
    values[row.key] = row.value;
  }

  settingsCache = { values, expiresAt: now + CACHE_TTL_MS };
  return values;
}

/** Test ve admin kaydı sonrası önbelleği temizler */
export function clearAiSettingsCache(): void {
  settingsCache = null;
}

async function resolveSupabase(supabase?: SupabaseClient): Promise<SupabaseClient> {
  return supabase ?? (await createClient());
}

export async function getAppAiSettings(supabase?: SupabaseClient) {
  const client = await resolveSupabase(supabase);
  const settings = await fetchSettings(client);
  return {
    analysisModel: sanitizeAiModel(settings.ai_model, DEFAULT_AI_MODEL),
    translationModel: sanitizeAiModel(settings.ai_translation_model, DEFAULT_TRANSLATION_MODEL),
    systemPrompt: settings.ai_system_prompt,
  };
}

export async function resolveAnalysisModel(supabase?: SupabaseClient): Promise<string> {
  const { analysisModel } = await getAppAiSettings(supabase);
  return analysisModel;
}

export async function resolveTranslationModel(supabase?: SupabaseClient): Promise<string> {
  const { translationModel } = await getAppAiSettings(supabase);
  return translationModel;
}
