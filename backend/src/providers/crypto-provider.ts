import { fetchTopNCryptos, fetchCryptoHistoricData, fetchCryptoIds } from "../services/crypto-service.js";
import { updateCryptoCurrencies, updateCryptoHistoricData } from "../database/db-operations.js";
import { CryptoHistoricData } from "../types/crypto-historic-data.js";

export async function refreshCryptoCurrencies() {
    const cryptoData = await fetchTopNCryptos(10);
    await updateCryptoCurrencies(cryptoData);
    console.log(`Updated ${cryptoData.length} crypto currencies successfully.`);
}

export async function refreshCryptoHistoricData(
) {
    const cryptoIds = await fetchCryptoIds();
    for(const id of cryptoIds) {
        const cryptoHistoricData: CryptoHistoricData | null = await fetchCryptoHistoricData(id);
        if(cryptoHistoricData) {
            await updateCryptoHistoricData(cryptoHistoricData);
            console.log(`Updated crypto historic data for ${id} successfully.`);
        } else {
            console.error(`Failed to fetch crypto historic data for ${id}.`);
        }
        await sleep(3000); 
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}