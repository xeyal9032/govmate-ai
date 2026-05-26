import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export const AI_RATE_LIMIT: RateLimitConfig = { maxRequests: 5, windowMs: 60 * 1000 };
export const UPLOAD_RATE_LIMIT: RateLimitConfig = { maxRequests: 10, windowMs: 60 * 1000 };
export const AUTH_RATE_LIMIT: RateLimitConfig = { maxRequests: 5, windowMs: 5 * 60 * 1000 };

const isRedisConfigured =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;
const rateLimiters = new Map<string, Ratelimit>();

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

function getUpstashLimiter(config: RateLimitConfig): Ratelimit {
  const key = `${config.maxRequests}:${config.windowMs}`;
  if (!rateLimiters.has(key)) {
    rateLimiters.set(
      key,
      new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(
          config.maxRequests,
          `${Math.round(config.windowMs / 1000)}s`
        ),
        analytics: true,
      })
    );
  }
  return rateLimiters.get(key)!;
}

// In-memory fallback (geliştirme ortamı veya Redis yapılandırılmadığında)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitEntry>();

function checkMemoryRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetTime) {
    memoryStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.windowMs };
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
  }

  entry.count++;
  return { allowed: true, remaining: config.maxRequests - entry.count, resetIn: entry.resetTime - now };
}

export async function checkRateLimitAsync(
  key: string,
  config: RateLimitConfig = AI_RATE_LIMIT
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  if (isRedisConfigured) {
    try {
      const limiter = getUpstashLimiter(config);
      const result = await limiter.limit(key);
      return {
        allowed: result.success,
        remaining: result.remaining,
        resetIn: result.reset - Date.now(),
      };
    } catch (error) {
      console.warn('Redis rate limit failed, falling back to memory:', error);
    }
  }
  return checkMemoryRateLimit(key, config);
}

// Senkron fallback — mevcut kodla geriye uyumluluk
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = AI_RATE_LIMIT
): { allowed: boolean; remaining: number; resetIn: number } {
  return checkMemoryRateLimit(key, config);
}

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore.entries()) {
      if (now > entry.resetTime) memoryStore.delete(key);
    }
  }, 60 * 1000);
}
