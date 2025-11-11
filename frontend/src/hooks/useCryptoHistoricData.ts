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
}

export function useCryptoHistoricData(id?: string | null): UseCryptoHistoricDataResult {
  const [historicData, setHistoricData] = useState<CryptoHistoricData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dailySnapshots, setDailySnapshots] = useState<Snapshot[]>([]);

  useEffect(() => {
    if (!id) {
      setHistoricData(null);
      setIsLoading(false);
      setError('Missing crypto id.');
      setDailySnapshots([]);
      return;
    }

    const controller = new AbortController();

    const fetchHistoricData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/crypto/historic?id=${encodeURIComponent(id)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: CryptoHistoricData = await response.json();
        setHistoricData(data);
        setDailySnapshots(buildDailySnapshots(data));
        setError(null);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        const message = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(message);
        setDailySnapshots([]);
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
  };
}

function buildDailySnapshots(data: CryptoHistoricData): Snapshot[] {
  const prices = mapLatestPerDay(data.prices);
  const marketCaps = mapLatestPerDay(data.market_caps);

  const allDates = Array.from(new Set<string>([...prices.keys(), ...marketCaps.keys()])).sort(
    (a, b) => (a < b ? -1 : 1),
  );

  return allDates
    .slice(-30)
    .reverse()
    .map((date) => ({
      date,
      price: prices.get(date) ?? null,
      marketCap: marketCaps.get(date) ?? null,
    }));
}

function mapLatestPerDay(points: [number, number][]): Map<string, number> {
  const byDay = new Map<string, number>();
  for (const [timestamp, value] of points) {
    const dayKey = new Date(timestamp).toISOString().slice(0, 10);
    byDay.set(dayKey, value);
  }
  return byDay;
}

