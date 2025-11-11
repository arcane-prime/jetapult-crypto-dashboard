import type { CryptoObject } from "../types/crypto-object.js";
import type { CryptoHistoricData } from "../types/crypto-historic-data.js";
import { getCryptoIds } from "../database/db-operations.js";

const baseUrl = process.env.BASE_URL || 'https://api.coingecko.com/api/v3';
export async function fetchTopNCryptos(n: number): Promise<CryptoObject[]> { 
    const url = `${baseUrl}/coins/markets?vs_currency=usd&per_page=${n}&page=1`;
    try { 
        const response = await fetch(url, { 
            headers: { 
                'x_cg_pro_api_key': process.env.COINGECKO_API_KEY || ''
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData: CryptoObject[] = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        return [];
    }
}

export async function fetchCryptoHistoricData(id: string) { 
    const url = `${baseUrl}/coins/${id}/market_chart?vs_currency=usd&days=30`;
    try { 
        const response = await fetch(url, { 
            headers: { 
                'x_cg_pro_api_key': process.env.COINGECKO_API_KEY || ''
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData: Omit<CryptoHistoricData, 'id'> = await response.json();
        const result: CryptoHistoricData = {
            id,
            ...jsonData
        };
        return result;
    } catch(err) { 
        console.error('Error fetching crypto historic data:', err);
        return null;
    }
}

export async function fetchCryptoIds() { 
    try { 
        const cryptoIds = await getCryptoIds();
        return cryptoIds;
    } catch (err) {
        console.error('Error fetching crypto ids:', err);
        return [];
    }
}