import './App.css';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landing-page';
import CryptoDetailPage from './pages/crypto/[id]';
import { useTopCryptos } from './hooks/useTopCryptos';

const TOP_N = 10;

function App() {
  const { cryptos, isLoading, error } = useTopCryptos(TOP_N);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage cryptos={cryptos} isLoading={isLoading} error={error} />
        }
      />
      <Route path="/crypto/:id" element={<CryptoDetailPage />} />
    </Routes>
  );
}

export default App;
