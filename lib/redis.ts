import { Redis } from "@upstash/redis";

const getRedisClient = (): Redis | null => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
};

export const redis = getRedisClient();

export const cacheKey = (topic: string, level: string): string =>
  `explanation:${topic.toLowerCase().trim()}:${level}`;
