import { CryptoObject } from "../models/crypto-object.js";
import { getCryptoIds, getTopNCryptos, getCryptoHistoricData } from "../services/sync-db-service.js";
import { CryptoHistoricData } from "../models/crypto-historic-data.js";

export async function getCryptoIdsFromDB() { 
    try { 
        const cryptoIds = await getCryptoIds();
        return cryptoIds;
    } catch (err) {
        console.error('Error fetching crypto ids:', err);
        return [];
    }
}

export async function getTopNCryptosFromDB(n: number): Promise<CryptoObject[]> { 
    try { 
        const cryptoCurrencies = await getTopNCryptos(n);
        return cryptoCurrencies;
    } catch (err) {
        console.error('Error getting top n crypto currencies:', err);
        return [];
    }
}

export async function getCryptoHistoricDataFromDB(id: string) { 
    try { 
        const cryptoHistoricData = await getCryptoHistoricData(id);
        return cryptoHistoricData;
    } catch (err) {
        console.error('Error getting crypto historic data:', err);
        return null;
    }
}

export async function getClosingPricesMarketCapFromDB(id: string) { 
    try { 
        const cryptoHistoricData = await getCryptoHistoricData(id);
        if(!cryptoHistoricData) {
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
                .slice(-30);
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