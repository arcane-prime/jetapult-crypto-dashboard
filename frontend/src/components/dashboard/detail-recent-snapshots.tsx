import { useState } from 'react';
import type { Snapshot } from '../../hooks/use-crypto-historic-data';

interface DetailRecentSnapshotsProps {
  snapshots: Snapshot[];
}

export function DetailRecentSnapshots({ snapshots }: DetailRecentSnapshotsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <section className="rounded-3xl border border-gray-800 bg-gray-900/70 p-6 shadow-inner">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-indigo-200">30-Day Closing Summary</h2>
            <p className="mt-1 text-sm text-gray-400">
              View daily closing prices and market caps for the last 30 days
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="rounded-lg border border-indigo-500/50 bg-indigo-600/20 px-5 py-2.5 text-sm font-medium text-indigo-200 transition hover:bg-indigo-600/30 hover:text-indigo-100"
          >
            Show
          </button>
        </header>
      </section>
    );
  }

  // Separate prices and market caps
  const priceSnapshots = snapshots.filter((s) => s.price !== null);
  const marketCapSnapshots = snapshots.filter((s) => s.marketCap !== null);

  return (
    <section className="rounded-3xl border border-gray-800 bg-gray-900/70 p-6 shadow-inner">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-indigo-200">30-Day Closing Summary</h2>
          <p className="mt-1 text-sm text-gray-400">
            End-of-day closing prices and market caps ({snapshots.length} days)
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="rounded-lg border border-gray-600 bg-gray-700/50 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-700"
        >
          Hide
        </button>
      </header>

      <div className="space-y-6">
        {/* Closing Prices Grid */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-200">
            Closing Prices
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {priceSnapshots.map((snapshot) => (
              <article
                key={`price-${snapshot.date}`}
                className="rounded-xl border border-indigo-800/50 bg-indigo-900/20 p-4 shadow-lg shadow-indigo-900/10 transition hover:border-indigo-700/50 hover:shadow-indigo-900/20"
              >
                <h4 className="font-mono text-xs uppercase tracking-wider text-indigo-300/70">
                  {snapshot.date}
                </h4>
                <p className="mt-2 break-words text-lg font-semibold text-indigo-200">
                  {formatCurrency(snapshot.price)}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Market Caps Grid */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-emerald-200">
            Closing Market Caps
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {marketCapSnapshots.map((snapshot) => (
              <article
                key={`marketcap-${snapshot.date}`}
                className="rounded-xl border border-emerald-800/50 bg-emerald-900/20 p-4 shadow-lg shadow-emerald-900/10 transition hover:border-emerald-700/50 hover:shadow-emerald-900/20"
              >
                <h4 className="font-mono text-xs uppercase tracking-wider text-emerald-300/70">
                  {snapshot.date}
                </h4>
                <p className="mt-2 break-words text-base font-semibold text-emerald-200">
                  {formatMarketCap(snapshot.marketCap)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function formatCurrency(value: number | null): string {
  if (value == null) {
    return '—';
  }
  return `$${value.toLocaleString()}`;
}

function formatMarketCap(value: number | null): string {
  if (value == null) {
    return '—';
  }
  // Format large numbers in billions/trillions for better readability
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return `$${value.toLocaleString()}`;
}

