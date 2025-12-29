import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

const queryClient = new QueryClient();

import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const { user, login, logout, isLoading } = useAuth();
  // We can keep local state for "demo" login if needed, or rely solely on auth context.
  // The original code had local state. Let's merge them.
  // Actually, if user logs in via Google, `user` object is present.
  // If user clicks "Log In" (demo), we can still support that or replace it.
  // For now, let's wire Google Login.

  if (isLoading) {
    return <div className="min-h-screen bg-[#101622] flex items-center justify-center text-white">Loading...</div>;
  }

  return user ? (
    <Dashboard onLogout={logout} />
  ) : (
    <LandingPage onLogin={login} onGoogleLogin={login} />
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;