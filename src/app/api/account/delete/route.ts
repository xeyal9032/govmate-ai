import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { writeAuditLog } from '@/lib/security/audit-log';

/** Oturum açmış kullanıcının kendi hesabını kalıcı olarak siler */
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin') {
      return NextResponse.json(
        { error: 'Admin accounts cannot be self-deleted. Contact another administrator.' },
        { status: 403 }
      );
    }

    await writeAuditLog({
      userId: user.id,
      action: 'account_self_delete',
      metadata: { email: user.email ?? null },
    });

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);

    if (error) {
      console.error('Account delete failed:', error);
      return NextResponse.json({ error: 'Account deletion failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Account delete error:', error);
    return NextResponse.json({ error: 'Account deletion failed' }, { status: 500 });
  }
}
