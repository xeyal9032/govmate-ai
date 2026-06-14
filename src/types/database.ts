/**
 * Uygulama domain tipleri.
 * Supabase şema tipleri için: npm run gen:types → src/types/supabase.generated.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = 'user' | 'admin' | 'support';
export type DocumentStatus = 'uploaded' | 'analyzing' | 'completed' | 'failed';
export type DocumentType = 'jobcenter_letter' | 'auslaenderbehoerde_letter' | 'tax_letter' | 'health_insurance' | 'housing' | 'insurance' | 'school' | 'unknown';
export type Urgency = 'low' | 'medium' | 'high' | 'critical';
export type LetterType = 'simple_reply' | 'formal_letter' | 'appointment_request' | 'document_submission' | 'deadline_extension' | 'clarification_request' | 'objection';
export type ResponseType = 'no_response_needed' | 'simple_reply' | 'formal_letter' | 'appointment_request' | 'objection' | 'clarification_request';
export type PlanType = 'free' | 'pro' | 'business';
export type SubscriptionStatus = 'active' | 'inactive' | 'canceled' | 'past_due';
export type DeadlineStatus = 'open' | 'done' | 'expired';
export type FeedbackType = 'bug' | 'feature' | 'general' | 'complaint';
export type FeedbackStatus = 'new' | 'reviewed' | 'resolved' | 'dismissed';
export type TranslationMode = 'simple' | 'formal' | 'a2_level';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  preferred_language: string;
  role: UserRole;
  city: string | null;
  country_of_origin: string | null;
  address: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: PlanType;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlanLimit {
  id: string;
  plan: PlanType;
  monthly_document_limit: number;
  monthly_letter_limit: number;
  max_file_size_mb: number;
  translation_enabled: boolean;
  reminders_enabled: boolean;
  pdf_export_enabled: boolean;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  title: string | null;
  original_file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  status: DocumentStatus;
  source_language: string | null;
  target_language: string | null;
  document_type: DocumentType | null;
  authority_name: string | null;
  extracted_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentAnalysis {
  id: string;
  document_id: string;
  user_id: string;
  analysis_json: AnalysisResult;
  summary_simple: string | null;
  summary_detailed: string | null;
  required_actions: RequiredAction[] | null;
  required_documents: RequiredDocument[] | null;
  risks_if_ignored: string[] | null;
  confidence_score: number | null;
  ai_model: string | null;
  created_at: string;
}

export interface Deadline {
  id: string;
  user_id: string;
  document_id: string | null;
  title: string;
  description: string | null;
  deadline_date: string;
  urgency: Urgency;
  status: DeadlineStatus;
  reminder_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface GeneratedLetter {
  id: string;
  user_id: string;
  document_id: string | null;
  letter_type: LetterType;
  subject: string;
  german_body: string;
  translated_explanation: string | null;
  target_language: string;
  pdf_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  category: string;
  title: string;
  description: string | null;
  language: string;
  content: string;
  variables: TemplateVariable[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateCategory {
  id: string;
  slug: string;
  name: Record<string, string>;
  description: Record<string, string>;
  icon: string | null;
  created_at: string;
}

export interface UsageLog {
  id: string;
  user_id: string;
  action_type: string;
  tokens_used: number;
  document_id: string | null;
  metadata: Json;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Json;
  created_at: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  type: FeedbackType;
  message: string;
  status: FeedbackStatus;
  admin_reply: string | null;
  replied_at: string | null;
  replied_by: string | null;
  created_at: string;
}

export interface SupportPermission {
  id: string;
  user_id: string;
  document_id: string;
  granted_to: string;
  expires_at: string | null;
  created_at: string;
}

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'date' | 'textarea';
  required: boolean;
}

export interface AnalysisResult {
  document_type: DocumentType;
  sender_authority: string;
  recipient_name: string | null;
  letter_date: string | null;
  deadlines: DeadlineInfo[];
  summary_simple: string;
  summary_detailed: string;
  required_actions: RequiredAction[];
  required_documents: RequiredDocument[];
  risks_if_ignored: string[];
  recommended_response_type: ResponseType;
  confidence_score: number;
  legal_disclaimer: string;
}

export interface DeadlineInfo {
  date: string;
  reason: string;
  urgency: Urgency;
}

export interface RequiredAction {
  action: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string | null;
}

export interface RequiredDocument {
  name: string;
  why_needed: string;
  optional: boolean;
}
