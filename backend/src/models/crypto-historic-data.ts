import mongoose from "mongoose";

export interface CryptoHistoricData { 
    id: string;
    prices: number[][]; // [timestamp, price]
    market_caps: number[][]; // [timestamp, market_cap]
    total_volumes: number[][]; // [timestamp, total_volume]
}

const CryptoHistoricDataSchema = new mongoose.Schema({
    id: { type: String, required: true },
    prices: { type: [[Number]], required: true },
    market_caps: { type: [[Number]], required: true },
    total_volumes: { type: [[Number]], required: true },
});

CryptoHistoricDataSchema.index({ id: 1 }, { unique: true });

export const CryptoCurrencyHistoricData = mongoose.model('CryptoHistoricData', CryptoHistoricDataSchema);