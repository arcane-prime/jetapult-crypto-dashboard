import { Redis } from "ioredis";

const CACHE_TTL = process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL) : 60 * 60 * 3; // 3 hours

export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
});

export const getCachedData = async (key: string) => {
  try{ 
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting cached data:", error);
    return null;
  }
};

export const setCachedData = async (key: string, data: any, ttl: number = CACHE_TTL) => {
    try{
        await redisClient.set(key, JSON.stringify(data), "EX", ttl);
    } catch (error) {
        console.error("Error setting cached data:", error);
    }
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