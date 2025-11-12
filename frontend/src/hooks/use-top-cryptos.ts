import { useEffect, useState } from 'react';
import type { CryptoSummary } from '../types/crypto';
import { API_BASE_URL } from '../config/constants';

export interface UseTopCryptosResult {
  cryptos: CryptoSummary[];
  isLoading: boolean;
  error: string | null;
  apiBaseUrl: string;
  retry: () => void;
}

export function useTopCryptos(topN: number): UseTopCryptosResult {
  const [cryptos, setCryptos] = useState<CryptoSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const retry = () => {
    setError(null);
    setRetryTrigger((prev) => prev + 1);
  };

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
        let message = 'Failed to load cryptocurrencies';
        if (err instanceof Error) {
          if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            message = 'Network error: Unable to connect to the server. Please check your connection.';
          } else if (err.message.includes('status')) {
            message = `Server error: ${err.message}`;
          } else {
            message = err.message;
          }
        }
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopCryptos();

    return () => controller.abort();
  }, [topN, retryTrigger]);

  return {
    cryptos,
    isLoading,
    error,
    apiBaseUrl: API_BASE_URL,
    retry,
  };
}

