import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOpenAIClient } from '@/lib/ai/client';

const NAME_KEYS = new Set([
  'full_name', 'child_name', 'school_name',
]);

const SKIP_KEYS = new Set([
  'date', 'application_date', 'appointment_date', 'appointment_time',
  'new_date', 'deadline_date', 'child_birthdate', 'move_in_date',
  'damage_date', 'customer_number', 'insurance_number', 'policy_number',
  'weeks_passed',
]);

function toTitleCase(str: string): string {
  return str
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fields } = await request.json() as {
      fields: Record<string, string>;
    };

    if (!fields || typeof fields !== 'object') {
      return NextResponse.json({ error: 'fields required' }, { status: 400 });
    }

    const result: Record<string, string> = {};
    const toTranslate: Record<string, string> = {};

    for (const [key, value] of Object.entries(fields)) {
      if (!value || !value.trim()) {
        result[key] = value;
        continue;
      }

      if (NAME_KEYS.has(key)) {
        result[key] = toTitleCase(value);
        continue;
      }

      if (SKIP_KEYS.has(key)) {
        result[key] = value;
        continue;
      }

      if (key === 'address') {
        result[key] = toTitleCase(value);
        continue;
      }

      toTranslate[key] = value;
    }

    if (Object.keys(toTranslate).length > 0) {
      const openai = getOpenAIClient();
      const prompt = buildTranslationPrompt(toTranslate);

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You translate text fields into formal German for use in official German letters. 
Keep it professional, concise, and grammatically correct. 
If the text is already in German, just clean up grammar if needed.
Return ONLY valid JSON — no markdown, no code blocks.`,
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const translated = JSON.parse(content) as Record<string, string>;
        for (const [key, val] of Object.entries(translated)) {
          result[key] = val;
        }
      }
    }

    return NextResponse.json({ fields: result });
  } catch (error) {
    console.error('Translate fields error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}

function buildTranslationPrompt(fields: Record<string, string>): string {
  const entries = Object.entries(fields)
    .map(([k, v]) => `"${k}": "${v}"`)
    .join(',\n  ');

  return `Translate the following field values into formal German. 
These will be used in official letters to German authorities.

Input:
{
  ${entries}
}

Return a JSON object with the same keys but German translations as values.`;
}
