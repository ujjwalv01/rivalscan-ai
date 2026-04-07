import type { Redis as RedisType } from '@upstash/redis';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let redis: RedisType | null = null;

async function getRedis(): Promise<RedisType | null> {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token || url === 'your_upstash_redis_rest_url_here') {
    return null;
  }

  try {
    const { Redis } = await import('@upstash/redis');
    redis = new Redis({ url, token });
    return redis;
  } catch {
    return null;
  }
}

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const r = await getRedis();
    if (!r) return null;
    const value = await r.get<string>(key);
    if (!value) return null;
    return (typeof value === 'string' ? JSON.parse(value) : value) as T;
  } catch {
    return null;
  }
}

export async function setCache(key: string, value: unknown, ttlSeconds = 86400): Promise<void> {
  try {
    const r = await getRedis();
    if (!r) return;
    await r.set(key, JSON.stringify(value), { ex: ttlSeconds });
  } catch {
    // Silently fail if caching is unavailable
  }
}
