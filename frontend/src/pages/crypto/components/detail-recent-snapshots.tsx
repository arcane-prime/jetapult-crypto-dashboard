import type { Snapshot } from '../../../hooks/useCryptoHistoricData';

interface DetailRecentSnapshotsProps {
  snapshots: Snapshot[];
}

export function DetailRecentSnapshots({ snapshots }: DetailRecentSnapshotsProps) {
  return (
    <section className="rounded-3xl border border-gray-800 bg-gray-900/70 p-6 shadow-inner">
      <header className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-indigo-200">30-Day Closing Summary</h2>
          <p className="text-sm text-gray-400">
            End-of-day price and market cap pulled from the historic dataset.
          </p>
        </div>
        <p className="text-xs uppercase tracking-widest text-gray-500">
          Most recent first · {snapshots.length} days
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {snapshots.map((snapshot) => (
          <article
            key={snapshot.date}
            className="rounded-2xl border border-gray-800 bg-gray-900/80 p-4 shadow-lg shadow-gray-900/20 transition hover:-translate-y-0.5 hover:shadow-gray-900/40"
          >
            <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-gray-500">
              {snapshot.date}
            </h3>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-xs uppercase tracking-wider text-indigo-200">Closing Price</dt>
                <dd className="mt-1 text-lg font-semibold text-white">
                  {formatCurrency(snapshot.price)}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-emerald-200">
                  Closing Market Cap
                </dt>
                <dd className="mt-1 text-lg font-semibold text-white">
                  {formatCurrency(snapshot.marketCap)}
                </dd>
              </div>
            </dl>
          </article>
        ))}
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

