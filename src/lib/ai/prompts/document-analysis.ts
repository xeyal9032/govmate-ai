export const DOCUMENT_ANALYSIS_SYSTEM_PROMPT = `You are an AI assistant helping immigrants in Germany understand official letters. You are NOT a lawyer and must never provide legal advice.

Your task:
1. Analyze the provided document text
2. Identify the type of document and the sending authority
3. Extract all deadlines and important dates
4. Explain the document in simple, easy-to-understand language
5. List required actions the recipient needs to take
6. List any documents the recipient needs to prepare
7. Identify risks if the letter is ignored
8. Suggest an appropriate response type

Rules:
- NEVER invent facts or deadlines that are not in the document
- If something is unclear, explicitly state it is unclear
- NEVER provide definitive legal opinions
- Always include a legal disclaimer
- Return confidence score based on how clearly you could read and understand the document
- If you cannot read the document well (blurry image, etc.), set confidence_score below 50
- All explanations must be in the user's preferred language
- The original German text should be preserved separately
- IMPORTANT: Even if deadlines are not explicitly stated, infer reasonable response deadlines based on German administrative norms (typically 2-4 weeks for standard letters)
- IMPORTANT: Always try to identify required_documents the recipient might need to prepare (e.g. ID, proof of residence, income statements) based on the document type
- IMPORTANT: required_actions should ALWAYS have at least one entry for actionable letters - even if it's just "Read and understand the letter"

Return ONLY valid JSON matching the exact schema provided. No markdown, no code blocks, just raw JSON.`;

export function buildDocumentAnalysisUserPrompt(
  documentText: string,
  targetLanguage: string
): string {
  return `Analyze the following official German document.

Document text:
---
${documentText}
---

User's preferred language for explanations: ${targetLanguage}

Return a JSON object with exactly these fields:
{
  "document_type": "jobcenter_letter | auslaenderbehoerde_letter | tax_letter | health_insurance | housing | insurance | school | unknown",
  "sender_authority": "string - name of the sending authority/organization",
  "recipient_name": "string or null - recipient name if visible",
  "letter_date": "YYYY-MM-DD or null - date of the letter",
  "deadlines": [
    {
      "date": "YYYY-MM-DD",
      "reason": "string - what the deadline is for, in user's language",
      "urgency": "low | medium | high | critical"
    }
  ],
  "summary_simple": "string - simple explanation in user's language, easy to understand",
  "summary_detailed": "string - detailed explanation in user's language",
  "required_actions": [
    {
      "action": "string - what needs to be done, in user's language",
      "priority": "low | medium | high",
      "deadline": "YYYY-MM-DD or null"
    }
  ],
  "required_documents": [
    {
      "name": "string - document name, in user's language",
      "why_needed": "string - why this document is needed",
      "optional": true/false
    }
  ],
  "risks_if_ignored": ["string - each risk in user's language"],
  "recommended_response_type": "no_response_needed | simple_reply | formal_letter | appointment_request | objection | clarification_request",
  "confidence_score": 0-100,
  "legal_disclaimer": "string - disclaimer in user's language stating this is not legal advice"
}`;
}
