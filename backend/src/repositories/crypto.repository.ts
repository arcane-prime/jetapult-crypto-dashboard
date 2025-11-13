import { CryptoCurrency } from "../schema/crypto.schema.js";
import { CryptoCurrencyHistoricData } from "../schema/crypto-historic-data.schema.js";
import { CryptoObject } from "../schema/crypto.schema.js";
import { CryptoHistoricData } from "../schema/crypto-historic-data.schema.js";

export async function getCryptoIds() {
    try {
        const cryptoIds = await CryptoCurrency.find({}, { id: 1 });
        return cryptoIds.map((crypto: any) => crypto.id);
    } catch (err) {
        console.error("Error getting crypto ids:", err);
        throw err;
    }
}

export async function hasCryptoData(): Promise<boolean> {
    try {
        const count = await CryptoCurrency.countDocuments();
        return count > 0;
    } catch (err) {
        console.error("Error checking crypto data:", err);
        return false;
    }
}

export async function getTopNCryptos(n: number): Promise<CryptoObject[]> { 
    try {
        const cryptoCurrencies = await CryptoCurrency.find({}).sort({ market_cap: -1 }).limit(n);
        return cryptoCurrencies.map((crypto: any) => ({
            ...crypto.toObject(),
            roi: crypto.roi ? {
                times: crypto.roi.times ?? 0,
                currency: crypto.roi.currency ?? '',
                percentage: crypto.roi.percentage ?? 0,
            } : null,
        }));
    } catch (err) {
        console.error("Error getting top n crypto currencies:", err);
        throw err;
    }
}

export async function getCryptoHistoricData(id: string) {
    try {
        const cryptoHistoricData = await CryptoCurrencyHistoricData.findOne({ id });
        return cryptoHistoricData ? { 
            id: cryptoHistoricData.id,
            prices: cryptoHistoricData.prices,
            market_caps: cryptoHistoricData.market_caps,
            total_volumes: cryptoHistoricData.total_volumes,
        } : null;
    } catch (err) {
        console.error("Error getting crypto historic data:", err);
        throw err;
    }
}

export async function getCryptoIdFromName(id: string) {
    try {
        const cryptoId = await CryptoCurrency.findOne({ id: id});
        return cryptoId ? cryptoId : null;
    } catch (err) {
        console.error("Error getting crypto id from name:", err);
        throw err;
    }
}

// Fetch only specific fields based on query type
export async function getCryptoFields(id: string, fields: string[]) {
    try {
        const projection: Record<string, number> = { _id: 0 };
        fields.forEach(field => {
            projection[field] = 1;
        });
        const crypto = await CryptoCurrency.findOne({ id }, projection);
        return crypto ? crypto.toObject() : null;
    } catch (err) {
        console.error("Error getting crypto fields:", err);
        throw err;
    }
}

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

