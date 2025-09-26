import React from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}