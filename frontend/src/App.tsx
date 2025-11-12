import './App.css';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard';

// Lazy load chat page since it's a separate route
const ChatPage = lazy(() => import('./pages/chat'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route
        path="/chat"
        element={
          <Suspense
            fallback={
              <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <p className="text-sm font-medium text-indigo-200">Loading chat...</p>
              </div>
            }
          >
            <ChatPage />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
