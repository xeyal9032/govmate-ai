import { NextResponse } from 'next/server';
import { checkRateLimitAsync, type RateLimitConfig, AI_RATE_LIMIT } from './rate-limit';

export {
  AI_RATE_LIMIT,
  UPLOAD_RATE_LIMIT,
  AUTH_RATE_LIMIT,
  type RateLimitConfig,
} from './rate-limit';

/** Limit aşıldıysa 429 yanıtı; aksi halde null */
export async function rateLimitOrNull(
  key: string,
  config: RateLimitConfig = AI_RATE_LIMIT
): Promise<NextResponse | null> {
  const result = await checkRateLimitAsync(key, config);
  if (!result.allowed) {
    return NextResponse.json(
      { error: 'Too many requests, please wait' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.max(1, Math.ceil(result.resetIn / 1000))),
        },
      }
    );
  }
  return null;
}
