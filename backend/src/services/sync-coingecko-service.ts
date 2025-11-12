import { CryptoCurrency, CryptoObject } from "../models/crypto-schema.js";
import { CryptoCurrencyHistoricData, CryptoHistoricData } from "../models/crypto-historic-data-schema.js";

export async function updateCryptoCurrencies(
    cryptoData: CryptoObject[]
) {
    try {
        if (!cryptoData || cryptoData.length === 0) return;

        const bulkOps = cryptoData.map((crypto) => ({
            updateOne: {
                filter: { id: crypto.id },
                update: { $set: crypto },
                upsert: true,
            },
        }));

        await CryptoCurrency.bulkWrite(bulkOps);

        const ids = cryptoData.map((c) => c.id);
        await CryptoCurrency.deleteMany({ id: { $nin: ids } });

        console.log(`Updated ${cryptoData.length} crypto records successfully.`);
    } catch (err) {
        console.error("Error updating crypto currencies:", err);
        throw err;
    }
}


export async function updateCryptoHistoricData(
    historicData: CryptoHistoricData
) {
    try {
        const id = historicData.id;
        const existingData = await CryptoCurrencyHistoricData.findOne({ id });
        if (existingData) {
            await CryptoCurrencyHistoricData.updateOne({ id }, { $set: historicData }, { upsert: true });
        } else {
            await CryptoCurrencyHistoricData.create(historicData);
        }
    } catch (err) {
        console.error("Error updating crypto historic data:", err);
        throw err;
    }
}
