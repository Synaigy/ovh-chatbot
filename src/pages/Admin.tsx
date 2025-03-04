import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { loadConfiguration, saveConfiguration } from '@/services/configService';
import { getCounter, getConfig } from '@/services/aiService';
import Banner from '@/components/Banner';
import LoginForm from '@/components/admin/LoginForm';
import StatisticsCard from '@/components/admin/StatisticsCard';
import ApiConfigForm from '@/components/admin/ApiConfigForm';
import ContactConfigForm from '@/components/admin/ContactConfigForm';
import CompanyConfigForm from '@/components/admin/CompanyConfigForm';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [counter, setCounter] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState({
    api: {
      endpoint: '',
      apiKey: '',
    },
    footer: {
      CONTACT_PERSON: {
        NAME: '',
        TITLE: '',
        PHOTO_URL: '',
        MEETING_URL: '',
        LINKEDIN_URL: '',
      },
      COMPANY: {
        NAME: '',
      },
    }
  });
  const [adminPassword, setAdminPassword] = useState('');
  
  const { toast } = useToast();

  // Load configuration from the database including admin password
  useEffect(() => {
    const loadConfig = async () => {
      if (isAuthenticated) {
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
          if (fullConfig && fullConfig.ADMIN_PASSWORD) {
            setAdminPassword(fullConfig.ADMIN_PASSWORD);
          }
        } catch (error) {
          console.error("Error loading configuration:", error);
          toast({
            title: "Fehler",
            description: "Die Konfiguration konnte nicht geladen werden.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadConfig();
  }, [isAuthenticated, toast]);

  // Also load admin password for login authentication
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

  useEffect(() => {
    const loadCounter = async () => {
      if (isAuthenticated) {
        const count = await getCounter();
        setCounter(count);
      }
    };
    
    loadCounter();
    
    let intervalId: number | undefined;
    if (isAuthenticated) {
      intervalId = window.setInterval(() => {
        loadCounter();
      }, 30000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAuthenticated]);

  const handleLogin = (password: string) => {
    if (adminPassword && password === adminPassword) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Falsches Passwort');
    }
  };

  const handleApiChange = (key: 'endpoint' | 'apiKey', value: string) => {
    setConfig({
      ...config,
      api: {
        ...config.api,
        [key]: value
      }
    });
  };

  const handleContactChange = (field: string, value: string) => {
    setConfig({
      ...config,
      footer: {
        ...config.footer,
        CONTACT_PERSON: {
          ...config.footer.CONTACT_PERSON,
          [field]: value
        }
      }
    });
  };

  const handleCompanyNameChange = (value: string) => {
    setConfig({
      ...config,
      footer: {
        ...config.footer,
        COMPANY: {
          ...config.footer.COMPANY,
          NAME: value
        }
      }
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const success = await saveConfiguration(config);
      
      if (success) {
        toast({
          title: "Konfiguration gespeichert",
          description: "Die Änderungen wurden erfolgreich gespeichert und werden bei einem Neustart der Anwendung wirksam.",
          variant: "default",
        });
      } else {
        throw new Error("Failed to save configuration");
      }
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast({
        title: "Fehler",
        description: "Die Konfiguration konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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

  if (isLoading) {
    return (
      <>
        <Banner subline="Admin Bereich" />
        <div className="container mx-auto py-10 mt-20 text-center">
          <div className="text-2xl">Lade Konfiguration...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Banner subline="Admin Bereich" />
      <div className="container mx-auto py-10 mt-20">
        <div className="mb-8">
          <StatisticsCard counter={counter} />
        </div>
        
        <div className="space-y-8">
          <ApiConfigForm 
            endpoint={config.api.endpoint} 
            apiKey={config.api.apiKey} 
            onChange={handleApiChange} 
          />
          
          <ContactConfigForm 
            contact={{
              name: config.footer.CONTACT_PERSON.NAME,
              title: config.footer.CONTACT_PERSON.TITLE,
              photoUrl: config.footer.CONTACT_PERSON.PHOTO_URL,
              meetingUrl: config.footer.CONTACT_PERSON.MEETING_URL,
              linkedinUrl: config.footer.CONTACT_PERSON.LINKEDIN_URL
            }}
            onChange={handleContactChange}
          />
          
          <CompanyConfigForm 
            name={config.footer.COMPANY.NAME}
            onChange={handleCompanyNameChange}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </div>
      </div>
    </>
  );
};

export default Admin;
