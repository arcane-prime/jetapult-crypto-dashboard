import { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { CryptoSummary } from '../types/crypto';
import { useTopCryptos } from '../hooks/useTopCryptos';
import { useCryptoHistoricData } from '../hooks/useCryptoHistoricData';
import { DetailHeader } from './components/detail-header';
import { useUser } from '../context/user-context';
import { API_BASE_URL } from '../config/constants';

// Lazy load heavy components
const DetailMetrics = lazy(() =>
  import('./components/detail-metrics').then((module) => ({ default: module.DetailMetrics })),
);
const DetailCharts = lazy(() =>
  import('./components/detail-charts').then((module) => ({ default: module.DetailCharts })),
);
const DetailRecentSnapshots = lazy(() =>
  import('./components/detail-recent-snapshots').then((module) => ({
    default: module.DetailRecentSnapshots,
  })),
);

const TOP_N = 10;

type SortField = 'market_cap_rank' | 'market_cap' | 'current_price' | 'price_change_percentage_24h';
type SortDirection = 'asc' | 'desc';

export default function Dashboard() {
  const { cryptos, isLoading, error, retry } = useTopCryptos(TOP_N);
  const { user, setUser } = useUser();
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoSummary | null>(null);
  const [sortField, setSortField] = useState<SortField>('market_cap_rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Remove token from URL if present and fetch user data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('token')) {
      const token = urlParams.get('token');
      if (token) {
        // Store token if not already stored
        if (!localStorage.getItem('token')) {
          localStorage.setItem('token', token);
        }
        // Clean URL
        window.history.replaceState({}, '', '/dashboard');
      }
    }

    // Fetch user data if logged in
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token && !user) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
              setUser(data.user);
              setFavorites(data.user.favoriteCryptos || []);
            }
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      } else if (user) {
        // Update favorites from user context
        setFavorites(user.favoriteCryptos || []);
      }
    };

    fetchUserData();
  }, [user, setUser]);

  // Sort cryptos based on selected field and direction
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

  // Set first crypto as selected by default when cryptos load
  useEffect(() => {
    if (cryptos.length > 0 && !selectedCrypto) {
      setSelectedCrypto(cryptos[0]);
    }
  }, [cryptos, selectedCrypto]);

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

  const toggleFavorite = async (e: React.MouseEvent, cryptoId: string) => {
    e.stopPropagation(); // Prevent row click
    
    const token = localStorage.getItem('token');
    if (!token) {
      // User not logged in, can't favorite
      return;
    }

    const isFavorite = favorites.includes(cryptoId);
    
    try {
      const url = isFavorite 
        ? `${API_BASE_URL}/auth/favorites/${cryptoId}`
        : `${API_BASE_URL}/auth/favorites`;
      
      const options: RequestInit = {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (!isFavorite) {
        options.body = JSON.stringify({ cryptoId });
      }

      const response = await fetch(url, options);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFavorites(data.favoriteCryptos || []);
          // Update user context
          if (user) {
            setUser({ ...user, favoriteCryptos: data.favoriteCryptos || [] });
          }
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const {
    historicData,
    isLoading: historicLoading,
    error: historicError,
    dailySnapshots,
    priceSeries30Days,
    marketCapSeries30Days,
  } = useCryptoHistoricData(selectedCrypto?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-6">
        <p className="text-sm font-medium text-indigo-200">Loading top cryptocurrencies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-6">
        <div className="rounded-3xl border border-rose-700 bg-rose-900/20 p-8 text-center max-w-md">
          <p className="text-lg font-semibold text-rose-300 mb-2">Error Loading Data</p>
          <p className="text-sm text-rose-200/80 mb-6">{error}</p>
          <button
            onClick={retry}
            className="rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        {/* Header */}
        <header className="rounded-3xl border border-gray-700 bg-gray-900/60 p-6 shadow-2xl shadow-gray-900/40 backdrop-blur">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold sm:text-4xl">Crypto Dashboard</h1>
            <Link
              to="/chat"
              className="rounded-lg border border-indigo-500/50 bg-indigo-600/20 px-5 py-2.5 text-sm font-medium text-indigo-200 transition hover:bg-indigo-600/30 hover:text-indigo-100"
            >
              💬 Chat
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {/* Crypto Table - Left Side */}
          <div className="lg:col-span-1 flex">
            <div className="flex flex-col w-full rounded-3xl border border-gray-700 bg-gray-900/60 p-4 shadow-2xl shadow-gray-900/30 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-indigo-200">Top {TOP_N} Cryptocurrencies</h2>
              </div>
              
              {/* Sort Buttons */}
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  onClick={() => handleSort('market_cap_rank')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    sortField === 'market_cap_rank'
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  Rank {sortField === 'market_cap_rank' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('market_cap')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    sortField === 'market_cap'
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  Market Cap {sortField === 'market_cap' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('current_price')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    sortField === 'current_price'
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  Price {sortField === 'current_price' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('price_change_percentage_24h')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    sortField === 'price_change_percentage_24h'
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  24h % {sortField === 'price_change_percentage_24h' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-hide">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-900/95 backdrop-blur-sm">
                    <tr className="border-b border-gray-800">
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                        #
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Coin
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Price
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                        24h %
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Volume
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-400 w-12">
                        ♥
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCryptos.map((crypto) => {
                      const isSelected = selectedCrypto?.id === crypto.id;
                      const isPositive = crypto.price_change_percentage_24h >= 0;
                      const isFavorite = favorites.includes(crypto.id);
                      const token = localStorage.getItem('token');
                      
                      return (
                        <tr
                          key={crypto.id}
                          onClick={() => setSelectedCrypto(crypto)}
                          className={`cursor-pointer border-b border-gray-800/50 transition ${
                            isSelected
                              ? 'bg-indigo-500/20 hover:bg-indigo-500/30'
                              : 'hover:bg-gray-800/50'
                          }`}
                        >
                          <td className="px-3 py-3 text-xs font-medium text-gray-400">
                            {crypto.market_cap_rank}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={crypto.image}
                                alt={crypto.name}
                                className="h-8 w-8 rounded-full border border-gray-700 bg-gray-950 p-1"
                              />
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-white truncate">
                                  {crypto.name}
                                </div>
                                <div className="text-xs uppercase tracking-wider text-gray-500">
                                  {crypto.symbol}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-right text-sm font-semibold text-white">
                            ${crypto.current_price.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                          </td>
                          <td
                            className={`px-3 py-3 text-right text-sm font-medium ${
                              isPositive ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isPositive ? '+' : ''}
                            {crypto.price_change_percentage_24h.toFixed(2)}%
                          </td>
                          <td className="px-3 py-3 text-right text-xs text-gray-400">
                            ${(crypto.total_volume / 1e6).toFixed(2)}M
                          </td>
                          <td className="px-3 py-3 text-center">
                            {token ? (
                              <button
                                onClick={(e) => toggleFavorite(e, crypto.id)}
                                className={`transition-transform hover:scale-110 ${
                                  isFavorite ? 'text-rose-500' : 'text-gray-500 hover:text-rose-400'
                                }`}
                                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                              >
                                {isFavorite ? '♥' : '♡'}
                              </button>
                            ) : (
                              <span className="text-gray-600" title="Login to favorite">
                                ♡
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Details Section - Right Side */}
          <div className="lg:col-span-2 flex">
            {selectedCrypto ? (
              <div className="flex flex-col w-full rounded-3xl border border-gray-700 bg-gray-900/60 p-6 shadow-2xl shadow-gray-900/40 backdrop-blur">
                <DetailHeader crypto={selectedCrypto} />

                {historicLoading && (
                  <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900/60 p-6 text-center text-indigo-300">
                    Fetching market history…
                  </div>
                )}

                {historicError && !historicLoading && (
                  <div className="mt-6 rounded-2xl border border-rose-700 bg-rose-900/20 p-6">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-rose-300 mb-2">
                        Error Loading Market History
                      </p>
                      <p className="text-xs text-rose-200/80 mb-4">{historicError}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-rose-700"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}

                {!historicLoading && !historicError && historicData && (
                  <div className="mt-6 space-y-6">
                    <Suspense
                      fallback={
                        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 text-center text-indigo-300">
                          Loading metrics...
                        </div>
                      }
                    >
                      <DetailMetrics historicData={historicData} />
                    </Suspense>
                    <Suspense
                      fallback={
                        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 text-center text-indigo-300">
                          Loading charts...
                        </div>
                      }
                    >
                      <DetailCharts
                        priceSeries={priceSeries30Days}
                        marketCapSeries={marketCapSeries30Days}
                      />
                    </Suspense>
                  </div>
                )}

                <footer className="mt-6 text-sm text-gray-400">
                  Last updated{' '}
                  <span className="font-mono text-indigo-200">
                    {new Date(selectedCrypto.last_updated).toLocaleString()}
                  </span>
                </footer>
              </div>
            ) : (
              <div className="rounded-3xl border border-gray-700 bg-gray-900/60 p-12 text-center shadow-2xl shadow-gray-900/40 backdrop-blur">
                <p className="text-gray-400">Select a cryptocurrency to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* 30-Day Closing Summary - Full Width Below */}
        {selectedCrypto && !historicLoading && !historicError && dailySnapshots.length > 0 && (
          <div className="w-full">
            <Suspense
              fallback={
                <div className="rounded-3xl border border-gray-700 bg-gray-900/60 p-6 text-center text-indigo-300 shadow-2xl shadow-gray-900/40 backdrop-blur">
                  Loading 30-day summary...
                </div>
              }
            >
              <DetailRecentSnapshots snapshots={dailySnapshots} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}

