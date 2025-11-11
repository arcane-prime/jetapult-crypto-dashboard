import { useMemo } from 'react';
import type { CryptoHistoricData } from '../../../types/crypto';

type NumericPoint = [number, number];

interface DetailMetricsProps {
  historicData: CryptoHistoricData;
}

export function DetailMetrics({ historicData }: DetailMetricsProps) {
  const latestPricePoint = useMemo<NumericPoint | null>(
    () => historicData.prices.at(-1) ?? null,
    [historicData],
  );

  const earliestPricePoint = useMemo<NumericPoint | null>(
    () => historicData.prices[0] ?? null,
    [historicData],
  );

  const priceDelta = useMemo(() => {
    if (!latestPricePoint || !earliestPricePoint) {
      return null;
    }
    return latestPricePoint[1] - earliestPricePoint[1];
  }, [earliestPricePoint, latestPricePoint]);

  const lastMarketCapPoint = useMemo<NumericPoint | null>(
    () => historicData.market_caps.at(-1) ?? null,
    [historicData],
  );

  const lastVolumePoint = useMemo<NumericPoint | null>(
    () => historicData.total_volumes.at(-1) ?? null,
    [historicData],
  );

  const formatCurrency = (value: number | null | undefined) =>
    value == null ? '—' : `$${value.toLocaleString()}`;

  const formatDateTime = (timestamp: number) =>
    new Date(timestamp).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <section className="grid gap-6 sm:grid-cols-2">
      <DetailMetric
        label="Latest Price"
        value={latestPricePoint ? formatCurrency(latestPricePoint[1]) : 'Not available'}
        helper={latestPricePoint ? formatDateTime(latestPricePoint[0]) : undefined}
      />
      <DetailMetric
        label="Market Cap"
        value={lastMarketCapPoint ? formatCurrency(lastMarketCapPoint[1]) : 'Not available'}
        helper={lastMarketCapPoint ? formatDateTime(lastMarketCapPoint[0]) : undefined}
      />
      <DetailMetric
        label="24h Volume"
        value={lastVolumePoint ? formatCurrency(lastVolumePoint[1]) : 'Not available'}
        helper={lastVolumePoint ? formatDateTime(lastVolumePoint[0]) : undefined}
      />
      <DetailMetric
        label="Trend (period span)"
        value={
          priceDelta == null
            ? 'Not available'
            : `${priceDelta >= 0 ? '+' : ''}${priceDelta.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}`
        }
        valueClass={
          priceDelta == null ? undefined : priceDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
        }
        helper={
          priceDelta == null || !earliestPricePoint
            ? undefined
            : `From ${formatDateTime(earliestPricePoint[0])}`
        }
      />
    </section>
  );
}

interface DetailMetricProps {
  label: string;
  value: string;
  valueClass?: string;
  helper?: string;
}

function DetailMetric({ label, value, valueClass, helper }: DetailMetricProps) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-6 shadow-inner">
      <dt className="text-xs uppercase tracking-widest text-gray-500">{label}</dt>
      <dd className={`mt-2 text-xl font-semibold ${valueClass ?? 'text-white'}`}>{value}</dd>
      {helper && <p className="mt-2 text-xs text-gray-500">{helper}</p>}
    </div>
  );
}

