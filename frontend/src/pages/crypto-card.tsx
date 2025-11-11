import { Link } from 'react-router-dom';
import type { CryptoSummary } from '../types/crypto';

interface CryptoCardProps {
  crypto: CryptoSummary;
}

export default function CryptoCard({ crypto }: CryptoCardProps) {
  return (
    <Link
      to={`/crypto/${crypto.id}`}
      state={{ crypto }}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded-3xl"
      aria-label={`View details for ${crypto.name}`}
    >
      <div className="rounded-3xl border border-gray-800 bg-gray-900/70 p-8 shadow-lg shadow-gray-900/40 backdrop-blur transition duration-200 ease-out group-hover:-translate-y-2 group-hover:border-indigo-500/60 group-hover:shadow-indigo-900/40">
        <div className="flex items-center gap-6">
          <img
            src={crypto.image}
            alt={crypto.name}
            className="h-16 w-16 rounded-full border border-indigo-500/40 bg-gray-950 p-3 transition group-hover:border-indigo-400 group-hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]"
          />
          <div>
            <h3 className="m-0 text-xl font-semibold text-white">{crypto.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.45em] text-indigo-200">
              {crypto.symbol}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <dt className="text-xs uppercase tracking-widest text-gray-400">Price</dt>
            <dd className="mt-1 text-lg font-semibold text-white">
              ${crypto.current_price.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-gray-400">24h Change</dt>
            <dd
              className={`mt-1 text-lg font-semibold ${
                crypto.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </dd>
          </div>
        </div>
      </div>
    </Link>
  );
}
