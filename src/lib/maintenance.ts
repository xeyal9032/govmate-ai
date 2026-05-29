import type { SupabaseClient } from '@supabase/supabase-js';

const CACHE_TTL_MS = 60_000;
let cache: { enabled: boolean; expiresAt: number } | null = null;

/** Bakım modu ayarını okur (60 sn bellek önbelleği) */
export async function isMaintenanceModeEnabled(
  supabase: SupabaseClient
): Promise<boolean> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.enabled;
  }

  const { data } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'maintenance_mode')
    .maybeSingle();

  const enabled = data?.value === 'true';
  cache = { enabled, expiresAt: now + CACHE_TTL_MS };
  return enabled;
}

export function clearMaintenanceCache(): void {
  cache = null;
}
