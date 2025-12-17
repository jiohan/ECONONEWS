import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      {isAuthenticated ? (
        <Dashboard onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <LandingPage onLogin={() => setIsAuthenticated(true)} />
      )}
    </QueryClientProvider>
  );
};

export default App;