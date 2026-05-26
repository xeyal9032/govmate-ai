import type { AnalysisResult, LetterType } from './database';

export interface AIAnalysisRequest {
  documentId: string;
  extractedText: string;
  targetLanguage: string;
  fileUrl?: string;
  mimeType?: string;
}

export interface AIAnalysisResponse {
  success: boolean;
  analysis: AnalysisResult | null;
  error?: string;
}

export interface AILetterRequest {
  documentId: string;
  letterType: LetterType;
  authorityName: string;
  summary: string;
  action: string;
  userProfile: {
    fullName: string;
    address?: string;
    customerNumber?: string;
  };
  notes?: string;
  targetLanguage: string;
}

export interface AILetterResponse {
  subject: string;
  german_body: string;
  explanation_in_user_language: string;
  disclaimer: string;
}

export interface AITranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  mode: 'simple' | 'formal' | 'a2_level';
}

export interface AITranslationResponse {
  translated_text: string;
  mode: string;
}

export interface OCRProvider {
  extractText(file: Buffer, mimeType: string): Promise<string>;
}
