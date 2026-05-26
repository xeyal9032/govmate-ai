import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendDeadlineReminder } from '@/lib/email/send-reminder';
import type { Profile } from '@/types/database';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const admin = createAdminClient();

    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const { data: deadlines, error: fetchError } = await admin
      .from('deadlines')
      .select('*, profiles!inner(id, full_name, email, preferred_language)')
      .eq('status', 'open')
      .eq('reminder_enabled', true)
      .lte('deadline_date', threeDaysFromNow.toISOString().slice(0, 10))
      .gte('deadline_date', new Date().toISOString().slice(0, 10));

    if (fetchError) {
      console.error('Failed to fetch deadlines:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch deadlines' }, { status: 500 });
    }

    let sent = 0;
    let errors = 0;

    for (const deadline of deadlines || []) {
      try {
        const profile = (deadline as Record<string, unknown>).profiles as Profile | null;
        if (profile?.email) {
          await sendDeadlineReminder(profile, deadline);
          sent++;
        }
      } catch (error) {
        console.error(`Failed to send reminder for deadline ${deadline.id}:`, error);
        errors++;
      }
    }

    const today = new Date().toISOString().slice(0, 10);
    const { data: expiredData } = await admin
      .from('deadlines')
      .update({ status: 'expired' })
      .eq('status', 'open')
      .lt('deadline_date', today)
      .select('id');
    const expiredCount = expiredData?.length ?? 0;

    return NextResponse.json({
      reminders: { sent, errors },
      expired: expiredCount || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
