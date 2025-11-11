import { CryptoCurrency } from "../models/crypto-object.js";
import { CryptoCurrencyHistoricData } from "../models/crypto-historic-data.js";
import { CryptoObject } from "../models/crypto-object.js";
import { CryptoHistoricData } from "../models/crypto-historic-data.js";

export async function getCryptoIds() {
    try {
        const cryptoIds = await CryptoCurrency.find({}, { id: 1 });
        return cryptoIds.map((crypto) => crypto.id);
    } catch (err) {
        console.error("Error getting crypto ids:", err);
        throw err;
    }
}

export async function getTopNCryptos(n: number): Promise<CryptoObject[]> { 
    try {
        const cryptoCurrencies = await CryptoCurrency.find({}).sort({ market_cap: -1 }).limit(n);
        return cryptoCurrencies.map((crypto) => ({
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