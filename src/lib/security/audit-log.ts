import { createAdminClient } from '@/lib/supabase/admin';
import type { Json } from '@/types/database';

export async function writeAuditLog(params: {
  userId?: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Json;
}) {
  try {
    const supabase = createAdminClient();
    await supabase.from('audit_logs').insert({
      user_id: params.userId || null,
      action: params.action,
      ip_address: params.ipAddress || null,
      user_agent: params.userAgent || null,
      metadata: params.metadata || {},
    });
  } catch (error) {
    console.error('Audit log write error:', error);
  }
}
