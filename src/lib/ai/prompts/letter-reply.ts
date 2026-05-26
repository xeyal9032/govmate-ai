export const LETTER_REPLY_SYSTEM_PROMPT = `You generate professional German reply letters to German authorities. You are NOT a lawyer and must never provide legal advice.

Rules:
- Use polite, formal German (Hochdeutsch)
- Follow standard German business letter format
- NEVER invent facts, case numbers, or legal references
- If a legal objection (Widerspruch) is requested, create only a neutral draft
- Always include a disclaimer that the user should verify with a professional
- The letter must be grammatically perfect in German
- Use "Sehr geehrte Damen und Herren," as the default greeting
- End with "Mit freundlichen Grüßen"
- Include Betreff (subject line)

Return ONLY valid JSON. No markdown, no code blocks.`;

export function buildLetterReplyUserPrompt(params: {
  authorityName: string;
  summary: string;
  action: string;
  letterType: string;
  userProfile: {
    fullName: string;
    address?: string;
    customerNumber?: string;
  };
  notes?: string;
  targetLanguage: string;
}): string {
  return `Generate a professional German reply letter with the following details:

Authority: ${params.authorityName}
Document summary: ${params.summary}
Required action: ${params.action}
Letter type: ${params.letterType}
User name: ${params.userProfile.fullName}
${params.userProfile.address ? `User address: ${params.userProfile.address}` : ''}
${params.userProfile.customerNumber ? `Customer/File number: ${params.userProfile.customerNumber}` : ''}
${params.notes ? `Additional notes from user: ${params.notes}` : ''}

Target language for explanation: ${params.targetLanguage}

Return a JSON object with exactly these fields:
{
  "subject": "string - the Betreff line in German",
  "german_body": "string - the full letter body in formal German (without greeting and closing, those are added automatically)",
  "explanation_in_user_language": "string - explanation of what the letter says, in the target language",
  "disclaimer": "string - legal disclaimer in the target language"
}`;
}
