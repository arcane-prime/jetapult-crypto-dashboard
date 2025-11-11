import type { CryptoSummary } from '../types/crypto';
import CryptoGrid from './crypto-grid';

interface LandingPageProps {
  cryptos: CryptoSummary[];
  isLoading: boolean;
  error: string | null;
}

export default function LandingPage({ cryptos, isLoading, error }: LandingPageProps) {
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
        <p className="text-sm font-medium text-rose-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-14 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="rounded-3xl border border-gray-700 bg-gray-900/60 p-10 shadow-2xl shadow-gray-900/40 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.6em] text-indigo-200">Market Overview</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Top Cryptocurrencies</h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-400">
            Explore the market leaders by market cap. Tap any card to open a detailed view with
            rich historic pricing and market metrics.
          </p>
        </header>

        <section className="rounded-3xl border border-gray-700 bg-gray-900/60 p-6 shadow-2xl shadow-gray-900/30 backdrop-blur">
          <CryptoGrid cryptos={cryptos} />
        </section>
      </div>
    </div>
  );
}
