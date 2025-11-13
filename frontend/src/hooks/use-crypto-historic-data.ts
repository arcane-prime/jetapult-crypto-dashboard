import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/constants';
import type { CryptoHistoricData } from '../types/crypto';

export interface Snapshot {
  date: string;
  price: number | null;
  marketCap: number | null;
}

interface UseCryptoHistoricDataResult {
  historicData: CryptoHistoricData | null;
  isLoading: boolean;
  error: string | null;
  dailySnapshots: Snapshot[];
  priceSeries30Days: [number, number][];
  marketCapSeries30Days: [number, number][];
}

export function useCryptoHistoricData(id?: string | null): UseCryptoHistoricDataResult {
  const [historicData, setHistoricData] = useState<CryptoHistoricData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dailySnapshots, setDailySnapshots] = useState<Snapshot[]>([]);
  const [priceSeries30Days, setPriceSeries30Days] = useState<[number, number][]>([]);
  const [marketCapSeries30Days, setMarketCapSeries30Days] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!id) {
      setHistoricData(null);
      setIsLoading(false);
      setError('Missing crypto id.');
      setDailySnapshots([]);
      setPriceSeries30Days([]);
      setMarketCapSeries30Days([]);
      return;
    }

    const controller = new AbortController();

    const fetchHistoricData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch 30 days of closing prices and market caps
        const closingPricesResponse = await fetch(
          `${API_BASE_URL}/crypto/closing-prices-market-cap?id=${encodeURIComponent(id)}&days=30`,
          { signal: controller.signal },
        );

        if (!closingPricesResponse.ok) {
          throw new Error(`Request failed with status ${closingPricesResponse.status}`);
        }

        const closingData = await closingPricesResponse.json();
        
        if (!closingData || !closingData.prices || !closingData.market_caps) {
          throw new Error('Invalid data format received');
        }

        // Convert date strings to timestamps for chart compatibility
        const prices30Days: [number, number][] = closingData.prices.map((point: { date: string; value: number }) => [
          new Date(point.date).getTime(),
          point.value,
        ]);

        const marketCaps30Days: [number, number][] = closingData.market_caps.map(
          (point: { date: string; value: number }) => [new Date(point.date).getTime(), point.value],
        );

        setPriceSeries30Days(prices30Days);
        setMarketCapSeries30Days(marketCaps30Days);

        // Build snapshots for the detail view
        const snapshots: Snapshot[] = closingData.prices
          .map((pricePoint: { date: string; value: number }) => {
            const marketCapPoint = closingData.market_caps.find(
              (mc: { date: string }) => mc.date === pricePoint.date,
            );
            return {
              date: pricePoint.date,
              price: pricePoint.value,
              marketCap: marketCapPoint?.value ?? null,
            };
          })
          .reverse(); // Most recent first

        setDailySnapshots(snapshots);

        // Also fetch raw historic data for metrics (if needed)
        const rawHistoricResponse = await fetch(
          `${API_BASE_URL}/crypto/historic?id=${encodeURIComponent(id)}`,
          { signal: controller.signal },
        );

        if (rawHistoricResponse.ok) {
          const rawData: CryptoHistoricData = await rawHistoricResponse.json();
          setHistoricData(rawData);
        }

        setError(null);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        let message = 'Failed to load historical data';
        if (err instanceof Error) {
          if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            message = 'Network error: Unable to connect to the server.';
          } else if (err.message.includes('status')) {
            message = `Server error: ${err.message}`;
          } else {
            message = err.message;
          }
        }
        setError(message);
        setDailySnapshots([]);
        setPriceSeries30Days([]);
        setMarketCapSeries30Days([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricData();

    return () => controller.abort();
  }, [id]);

  return {
    historicData,
    isLoading,
    error,
    dailySnapshots,
    priceSeries30Days,
    marketCapSeries30Days,
  };
}

