import { fetchTopNCryptosFromCoinGecko, fetchCryptoHistoricDataFromCoinGecko } from "../services/coingecko-service.js";
import { updateCryptoCurrencies, updateCryptoHistoricData } from "../services/sync-coingecko-service.js";
import { CryptoHistoricData } from "../models/crypto-historic-data.js";
import { getCryptoIds } from "../services/sync-db-service.js";

export async function refreshCryptoCurrencies() {
    const cryptoData = await fetchTopNCryptosFromCoinGecko(10);
    await updateCryptoCurrencies(cryptoData);
    console.log(`Updated ${cryptoData.length} crypto currencies successfully.`);
}

export async function refreshCryptoHistoricData(
) {
    const cryptoIds = await getCryptoIds();
    for(const id of cryptoIds) {
        const cryptoHistoricData: CryptoHistoricData | null = await fetchCryptoHistoricDataFromCoinGecko(id);
        if(cryptoHistoricData) {
            await updateCryptoHistoricData(cryptoHistoricData);
            console.log(`Updated crypto historic data for ${id} successfully.`);
        } else {
            console.error(`Failed to fetch crypto historic data for ${id}.`);
        }
        await sleep(5000); 
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


