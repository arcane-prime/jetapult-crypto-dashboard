import { Redis } from "ioredis";

const CACHE_TTL = process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL) : 60 * 60 * 3; // 3 hours

let redisEnabled = false;
let redisClient: Redis | null = null;

// Initialize Redis with graceful fallback
try {
  const redisUrl = process.env.REDIS_URL;
  const redisHost = process.env.REDIS_HOST;
  const redisPort = process.env.REDIS_PORT;
  const isRemoteRedis = !!redisUrl; // Store connection type for event handlers

  // Priority 1: Use REDIS_URL if provided (Upstash, Railway, etc.)
  if (redisUrl) {
    const isSSL = redisUrl.startsWith('rediss://');
    const hostMatch = redisUrl.match(/@([^:]+):/);
    const host = hostMatch ? hostMatch[1] : 'remote';
    console.log(`🔗 Connecting to REMOTE Redis (${isSSL ? 'SSL' : 'non-SSL'}) at ${host}...`);
    
    redisClient = new Redis(redisUrl, {
      tls: isSSL ? {} : undefined,
      retryStrategy: (times) => {
        if (times > 3) {
          console.warn('Remote Redis connection failed. Falling back to database.');
          redisEnabled = false;
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });
  }
  // Priority 2: Try local Redis (default to localhost:6379 if not specified)
  else {
    const localHost = redisHost || "localhost";
    const localPort = parseInt(redisPort || "6379");
    
    console.log(`🔗 Connecting to LOCAL Redis at ${localHost}:${localPort}...`);
    
    redisClient = new Redis({
      host: localHost,
      port: localPort,
      // No password for local Redis - keep it simple
      retryStrategy: (times) => {
        if (times > 3) {
          console.warn('Local Redis connection failed. Falling back to database.');
          redisEnabled = false;
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      // Connect immediately to show connection status
    });
  }

  // Set up event handlers if Redis client was created
  if (redisClient) {
    redisClient.on('error', (error) => {
      console.warn('Redis error:', error.message, '- Falling back to database.');
      redisEnabled = false;
    });

    redisClient.on('connect', () => {
      const connectionType = isRemoteRedis ? 'REMOTE' : 'LOCAL';
      console.log(`✅ ${connectionType} Redis connected`);
      redisEnabled = true;
    });

    redisClient.on('ready', () => {
      const connectionType = isRemoteRedis ? 'REMOTE' : 'LOCAL';
      console.log(`✅ ${connectionType} Redis ready`);
      redisEnabled = true;
    });
  }
} catch (error) {
  console.warn('Failed to initialize Redis. Using database directly:', error);
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