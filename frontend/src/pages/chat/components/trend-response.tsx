import type { CryptoTrendResponse } from '../../../types/crypto';

interface TrendResponseProps {
  data: CryptoTrendResponse;
}

export function TrendResponse({ data }: TrendResponseProps) {
  const latestPrice = data.prices[data.prices.length - 1];
  const earliestPrice = data.prices[0];
  const priceChange =
    latestPrice && earliestPrice ? latestPrice.value - earliestPrice.value : null;
  const priceChangePercent =
    priceChange && earliestPrice ? (priceChange / earliestPrice.value) * 100 : null;

  const latestMarketCap = data.market_caps[data.market_caps.length - 1];
  const earliestMarketCap = data.market_caps[0];
  const marketCapChange =
    latestMarketCap && earliestMarketCap
      ? latestMarketCap.value - earliestMarketCap.value
      : null;
  const marketCapChangePercent =
    marketCapChange && earliestMarketCap
      ? (marketCapChange / earliestMarketCap.value) * 100
      : null;

  const daysCount = data.prices.length;
  const cryptoName = data.id.charAt(0).toUpperCase() + data.id.slice(1);

  return (
    <div className="space-y-6">
      {/* Header with description */}
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
        <h3 className="mb-2 text-xl font-semibold text-white capitalize">{cryptoName}</h3>
        <p className="text-sm text-gray-400">
          Historical price and market cap data for the last {daysCount} days. This shows the
          end-of-day closing prices and market capitalizations, giving you a clear view of the
          trend over this period.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
        <h4 className="mb-4 text-sm font-semibold text-indigo-200">Period Summary</h4>

        {latestPrice && earliestPrice && (
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Latest Price</p>
              <p className="mt-2 text-2xl font-bold text-white">
                ${latestPrice.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                As of {new Date(latestPrice.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>

            {priceChangePercent !== null && (
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Price Change ({daysCount} days)
                </p>
                <p
                  className={`mt-2 text-2xl font-bold ${
                    priceChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {priceChangePercent >= 0 ? '+' : ''}
                  {priceChangePercent.toFixed(2)}%
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {priceChangePercent >= 0 ? 'Increased' : 'Decreased'} by{' '}
                  {Math.abs(priceChange || 0).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{' '}
                  from {earliestPrice.date} to {latestPrice.date}
                </p>
              </div>
            )}
          </div>
        )}

        {latestMarketCap && earliestMarketCap && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Latest Market Cap</p>
              <p className="mt-2 text-xl font-semibold text-white">
                ${(latestMarketCap.value / 1e9).toFixed(2)}B
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Current market capitalization value
              </p>
            </div>

            {marketCapChange !== null && marketCapChangePercent !== null && (
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Market Cap Change ({daysCount} days)
                </p>
                <p className="mt-2 text-xl font-semibold text-white">
                  {marketCapChange >= 0 ? '+' : ''}
                  {marketCapChangePercent.toFixed(2)}%
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {marketCapChange >= 0 ? 'Increased' : 'Decreased'} by{' '}
                  ${(Math.abs(marketCapChange) / 1e9).toFixed(2)}B over this period
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Price History */}
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-indigo-200">Price History</h4>
            <span className="text-xs text-gray-500">{data.prices.length} data points</span>
          </div>
          <p className="mb-3 text-xs text-gray-400">
            Daily closing prices showing the price trend over the selected period. Each value
            represents the end-of-day price for that date.
          </p>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {data.prices.map((point) => (
              <div
                key={point.date}
                className="flex items-center justify-between rounded border border-gray-700/50 bg-gray-900/50 px-3 py-2 transition hover:bg-gray-900/70"
              >
                <span className="text-sm text-gray-300">
                  {new Date(point.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="font-mono text-sm font-semibold text-white">
                  ${point.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Market Cap History */}
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-emerald-200">Market Cap History</h4>
            <span className="text-xs text-gray-500">{data.market_caps.length} data points</span>
          </div>
          <p className="mb-3 text-xs text-gray-400">
            Daily market capitalization values showing how the total market value has changed over
            time. Market cap is calculated as price × circulating supply.
          </p>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {data.market_caps.map((point) => (
              <div
                key={point.date}
                className="flex items-center justify-between rounded border border-gray-700/50 bg-gray-900/50 px-3 py-2 transition hover:bg-gray-900/70"
              >
                <span className="text-sm text-gray-300">
                  {new Date(point.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="font-mono text-sm font-semibold text-white">
                  ${(point.value / 1e9).toFixed(2)}B
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
