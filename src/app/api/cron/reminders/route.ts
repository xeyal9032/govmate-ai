import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendDeadlineReminder } from '@/lib/email/send-reminder';
import { isPlanFeatureEnabled, resolveActivePlan } from '@/lib/utils/plan-limits';
import type { PlanType, Profile } from '@/types/database';
import { toDeadline } from '@/lib/supabase-mappers';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const admin = createAdminClient();

    const { data: featureSetting } = await admin
      .from('app_settings')
      .select('value')
      .eq('key', 'feature_reminders')
      .single();

    if (featureSetting?.value === 'false') {
      return NextResponse.json({
        reminders: { sent: 0, errors: 0, skipped: 'feature_disabled' },
        expired: 0,
        timestamp: new Date().toISOString(),
      });
    }

    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const { data: deadlines, error: fetchError } = await admin
      .from('deadlines')
      .select('*, profiles!deadlines_user_id_fkey!inner(id, full_name, email, preferred_language)')
      .eq('status', 'open')
      .eq('reminder_enabled', true)
      .lte('deadline_date', threeDaysFromNow.toISOString().slice(0, 10))
      .gte('deadline_date', new Date().toISOString().slice(0, 10));

    if (fetchError) {
      console.error('Failed to fetch deadlines:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch deadlines' }, { status: 500 });
    }

    const userIds = [
      ...new Set(
        (deadlines || [])
          .map((d) => (d as { user_id?: string }).user_id)
          .filter((id): id is string => Boolean(id))
      ),
    ];

    const userPlanMap = new Map<string, PlanType>();
    if (userIds.length > 0) {
      const { data: subscriptions } = await admin
        .from('subscriptions')
        .select('user_id, plan, status')
        .in('user_id', userIds);

      for (const userId of userIds) {
        const sub = subscriptions?.find((s) => s.user_id === userId);
        userPlanMap.set(userId, resolveActivePlan(sub));
      }
    }

    let sent = 0;
    let errors = 0;
    let skippedPlan = 0;

    for (const deadline of deadlines || []) {
      try {
        const embeddedProfile = deadline.profiles;
        if (!embeddedProfile?.email) continue;

        const profile: Profile = {
          id: embeddedProfile.id,
          full_name: embeddedProfile.full_name,
          email: embeddedProfile.email,
          preferred_language: embeddedProfile.preferred_language,
          role: 'user',
          city: null,
          country_of_origin: null,
          address: null,
          avatar_url: null,
          created_at: '',
          updated_at: '',
        };

        const plan = userPlanMap.get(deadline.user_id) ?? 'free';
        const remindersAllowed = await isPlanFeatureEnabled(
          plan,
          'reminders_enabled',
          admin
        );
        if (!remindersAllowed) {
          skippedPlan++;
          continue;
        }

        await sendDeadlineReminder(profile, toDeadline(deadline));
        sent++;
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
      reminders: { sent, errors, skippedPlan },
      expired: expiredCount || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
