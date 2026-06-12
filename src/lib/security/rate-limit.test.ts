import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import {
  checkRateLimit,
  checkRateLimitAsync,
  isProductionWithoutRateLimitRedis,
  isRateLimitRedisConfigured,
  AI_RATE_LIMIT,
} from '@/lib/security/rate-limit';

describe('rate-limit helpers', () => {
  it('Redis yapılandırması env değişkenlerine bağlı', () => {
    expect(typeof isRateLimitRedisConfigured()).toBe('boolean');
  });
});

describe('checkRateLimit memory mode', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('ilk istek izin verilir', () => {
    const key = `test-${Date.now()}-${Math.random()}`;
    const result = checkRateLimit(key, { maxRequests: 2, windowMs: 60_000 });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(1);
  });

  it('limit aşıldığında reddeder', () => {
    const key = `test-limit-${Date.now()}`;
    const config = { maxRequests: 2, windowMs: 60_000 };
    checkRateLimit(key, config);
    checkRateLimit(key, config);
    const third = checkRateLimit(key, config);
    expect(third.allowed).toBe(false);
    expect(third.remaining).toBe(0);
  });

  it('production ve Redis yoksa unavailable döner', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    expect(isProductionWithoutRateLimitRedis()).toBe(true);

    const result = await checkRateLimitAsync('prod-key', AI_RATE_LIMIT);
    expect(result.allowed).toBe(false);
    expect(result.unavailable).toBe(true);
  });
});

describe('checkRateLimitAsync development fallback', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it('Redis yoksa bellek modunda çalışır', async () => {
    const key = `async-${Date.now()}-${Math.random()}`;
    const result = await checkRateLimitAsync(key, { maxRequests: 5, windowMs: 60_000 });
    expect(result.allowed).toBe(true);
    expect(result.unavailable).toBeUndefined();
  });
});
