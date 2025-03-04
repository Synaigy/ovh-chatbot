
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { loadConfiguration, saveConfiguration } from '@/services/configService';

interface ConfigState {
  api: {
    endpoint: string;
    apiKey: string;
  };
  footer: {
    CONTACT_PERSON: {
      NAME: string;
      TITLE: string;
      PHOTO_URL: string;
      MEETING_URL: string;
      LINKEDIN_URL: string;
    };
    COMPANY: {
      NAME: string;
    };
  };
}

interface AdminConfigContextType {
  config: ConfigState;
  isLoading: boolean;
  isSaving: boolean;
  hasError: boolean;
  handleApiChange: (key: 'endpoint' | 'apiKey', value: string) => void;
  handleContactChange: (field: string, value: string) => void;
  handleCompanyNameChange: (value: string) => void;
  handleSave: () => Promise<void>;
  setConfig: React.Dispatch<React.SetStateAction<ConfigState>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
}

// Empty initial config (no default values)
const initialConfig = {
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
    }
  }
};

const AdminConfigContext = createContext<AdminConfigContextType | undefined>(undefined);

export const useAdminConfig = () => {
  const context = useContext(AdminConfigContext);
  if (!context) {
    throw new Error('useAdminConfig must be used within a AdminConfigProvider');
  }
  return context;
};

export const AdminConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<ConfigState>(initialConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const { toast } = useToast();

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
      
      // Create a properly formatted configuration object for the API
      const configToSave = {
        api: {
          endpoint: config.api.endpoint,
          apiKey: config.api.apiKey
        },
        contact: {
          name: config.footer.CONTACT_PERSON.NAME,
          title: config.footer.CONTACT_PERSON.TITLE,
          photoUrl: config.footer.CONTACT_PERSON.PHOTO_URL,
          meetingUrl: config.footer.CONTACT_PERSON.MEETING_URL,
          linkedinUrl: config.footer.CONTACT_PERSON.LINKEDIN_URL
        },
        company: {
          name: config.footer.COMPANY.NAME
        }
      };
      
      const result = await saveConfiguration(configToSave);
      
      if (result) {
        toast({
          title: "Konfiguration gespeichert",
          description: "Die Änderungen wurden erfolgreich gespeichert und werden bei einem Neustart der Anwendung wirksam.",
          variant: "default",
        });
        
        // Force a config refresh after saving
        const updatedConfig = await loadConfiguration();
        if (updatedConfig) {
          setConfig(updatedConfig);
        }
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

  const value = {
    config,
    isLoading,
    isSaving,
    hasError,
    handleApiChange,
    handleContactChange,
    handleCompanyNameChange,
    handleSave,
    setConfig,
    setIsLoading,
    setHasError
  };

  return (
    <AdminConfigContext.Provider value={value}>
      {children}
    </AdminConfigContext.Provider>
  );
};
