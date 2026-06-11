import type { ApiErrorBody } from '@/lib/utils/api-error-codes';

/** WhatsApp / Safari in-app: göreli URL sorunları için tam kök URL */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || '';
}

export async function readApiErrorBody(
  response: Response,
  fallback: string
): Promise<ApiErrorBody> {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      const text = await response.text();
      if (!text.trim()) return { error: fallback };
      const data = JSON.parse(text) as ApiErrorBody;
      if (typeof data?.error === 'string' && data.error.length > 0) {
        return data;
      }
    } catch {
      // Safari: bozuk JSON → anlaşılır fallback
    }
  }

  return { error: fallback };
}

export async function readApiError(
  response: Response,
  fallback: string
): Promise<string> {
  const body = await readApiErrorBody(response, fallback);
  return body.error;
}

export async function readApiJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text.trim()) {
    throw new Error('EMPTY_RESPONSE');
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('JSON_PARSE');
  }
}
