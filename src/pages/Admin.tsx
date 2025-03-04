
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ADMIN_PASSWORD, API_CONFIG, FOOTER_CONFIG } from '@/config/env';
import { getCounter, updateConfig } from '@/services/aiService';
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
  const [config, setConfig] = useState({
    api: {
      endpoint: API_CONFIG.ENDPOINT,
      apiKey: API_CONFIG.API_KEY,
    },
    contact: {
      name: FOOTER_CONFIG.CONTACT_PERSON.NAME,
      title: FOOTER_CONFIG.CONTACT_PERSON.TITLE,
      photoUrl: FOOTER_CONFIG.CONTACT_PERSON.PHOTO_URL,
      meetingUrl: FOOTER_CONFIG.CONTACT_PERSON.MEETING_URL,
      linkedinUrl: FOOTER_CONFIG.CONTACT_PERSON.LINKEDIN_URL,
    },
    company: {
      name: FOOTER_CONFIG.COMPANY.NAME,
    },
  });
  
  const { toast } = useToast();

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
    if (password === ADMIN_PASSWORD) {
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
      contact: {
        ...config.contact,
        [field]: value
      }
    });
  };

  const handleCompanyNameChange = (value: string) => {
    setConfig({
      ...config,
      company: {
        ...config.company,
        name: value
      }
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const result = await updateConfig({
        api: config.api,
        contact: config.contact,
        company: config.company
      });
      
      if (result.success) {
        toast({
          title: "Konfiguration gespeichert",
          description: "Die Änderungen wurden erfolgreich gespeichert und werden bei einem Neustart der Anwendung wirksam.",
          variant: "default",
        });
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
            contact={config.contact}
            onChange={handleContactChange}
          />
          
          <CompanyConfigForm 
            name={config.company.name}
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
