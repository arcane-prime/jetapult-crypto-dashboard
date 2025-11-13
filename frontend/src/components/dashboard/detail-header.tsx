import type { CryptoSummary } from '../../types/crypto';

interface DetailHeaderProps {
  crypto: CryptoSummary;
}

export function DetailHeader({ crypto }: DetailHeaderProps) {
  return (
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
  );
}

