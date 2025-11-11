import { useEffect, useState } from 'react';
import type { CryptoSummary } from '../types/crypto';
import { API_BASE_URL } from '../config/constants';

export interface UseTopCryptosResult {
  cryptos: CryptoSummary[];
  isLoading: boolean;
  error: string | null;
  apiBaseUrl: string;
}

export function useTopCryptos(topN: number): UseTopCryptosResult {
  const [cryptos, setCryptos] = useState<CryptoSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTopCryptos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/crypto/top?topN=${topN}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: CryptoSummary[] = await response.json();
        setCryptos(data);
        setError(null);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        const message =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopCryptos();

    return () => controller.abort();
  }, [topN]);

  return {
    cryptos,
    isLoading,
    error,
    apiBaseUrl: API_BASE_URL,
  };
}

