
import React, { useState, useEffect } from 'react';
import { getConfig } from '@/services/aiService';
import LoginForm from '@/components/admin/LoginForm';
import Banner from '@/components/Banner';

interface AuthenticationGuardProps {
  children: React.ReactNode;
}

const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Load admin password for authentication
  useEffect(() => {
    const loadAdminPassword = async () => {
      try {
        const fullConfig = await getConfig();
        if (fullConfig && fullConfig.ADMIN_PASSWORD) {
          setAdminPassword(fullConfig.ADMIN_PASSWORD);
        }
      } catch (error) {
        console.error("Error loading admin password:", error);
      }
    };
    
    loadAdminPassword();
  }, []);

  const handleLogin = (password: string) => {
    if (adminPassword && password === adminPassword) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Falsches Passwort');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Banner subline="Admin Bereich" />
        <LoginForm onLogin={handleLogin} authError={authError} />
      </>
    );
  }

  return <>{children}</>;
};

export default AuthenticationGuard;
