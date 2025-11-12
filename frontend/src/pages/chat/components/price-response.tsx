import type { CryptoSummary } from '../../../types/crypto';

interface PriceResponseProps {
  data: CryptoSummary;
}

export function PriceResponse({ data }: PriceResponseProps) {
  const isPositive = data.price_change_percentage_24h >= 0;
  const marketCapIsPositive = data.market_cap_change_percentage_24h >= 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-5">
      {/* Header with description */}
      <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-4">
        <div className="flex items-center gap-4">
          <img
            src={data.image}
            alt={data.name}
            className="h-16 w-16 rounded-full border border-gray-700 bg-gray-950 p-2"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white">
              {data.market_cap_rank}. {data.name} ({data.symbol.toUpperCase()})
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Current market information and price details for {data.name}. This cryptocurrency is
              ranked #{data.market_cap_rank} by market capitalization.
            </p>
          </div>
        </div>
      </div>

      {/* Current Price & 24h Change */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">Current Price</p>
          <p className="mt-2 text-2xl font-bold text-white">
            ${data.current_price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Last updated: {formatDate(data.last_updated)}
          </p>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">24h Price Change</p>
          <p
            className={`mt-2 text-2xl font-bold ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? '+' : ''}
            {data.price_change_percentage_24h.toFixed(2)}%
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {isPositive ? 'Increased' : 'Decreased'} by{' '}
            {Math.abs(data.price_change_24h).toLocaleString(undefined, {
              maximumFractionDigits: 6,
            })}{' '}
            in 24 hours
          </p>
        </div>
      </div>

      {/* Market Cap & Volume */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">Market Capitalization</p>
          <p className="mt-2 text-xl font-semibold text-white">
            ${(data.market_cap / 1e9).toFixed(2)}B
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {marketCapIsPositive ? '+' : ''}
            {data.market_cap_change_percentage_24h.toFixed(2)}% (
            {marketCapIsPositive ? '+' : ''}
            ${(Math.abs(data.market_cap_change_24h) / 1e9).toFixed(2)}B) in 24h
          </p>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">24h Trading Volume</p>
          <p className="mt-2 text-xl font-semibold text-white">
            ${(data.total_volume / 1e6).toFixed(2)}M
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Total volume of trades in the last 24 hours
          </p>
        </div>
      </div>

      {/* 24h High & Low */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">24h High</p>
          <p className="mt-2 text-lg font-semibold text-emerald-300">
            ${data.high_24h.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </p>
          <p className="mt-1 text-xs text-gray-400">Highest price in the last 24 hours</p>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">24h Low</p>
          <p className="mt-2 text-lg font-semibold text-rose-300">
            ${data.low_24h.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </p>
          <p className="mt-1 text-xs text-gray-400">Lowest price in the last 24 hours</p>
        </div>
      </div>

      {/* All-Time High & Low */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">All-Time High</p>
          <p className="mt-2 text-lg font-semibold text-emerald-400">
            ${data.ath.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {data.ath_change_percentage.toFixed(2)}% from ATH
          </p>
          <p className="mt-1 text-xs text-gray-500">Reached: {formatDate(data.ath_date)}</p>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">All-Time Low</p>
          <p className="mt-2 text-lg font-semibold text-rose-400">
            ${data.atl.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {data.atl_change_percentage.toFixed(2)}% from ATL
          </p>
          <p className="mt-1 text-xs text-gray-500">Reached: {formatDate(data.atl_date)}</p>
        </div>
      </div>

      {/* Supply Information */}
      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
        <h4 className="mb-3 text-sm font-semibold text-indigo-200">Supply Information</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">Circulating Supply</p>
            <p className="mt-1 text-base font-semibold text-white">
              {data.circulating_supply.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="mt-1 text-xs text-gray-400">Currently in circulation</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">Total Supply</p>
            <p className="mt-1 text-base font-semibold text-white">
              {data.total_supply
                ? data.total_supply.toLocaleString(undefined, { maximumFractionDigits: 0 })
                : 'N/A'}
            </p>
            <p className="mt-1 text-xs text-gray-400">Total coins created</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">Max Supply</p>
            <p className="mt-1 text-base font-semibold text-white">
              {data.max_supply
                ? data.max_supply.toLocaleString(undefined, { maximumFractionDigits: 0 })
                : 'Unlimited'}
            </p>
            <p className="mt-1 text-xs text-gray-400">Maximum possible supply</p>
          </div>
        </div>
        {data.fully_diluted_valuation && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Fully Diluted Valuation
            </p>
            <p className="mt-1 text-base font-semibold text-white">
              ${(data.fully_diluted_valuation / 1e9).toFixed(2)}B
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Market cap if all coins were in circulation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
