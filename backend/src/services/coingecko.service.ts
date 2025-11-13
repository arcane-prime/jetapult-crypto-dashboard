import { fetchTopNCryptosFromCoinGecko, fetchCryptoHistoricDataFromCoinGecko } from "../repositories/coingecko.repository.js";
import { updateCryptoCurrencies, updateCryptoHistoricData } from "../repositories/crypto.repository.js";
import { CryptoHistoricData } from "../schema/crypto-historic-data.schema.js";
import { getCryptoIds } from "../repositories/crypto.repository.js";

export async function refreshCryptoCurrencies() {
    const cryptoData = await fetchTopNCryptosFromCoinGecko(10);
    await updateCryptoCurrencies(cryptoData);
    console.log(`Updated ${cryptoData.length} crypto currencies successfully.`);
}

export async function refreshCryptoHistoricData() {
    const cryptoIds = await getCryptoIds();
    for(const id of cryptoIds) {
        const cryptoHistoricData: CryptoHistoricData | null = await fetchCryptoHistoricDataFromCoinGecko(id);
        if(cryptoHistoricData) {
            await updateCryptoHistoricData(cryptoHistoricData);
            console.log(`Updated crypto historic data for ${id} successfully.`);
        } else {
            console.error(`Failed to fetch crypto historic data for ${id}.`);
        }
        await sleep(10000); 
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
