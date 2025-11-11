import { CryptoObject } from "../models/crypto-object.js";
import { getCryptoIds, getTopNCryptos, getCryptoHistoricData } from "../services/sync-db-service.js";


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