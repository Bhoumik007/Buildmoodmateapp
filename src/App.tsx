import { useState, useEffect } from 'react';
import { Toaster } from 'sonner@2.0.3';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/Auth/LoginPage';
import { SignupPage } from './components/Auth/SignupPage';
import { ForgotPasswordPage } from './components/Auth/ForgotPasswordPage';
import { Dashboard } from './components/Dashboard/Dashboard';
import { supabase } from './lib/supabase';

type Page = 'landing' | 'login' | 'signup' | 'forgot-password' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [accessToken, setAccessToken] = useState<string>('');
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        setAccessToken(session.access_token);
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setCheckingSession(false);
    }
  };

  const handleLoginSuccess = (token: string) => {
    setAccessToken(token);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setAccessToken('');
    setCurrentPage('landing');
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      
      {currentPage === 'landing' && (
        <LandingPage onGetStarted={() => setCurrentPage('login')} />
      )}

      {currentPage === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setCurrentPage('signup')}
          onForgotPassword={() => setCurrentPage('forgot-password')}
        />
      )}

      {currentPage === 'signup' && (
        <SignupPage
          onSignupSuccess={() => setCurrentPage('login')}
          onSwitchToLogin={() => setCurrentPage('login')}
        />
      )}

      {currentPage === 'forgot-password' && (
        <ForgotPasswordPage
          onBackToLogin={() => setCurrentPage('login')}
        />
      )}

      {currentPage === 'dashboard' && accessToken && (
        <Dashboard
          accessToken={accessToken}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
