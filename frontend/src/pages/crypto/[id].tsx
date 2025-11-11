import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useCryptoHistoricData } from '../../hooks/useCryptoHistoricData';
import type { CryptoSummary } from '../../types/crypto';
import { DetailHeader } from './components/detail-header';
import { DetailMetrics } from './components/detail-metrics';
import { DetailCharts } from './components/detail-charts';
import { DetailRecentSnapshots } from './components/detail-recent-snapshots';

type NumericPoint = [number, number];

export default function CryptoDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const crypto = (location.state as { crypto?: CryptoSummary } | null)?.crypto;
  const {
    historicData,
    isLoading: historicLoading,
    error: historicError,
    dailySnapshots,
  } = useCryptoHistoricData(id);

  if (!crypto) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
        <div className="bg-gray-800 rounded-xl p-8 shadow-xl max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Crypto Details</h1>
          <p className="text-gray-300 mb-4">
            Could not find details for <span className="font-mono text-indigo-300">{id}</span>.
          </p>
          <p className="text-gray-500">
            Try navigating from the homepage or implement a fallback fetch for direct visits.
          </p>
        </div>
      </div>
    );
  }

  const priceSeries = useMemo<NumericPoint[]>(() => historicData?.prices ?? [], [historicData]);

  const marketCapSeries = useMemo<NumericPoint[]>(
    () => historicData?.market_caps ?? [],
    [historicData],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 rounded-3xl border border-gray-700 bg-gray-900/60 p-8 shadow-2xl shadow-gray-900/40 backdrop-blur">
        <DetailHeader crypto={crypto} />

        {historicLoading && (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 text-center text-indigo-300">
            Fetching market history…
          </div>
        )}

        {historicError && !historicLoading && (
          <div className="rounded-2xl border border-rose-700 bg-rose-900/40 p-6 text-center text-rose-200">
            Failed to load market history: {historicError}
          </div>
        )}

        {!historicLoading && !historicError && historicData && (
          <>
            <DetailMetrics historicData={historicData} />
            <DetailCharts priceSeries={priceSeries} marketCapSeries={marketCapSeries} />
            <DetailRecentSnapshots snapshots={dailySnapshots} />
          </>
        )}

        <footer className="text-sm text-gray-400">
          Last updated{' '}
          <span className="font-mono text-indigo-200">
            {new Date(crypto.last_updated).toLocaleString()}
          </span>
        </footer>
      </div>
    </div>
  );
}

