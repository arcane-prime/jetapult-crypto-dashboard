import type { CryptoSummary } from '../types/crypto';
import CryptoCard from './crypto-card';

interface CryptoGridProps {
  cryptos: CryptoSummary[];
}

export default function CryptoGrid({ cryptos }: CryptoGridProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 max-w-[1200px] mx-auto px-4">
      {cryptos.map((crypto) => (
        <CryptoCard key={crypto.id} crypto={crypto} />
      ))}
    </div>
  );
}
