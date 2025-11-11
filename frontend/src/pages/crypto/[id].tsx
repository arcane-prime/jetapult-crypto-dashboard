import { useLocation, useParams } from 'react-router-dom';
import type { CryptoSummary } from '../../types/crypto';

export default function CryptoDetailPage() {
  const params = useParams();
  const { id } = params;
  const location = useLocation();
  const crypto = (location.state as { crypto?: CryptoSummary } | null)?.crypto;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 rounded-3xl border border-gray-700 bg-gray-900/60 p-8 shadow-2xl shadow-gray-900/40 backdrop-blur">
        <header className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="h-20 w-20 rounded-full border border-gray-700 bg-gray-950 p-3"
            />
            <div>
              <h1 className="text-3xl font-semibold">
                {crypto.market_cap_rank}. {crypto.name}
              </h1>
              <p className="text-sm uppercase tracking-widest text-indigo-300">
                {crypto.symbol}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 sm:grid-cols-2">
          <DetailMetric label="Current Price" value={`$${crypto.current_price.toLocaleString()}`} />
          <DetailMetric label="Market Cap" value={`$${crypto.market_cap.toLocaleString()}`} />
          <DetailMetric
            label="24h Change"
            value={`${crypto.price_change_percentage_24h.toFixed(2)}%`}
            valueClass={
              crypto.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }
          />
          <DetailMetric label="Total Volume" value={`$${crypto.total_volume.toLocaleString()}`} />
          <DetailMetric label="High (24h)" value={`$${crypto.high_24h.toLocaleString()}`} />
          <DetailMetric label="Low (24h)" value={`$${crypto.low_24h.toLocaleString()}`} />
        </section>

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

interface DetailMetricProps {
  label: string;
  value: string;
  valueClass?: string;
}

function DetailMetric({ label, value, valueClass }: DetailMetricProps) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-6 shadow-inner">
      <dt className="text-xs uppercase tracking-widest text-gray-500">{label}</dt>
      <dd className={`mt-2 text-xl font-semibold ${valueClass ?? 'text-white'}`}>{value}</dd>
    </div>
  );
}
