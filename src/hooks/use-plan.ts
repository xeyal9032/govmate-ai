'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { resolveActivePlan } from '@/lib/utils/plan-limits';
import type { Subscription, PlanLimit } from '@/types/database';
import { toPlanLimit, toSubscription } from '@/lib/supabase-mappers';

interface PlanData {
  subscription: Subscription | null;
  limits: PlanLimit | null;
  activePlan: string;
  loading: boolean;
}

export function usePlan(userId: string | undefined) {
  const [data, setData] = useState<PlanData>({
    subscription: null,
    limits: null,
    activePlan: 'free',
    loading: Boolean(userId),
  });

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    async function fetchPlan() {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId!)
        .single();

      const activePlan = resolveActivePlan(sub);

      const { data: limits } = await supabase
        .from('plan_limits')
        .select('*')
        .eq('plan', activePlan)
        .single();

      setData({
        subscription: sub ? toSubscription(sub) : null,
        limits: limits ? toPlanLimit(limits) : null,
        activePlan,
        loading: false,
      });
    }

    fetchPlan();
  }, [userId]);

  return data;
}
