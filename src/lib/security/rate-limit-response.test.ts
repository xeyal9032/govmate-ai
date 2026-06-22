import { describe, it, expect, vi, beforeEach } from 'vitest';
import { rateLimitOrNull, AI_RATE_LIMIT } from '@/lib/security/rate-limit-response';
import * as rateLimit from '@/lib/security/rate-limit';

describe('rateLimitOrNull', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('Redis yoksa production 503 döner', async () => {
    vi.spyOn(rateLimit, 'checkRateLimitAsync').mockResolvedValue({
      allowed: false,
      remaining: 0,
      resetIn: 60_000,
      unavailable: true,
    });

    const res = await rateLimitOrNull('test-key', AI_RATE_LIMIT);
    expect(res?.status).toBe(503);
    const body = await res!.json();
    expect(body.errorCode).toBe('RATE_LIMIT_UNAVAILABLE');
  });

  it('limit aşıldığında 429 döner', async () => {
    vi.spyOn(rateLimit, 'checkRateLimitAsync').mockResolvedValue({
      allowed: false,
      remaining: 0,
      resetIn: 30_000,
    });

    const res = await rateLimitOrNull('test-key', AI_RATE_LIMIT);
    expect(res?.status).toBe(429);
    expect(res?.headers.get('Retry-After')).toBe('30');
  });

  it('izin verildiyse null döner', async () => {
    vi.spyOn(rateLimit, 'checkRateLimitAsync').mockResolvedValue({
      allowed: true,
      remaining: 4,
      resetIn: 60_000,
    });

    await expect(rateLimitOrNull('test-key', AI_RATE_LIMIT)).resolves.toBeNull();
  });
});
