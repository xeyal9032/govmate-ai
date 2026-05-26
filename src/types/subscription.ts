export interface SubscriptionWithPlan {
  subscription: import('./database').Subscription;
  planLimits: import('./database').PlanLimit;
}

export interface UsageSummary {
  documentsUsed: number;
  documentsLimit: number;
  lettersUsed: number;
  lettersLimit: number;
  currentPlan: import('./database').PlanType;
}

export interface CheckoutSessionRequest {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}
