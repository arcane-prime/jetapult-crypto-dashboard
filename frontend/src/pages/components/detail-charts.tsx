import { useMemo } from 'react';

type NumericPoint = [number, number];

interface DetailChartsProps {
  priceSeries: NumericPoint[];
  marketCapSeries: NumericPoint[];
}

export function DetailCharts({ priceSeries, marketCapSeries }: DetailChartsProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <LineChart
        title="Price History"
        points={priceSeries}
        yLabel="Price (USD)"
        gradientId="priceGradient"
        lineColor="rgba(99, 102, 241, 1)"
        areaColor="rgba(99, 102, 241, 0.25)"
      />
      <LineChart
        title="Market Cap History"
        points={marketCapSeries}
        yLabel="Market Cap (USD)"
        gradientId="marketCapGradient"
        lineColor="rgba(20, 184, 166, 1)"
        areaColor="rgba(20, 184, 166, 0.25)"
      />
    </section>
  );
}

interface LineChartProps {
  title: string;
  points: NumericPoint[];
  yLabel: string;
  gradientId: string;
  lineColor: string;
  areaColor: string;
}

function LineChart({ title, points, yLabel, gradientId, lineColor, areaColor }: LineChartProps) {
  const chartPoints = useMemo(() => {
    if (!points.length) {
      return [];
    }

    // Use all points (30 days) - no need to limit since we're fetching exactly 30 days
    return points.map(([timestamp, value]) => ({ timestamp, value }));
  }, [points]);

  const chartMeta = useMemo(() => {
    if (!chartPoints.length) {
      return null;
    }

    const values = chartPoints.map((point) => point.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;

    const width = 640;
    const height = 240;

    const path = chartPoints
      .map((point, idx) => {
        const x =
          chartPoints.length === 1
            ? width / 2
            : (idx / (chartPoints.length - 1)) * width;
        const y = height - ((point.value - minValue) / valueRange) * height;
        const command = idx === 0 ? 'M' : 'L';
        return `${command}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');

    const areaPath = `${path} L${width},${height} L0,${height} Z`;

    return {
      path,
      areaPath,
      width,
      height,
      minValue,
      maxValue,
      firstTimestamp: chartPoints[0]?.timestamp ?? null,
      lastTimestamp: chartPoints.at(-1)?.timestamp ?? null,
    };
  }, [chartPoints]);

  if (!chartMeta) {
    return (
      <div className="rounded-3xl border border-gray-800 bg-gray-900/70 p-6 shadow-inner">
        <h2 className="text-lg font-semibold text-indigo-200">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">No data available.</p>
      </div>
    );
  }

  const {
    path,
    areaPath,
    width,
    height,
    minValue,
    maxValue,
    firstTimestamp,
    lastTimestamp,
  } = chartMeta;

  const formatValue = (value: number) =>
    value.toLocaleString(undefined, { maximumFractionDigits: 2 });

  const formatTimestamp = (timestamp: number | null) =>
    timestamp == null
      ? '—'
      : new Date(timestamp).toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

  return (
    <div className="rounded-3xl border border-gray-800 bg-gray-900/70 p-6 shadow-inner">
      <h2 className="text-lg font-semibold text-indigo-200">{title}</h2>
      <p className="mt-1 text-xs uppercase tracking-widest text-gray-500">
        {yLabel}
      </p>
      <div className="mt-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${title} line chart`}
          className="w-full"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={areaColor} />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="rgba(15,23,42,0.35)"
            rx="16"
          />
          <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
          <path
            d={path}
            fill="none"
            stroke={lineColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div>
          <p>Min: {formatValue(minValue)}</p>
          <p>Max: {formatValue(maxValue)}</p>
        </div>
        <div className="text-right">
          <p>From: {formatTimestamp(firstTimestamp)}</p>
          <p>To: {formatTimestamp(lastTimestamp)}</p>
        </div>
      </div>
    </div>
  );
}

