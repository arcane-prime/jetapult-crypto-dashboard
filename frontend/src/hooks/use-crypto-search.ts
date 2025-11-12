import { useState } from 'react';
import { API_BASE_URL } from '../config/constants';
import type { SearchResponse } from '../types/crypto';

interface UseCryptoSearchResult {
  search: (query: string) => Promise<void>;
  response: SearchResponse;
  isLoading: boolean;
  error: string | null;
}

export function useCryptoSearch(): UseCryptoSearchResult {
  const [response, setResponse] = useState<SearchResponse>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const url = `${API_BASE_URL}/crypto/search?query=${encodeURIComponent(query)}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      let message = 'Failed to search';
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
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    search,
    response,
    isLoading,
    error,
  };
}

