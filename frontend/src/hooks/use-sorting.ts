import { useState, useMemo } from 'react';
import type { CryptoSummary } from '../types/crypto';

export type SortField = 'market_cap_rank' | 'market_cap' | 'current_price' | 'price_change_percentage_24h';
export type SortDirection = 'asc' | 'desc';

export function useSorting(cryptos: CryptoSummary[]) {
  const [sortField, setSortField] = useState<SortField>('market_cap_rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedCryptos = useMemo(() => {
    const sorted = [...cryptos];
    sorted.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortField) {
        case 'market_cap_rank':
          aValue = a.market_cap_rank;
          bValue = b.market_cap_rank;
          break;
        case 'market_cap':
          aValue = a.market_cap;
          bValue = b.market_cap;
          break;
        case 'current_price':
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case 'price_change_percentage_24h':
          aValue = a.price_change_percentage_24h;
          bValue = b.price_change_percentage_24h;
          break;
        default:
          return 0;
      }

      return sortDirection === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });

    return sorted;
  }, [cryptos, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with appropriate default direction
      // Market cap should default to descending (highest first)
      // Rank should default to ascending (lower rank = better)
      // Price and 24h% default to descending (highest first)
      const defaultDirection: SortDirection = 
        field === 'market_cap_rank' ? 'asc' : 'desc';
      setSortField(field);
      setSortDirection(defaultDirection);
    }
  };

  return {
    sortedCryptos,
    sortField,
    sortDirection,
    handleSort
  };
}

