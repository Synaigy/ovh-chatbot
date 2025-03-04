
import React, { useEffect } from 'react';
import { getConfig } from '@/services/aiService';
import { loadConfiguration } from '@/services/configService';
import Banner from '@/components/Banner';
import AuthenticationGuard from '@/components/admin/AuthenticationGuard';
import CounterDisplay from '@/components/admin/CounterDisplay';
import ConfigSections from '@/components/admin/ConfigSections';
import { AdminConfigProvider, useAdminConfig } from '@/contexts/AdminConfigContext';
import { AlertTriangle } from 'lucide-react';

const AdminContent = () => {
  const { setConfig, setIsLoading, setHasError, isLoading, hasError } = useAdminConfig() as any;
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Load configuration from the database
  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true);
      try {
        const dbConfig = await loadConfiguration();
        if (dbConfig && dbConfig.api.ENDPOINT && dbConfig.api.API_KEY) {
          setConfig({
            api: {
              endpoint: dbConfig.api.ENDPOINT,
              apiKey: dbConfig.api.API_KEY,
            },
            footer: dbConfig.footer
          });
          setHasError(false);
        } else {
          setHasError(true);
        }
        
        // Get admin password from config
        const fullConfig = await getConfig();
        if (fullConfig) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error loading configuration:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConfig();
  }, [setConfig, setIsLoading, setHasError]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 mt-20 text-center">
        <div className="text-2xl">Lade Konfiguration...</div>
      </div>
    );
  }
  
  if (hasError) {
    return (
      <div className="container mx-auto py-10 mt-20 text-center">
        <div className="flex flex-col items-center justify-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <div className="text-2xl font-semibold mb-2">Konfigurationsfehler</div>
          <p className="text-white/70 max-w-lg">
            Die Konfiguration konnte nicht von der Datenbank geladen werden. 
            Bitte stellen Sie sicher, dass die Datenbank erreichbar ist und die Konfiguration korrekt eingerichtet wurde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 mt-20">
      <div className="mb-8">
        <CounterDisplay isAuthenticated={isAuthenticated} />
      </div>
      
      <ConfigSections />
    </div>
  );
};

const Admin = () => {
  return (
    <AdminConfigProvider>
      <AuthenticationGuard>
        <>
          <Banner subline="Admin Bereich" />
          <AdminContent />
        </>
      </AuthenticationGuard>
    </AdminConfigProvider>
  );
};

export default Admin;
