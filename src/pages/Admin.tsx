
import React, { useEffect } from 'react';
import { getConfig } from '@/services/aiService';
import { loadConfiguration } from '@/services/configService';
import Banner from '@/components/Banner';
import AuthenticationGuard from '@/components/admin/AuthenticationGuard';
import CounterDisplay from '@/components/admin/CounterDisplay';
import ConfigSections from '@/components/admin/ConfigSections';
import { AdminConfigProvider, useAdminConfig } from '@/contexts/AdminConfigContext';

const AdminContent = () => {
  const { setConfig, setIsLoading, isLoading } = useAdminConfig() as any;
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Load configuration from the database
  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true);
      try {
        const dbConfig = await loadConfiguration();
        if (dbConfig) {
          setConfig({
            api: {
              endpoint: dbConfig.api.ENDPOINT,
              apiKey: dbConfig.api.API_KEY,
            },
            footer: dbConfig.footer
          });
        }
        
        // Get admin password from config
        const fullConfig = await getConfig();
        if (fullConfig) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error loading configuration:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConfig();
  }, [setConfig, setIsLoading]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 mt-20 text-center">
        <div className="text-2xl">Lade Konfiguration...</div>
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
