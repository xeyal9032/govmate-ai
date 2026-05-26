'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Subscription, PlanLimit } from '@/types/database';

interface PlanData {
  subscription: Subscription | null;
  limits: PlanLimit | null;
  loading: boolean;
}

export function usePlan(userId: string | undefined) {
  const [data, setData] = useState<PlanData>({
    subscription: null,
    limits: null,
    loading: true,
  });

  useEffect(() => {
    if (!userId) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const supabase = createClient();

    async function fetchPlan() {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId!)
        .single();

      if (sub) {
        const { data: limits } = await supabase
          .from('plan_limits')
          .select('*')
          .eq('plan', sub.plan)
          .single();

        setData({ subscription: sub, limits, loading: false });
      } else {
        setData({ subscription: null, limits: null, loading: false });
      }
    }

    fetchPlan();
  }, [userId]);

  return data;
}
