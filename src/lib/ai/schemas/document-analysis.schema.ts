import { z } from 'zod';

export const deadlineInfoSchema = z.object({
  date: z.string(),
  reason: z.string(),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
});

export const requiredActionSchema = z.object({
  action: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  deadline: z.string().nullable(),
});

export const requiredDocumentSchema = z.object({
  name: z.string(),
  why_needed: z.string(),
  optional: z.boolean(),
});

export const analysisResultSchema = z.object({
  document_type: z.enum([
    'jobcenter_letter',
    'auslaenderbehoerde_letter',
    'tax_letter',
    'health_insurance',
    'housing',
    'insurance',
    'school',
    'unknown',
  ]),
  sender_authority: z.string(),
  recipient_name: z.string().nullable(),
  letter_date: z.string().nullable(),
  deadlines: z.array(deadlineInfoSchema),
  summary_simple: z.string(),
  summary_detailed: z.string(),
  required_actions: z.array(requiredActionSchema),
  required_documents: z.array(requiredDocumentSchema),
  risks_if_ignored: z.array(z.string()),
  recommended_response_type: z.enum([
    'no_response_needed',
    'simple_reply',
    'formal_letter',
    'appointment_request',
    'objection',
    'clarification_request',
  ]),
  confidence_score: z.number().min(0).max(100),
  legal_disclaimer: z.string(),
});

export type AnalysisResultSchema = z.infer<typeof analysisResultSchema>;
