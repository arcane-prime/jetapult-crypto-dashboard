import { CryptoObject } from "../models/crypto-schema.js";
import { getCryptoIds, getTopNCryptos, getCryptoHistoricData, getCryptoIdFromName } from "../services/sync-db-service.js";
import { getCachedData, setCachedData, getCacheKeyTopNCryptos, getCacheKeyCryptoIds, getCacheKeyCryptoHistoricData, getCacheKeySearchQuery } from "../cache/redis-client.js";

export async function getCryptoIdsFromDB() {
    try {
        const cachedCryptoIds = await getCachedData(getCacheKeyCryptoIds());
        if (cachedCryptoIds) {
            console.log("Cached hit crypto ids");
            return cachedCryptoIds;
        }
        const cryptoIds = await getCryptoIds();
        await setCachedData(getCacheKeyCryptoIds(), cryptoIds);
        return cryptoIds;
    } catch (err) {
        console.error('Error fetching crypto ids:', err);
        return [];
    }
}

export async function getTopNCryptosFromDB(n: number): Promise<CryptoObject[]> {
    try {
        const cachedCryptoCurrencies = await getCachedData(getCacheKeyTopNCryptos(n));
        if (cachedCryptoCurrencies) {
            console.log("Cached hit top cryptos for n = " + n);
            return cachedCryptoCurrencies;
        }
        const cryptoCurrencies = await getTopNCryptos(n);
        await setCachedData(getCacheKeyTopNCryptos(n), cryptoCurrencies);
        return cryptoCurrencies;
    } catch (err) {
        console.error('Error getting top n crypto currencies:', err);
        return [];
    }
}

export async function getCryptoHistoricDataFromDB(id: string) {
    try {
        const cachedCryptoHistoricData = await getCachedData(getCacheKeyCryptoHistoricData(id));
        if (cachedCryptoHistoricData) {
            console.log("Cached hit crypto historic data for id = " + id);
            return cachedCryptoHistoricData;
        }
        const cryptoHistoricData = await getCryptoHistoricData(id);
        await setCachedData(getCacheKeyCryptoHistoricData(id), cryptoHistoricData);
        return cryptoHistoricData;
    } catch (err) {
        console.error('Error getting crypto historic data:', err);
        return null;
    }
}

export async function getClosingPricesMarketCapFromDB(id: string, days: number = 30) {
    try {
        const validDays = Math.max(1, Math.min(30, Math.floor(days)));

        const cryptoHistoricData = await getCryptoHistoricDataFromDB(id);
        if (!cryptoHistoricData) {
            return null;
        }
        const extractLatestPerDay = (points: unknown[]) => {
            const byDay = new Map<string, number>();
            for (const entry of points) {
                const tuple = Array.isArray(entry) ? entry : null;
                const timestamp = tuple?.[0];
                const value = tuple?.[1];
                if (typeof timestamp !== 'number' || typeof value !== 'number') {
                    continue;
                }
                const dayKey = new Date(timestamp).toISOString().slice(0, 10);
                byDay.set(dayKey, value);
            }
            return Array.from(byDay.entries())
                .map(([day, value]) => ({ date: day, value }))
                .sort((a, b) => (a.date < b.date ? -1 : 1))
                .slice(-validDays);
        };

        return {
            id: cryptoHistoricData.id,
            prices: extractLatestPerDay(cryptoHistoricData.prices),
            market_caps: extractLatestPerDay(cryptoHistoricData.market_caps),
        };
    } catch (err) {
        console.error('Error getting closing prices and market cap:', err);
        return null;
    }
}

function extractDaysFromQuery(query: string): number {
    const dayMatch = query.match(/(\d{1,2})\s*-?\s*day/i);
    if (dayMatch && dayMatch[1]) {
        const extractedDays = parseInt(dayMatch[1], 10);
        if (extractedDays >= 1 && extractedDays <= 30) {
            return extractedDays;
        }
    }
    return 30;
}

function findCryptoIdInQuery(query: string, cryptoIds: string[]): string | null {
    const words = query.toLowerCase().split(' ');
    const cryptoIdsLower = new Set(cryptoIds.map(id => id.toLowerCase()));
    const foundId = words.find(word => cryptoIdsLower.has(word));
    return foundId || null;
}

export async function searchQueryFromDB(query: string) {
    try {
        if (!query || !query.trim()) {
            return [];
        }
        const cachedCryptoObject = await getCachedData(getCacheKeySearchQuery(query));
        if (cachedCryptoObject) {
            console.log("Cached hit search query for query = " + query);
            return cachedCryptoObject;
        }
        const queryLower = query.toLowerCase();
        const cryptoIds = await getCryptoIdsFromDB();
        const cryptoId = findCryptoIdInQuery(query, cryptoIds);

        if (!cryptoId) {
            return [];
        }

        if (queryLower.includes('price of')) {
            const cryptoObject = await getCryptoIdFromName(cryptoId);
            await setCachedData(getCacheKeySearchQuery(query), cryptoObject);
            return cryptoObject ? cryptoObject : [];
        }

        if (queryLower.includes('day trend of')) {

            const days = extractDaysFromQuery(query);
            const cryptoObject = await getClosingPricesMarketCapFromDB(cryptoId, days);
            await setCachedData(getCacheKeySearchQuery(query), cryptoObject);
            return cryptoObject ? cryptoObject : [];
        }

        return [];
    } catch (err) {
        console.error('Error searching query:', err);
        return [];
    }
}

