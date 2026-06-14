import type { Database, Json } from '@/types/supabase.generated';
import type {
  AnalysisResult,
  Deadline,
  DeadlineStatus,
  Document,
  DocumentAnalysis,
  DocumentStatus,
  DocumentType,
  PlanLimit,
  PlanType,
  Profile,
  RequiredAction,
  RequiredDocument,
  Subscription,
  SubscriptionStatus,
  Template,
  TemplateCategory,
  TemplateVariable,
  Urgency,
  UserRole,
} from '@/types/database';
import { asLocalizedRecord, asVariableList } from '@/lib/localized-json';

type Tables = Database['public']['Tables'];

function asAnalysisResult(value: Json | null): AnalysisResult {
  return (value ?? {}) as unknown as AnalysisResult;
}

function asRequiredActions(value: Json | null): RequiredAction[] | null {
  if (!Array.isArray(value)) return null;
  return value as unknown as RequiredAction[];
}

function asRequiredDocuments(value: Json | null): RequiredDocument[] | null {
  if (!Array.isArray(value)) return null;
  return value as unknown as RequiredDocument[];
}

function asStringArray(value: Json | null): string[] | null {
  if (!Array.isArray(value)) return null;
  return value.filter((item): item is string => typeof item === 'string');
}

export function toProfile(row: Tables['profiles']['Row']): Profile {
  return { ...row, role: row.role as UserRole };
}

export function toSubscription(row: Tables['subscriptions']['Row']): Subscription {
  return {
    ...row,
    plan: row.plan as PlanType,
    status: row.status as SubscriptionStatus,
    cancel_at_period_end: row.cancel_at_period_end ?? false,
  };
}

export function toPlanLimit(row: Tables['plan_limits']['Row']): PlanLimit {
  return {
    ...row,
    plan: row.plan as PlanType,
    translation_enabled: row.translation_enabled ?? false,
    reminders_enabled: row.reminders_enabled ?? false,
    pdf_export_enabled: row.pdf_export_enabled ?? false,
  };
}

export function toDocument(row: Tables['documents']['Row']): Document {
  return {
    ...row,
    status: row.status as DocumentStatus,
    document_type: row.document_type as DocumentType | null,
  };
}

export function toDeadline(row: Tables['deadlines']['Row']): Deadline {
  return {
    ...row,
    urgency: row.urgency as Urgency,
    status: row.status as DeadlineStatus,
    reminder_enabled: row.reminder_enabled ?? false,
  };
}

export function toDocumentAnalysis(row: Tables['document_analyses']['Row']): DocumentAnalysis {
  return {
    ...row,
    analysis_json: asAnalysisResult(row.analysis_json),
    required_actions: asRequiredActions(row.required_actions),
    required_documents: asRequiredDocuments(row.required_documents),
    risks_if_ignored: asStringArray(row.risks_if_ignored),
  };
}

export function toTemplate(row: Tables['templates']['Row']): Template {
  return {
    ...row,
    description: row.description,
    variables: asVariableList(row.variables) as unknown as TemplateVariable[],
    is_active: row.is_active ?? false,
  };
}

export function toTemplateCategory(row: Tables['template_categories']['Row']): TemplateCategory {
  return {
    ...row,
    name: asLocalizedRecord(row.name),
    description: asLocalizedRecord(row.description),
  };
}

/** Supabase insert/update için domain nesnesini Json'a dönüştürür. */
export function toJson(value: unknown): Json {
  return value as Json;
}
