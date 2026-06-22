import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isMaintenanceModeEnabled, clearMaintenanceCache } from '@/lib/maintenance';
import type { SupabaseClient } from '@supabase/supabase-js';

function mockSupabase(value: string | null) {
  const maybeSingle = vi.fn().mockResolvedValue({ data: value ? { value } : null });
  const eq = vi.fn().mockReturnValue({ maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  const from = vi.fn().mockReturnValue({ select });
  return { client: { from } as unknown as SupabaseClient, maybeSingle };
}

describe('isMaintenanceModeEnabled', () => {
  beforeEach(() => {
    clearMaintenanceCache();
  });

  it('maintenance_mode true ise true döner', async () => {
    const { client } = mockSupabase('true');
    await expect(isMaintenanceModeEnabled(client)).resolves.toBe(true);
  });

  it('maintenance_mode false veya yoksa false döner', async () => {
    const { client } = mockSupabase('false');
    await expect(isMaintenanceModeEnabled(client)).resolves.toBe(false);
  });

  it('60 sn önbellek — ikinci çağrıda DB sorgusu tekrarlanmaz', async () => {
    const { client, maybeSingle } = mockSupabase('true');
    await isMaintenanceModeEnabled(client);
    await isMaintenanceModeEnabled(client);
    expect(maybeSingle).toHaveBeenCalledTimes(1);
  });
});
