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
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-w-screen min-h-screen w-full py-8">
      <CryptoGrid cryptos={cryptos} />
    </div>
  );
}
