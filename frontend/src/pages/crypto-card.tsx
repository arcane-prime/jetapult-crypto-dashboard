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
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-2xl"
      aria-label={`View details for ${crypto.name}`}
    >
      <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col gap-6 transition-transform duration-150 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
        <div className="flex items-center gap-6">
          <img
            src={crypto.image}
            alt={crypto.name}
            className="w-16 h-16 rounded-full p-2"
            style={{
              background:
                'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(59,130,246,0.15))',
            }}
          />
          <div>
            <h3 className="m-0 text-xl font-semibold text-gray-800">{crypto.name}</h3>
            <p className="mt-1 text-sm uppercase tracking-wider text-gray-500">
              {crypto.symbol}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <dt className="text-sm uppercase tracking-widest text-gray-400">Price</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-800">
              ${crypto.current_price.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-widest text-gray-400">Change</dt>
            <dd
              className={`mt-1 text-lg font-semibold ${
                crypto.price_change_24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {crypto.price_change_24h.toFixed(2)}%
            </dd>
          </div>
        </div>
      </div>
    </Link>
  );
}
