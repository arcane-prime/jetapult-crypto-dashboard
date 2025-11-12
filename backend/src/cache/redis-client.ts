import { Redis } from "ioredis";

const CACHE_TTL = process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL) : 60 * 60 * 3; // 3 hours

let redisEnabled = true;
let redisClient: Redis | null = null;

try {
  const redisHost = process.env.REDIS_HOST;
  const redisPort = process.env.REDIS_PORT;
  
  if (redisHost) {
    redisClient = new Redis({
      host: redisHost,
      port: parseInt(redisPort || "6379"),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        if (times > 3) {
          console.warn('Redis connection failed after 3 retries. Continuing without cache.');
          redisEnabled = false;
          return null; 
        }
        return Math.min(times * 200, 2000); 
      },
      maxRetriesPerRequest: 1, 
      enableOfflineQueue: false, 
    });

    redisClient.on('error', (error) => {
      console.warn('Redis connection error:', error.message);
      redisEnabled = false;
    });

    redisClient.on('connect', () => {
      console.log('Redis connected successfully');
      redisEnabled = true;
    });

    redisClient.on('ready', () => {
      console.log('Redis is ready');
      redisEnabled = true;
    });
  } else {
    console.log('Redis host not configured. Running without cache.');
    redisEnabled = false;
  }
} catch (error) {
  console.warn('Failed to initialize Redis. Continuing without cache:', error);
  redisEnabled = false;
}

export const getCachedData = async (key: string) => {
  if (!redisEnabled || !redisClient) {
    return null;
  }

  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn("Error getting cached data, disabling Redis:", error);
    redisEnabled = false;
    return null;
  }
};

export const setCachedData = async (key: string, data: any, ttl: number = CACHE_TTL) => {
  if (!redisEnabled || !redisClient) {
    return;
  }

  try {
    await redisClient.set(key, JSON.stringify(data), "EX", ttl);
  } catch (error) {
    console.warn("Error setting cached data, disabling Redis:", error);
    redisEnabled = false;
  }
};

export const isRedisAvailable = (): boolean => {
  return redisEnabled && redisClient !== null;
};

export function getCacheKeyTopNCryptos(n: number) { 
    return "cryptoCurrencies_n_" + n;
}

export function getCacheKeyCryptoIds() { 
    return "cryptoIds";
}

export function getCacheKeyCryptoHistoricData(id: string) { 
    return "cryptoHistoricData_" + id;
}

export function getCacheKeySearchQuery(query: string) { 
    return "searchQuery_" + query.toLowerCase();
}