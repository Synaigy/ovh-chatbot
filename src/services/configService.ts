
import { toast } from '@/components/ui/use-toast';
import { getConfig, updateConfig } from './aiService';

// Store initial configuration
let currentApiConfig = {
  ENDPOINT: '',
  API_KEY: ''
};

let currentFooterConfig = {
  CONTACT_PERSON: {
    NAME: '',
    TITLE: '',
    PHOTO_URL: '',
    MEETING_URL: '',
    LINKEDIN_URL: ''
  },
  COMPANY: {
    NAME: ''
  }
};

// Function to load configuration from the database
export const loadConfiguration = async () => {
  try {
    const config = await getConfig();
    
    // Update stored API configuration
    currentApiConfig = {
      ENDPOINT: config.API_ENDPOINT || '',
      API_KEY: config.API_KEY || ''
    };
    
    // Update stored footer configuration
    currentFooterConfig = {
      CONTACT_PERSON: {
        NAME: config.CONTACT_NAME || '',
        TITLE: config.CONTACT_TITLE || '',
        PHOTO_URL: config.CONTACT_PHOTO || '',
        MEETING_URL: config.CONTACT_MEETING || '',
        LINKEDIN_URL: config.CONTACT_LINKEDIN || ''
      },
      COMPANY: {
        NAME: config.COMPANY_NAME || ''
      }
    };
    
    return {
      api: currentApiConfig,
      footer: currentFooterConfig
    };
  } catch (error) {
    console.error('Error loading configuration:', error);
    toast({
      title: "Fehler beim Laden der Konfiguration",
      description: "Die Konfiguration konnte nicht geladen werden. Bitte versuchen Sie es später erneut.",
      variant: "destructive",
    });
    return null;
  }
};

// Function to save configuration to the database
export const saveConfiguration = async (newConfig) => {
  try {
    const result = await updateConfig({
      api: {
        endpoint: newConfig.api.endpoint,
        apiKey: newConfig.api.apiKey
      },
      contact: {
        name: newConfig.footer.CONTACT_PERSON.NAME,
        title: newConfig.footer.CONTACT_PERSON.TITLE,
        photoUrl: newConfig.footer.CONTACT_PERSON.PHOTO_URL,
        meetingUrl: newConfig.footer.CONTACT_PERSON.MEETING_URL,
        linkedinUrl: newConfig.footer.CONTACT_PERSON.LINKEDIN_URL
      },
      company: {
        name: newConfig.footer.COMPANY.NAME
      }
    });
    
    if (result.success) {
      // Update local configuration
      currentApiConfig = newConfig.api;
      currentFooterConfig = newConfig.footer;
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving configuration:', error);
    return false;
  }
};

// Function to check if configuration has changed and reload if necessary
export const detectConfigChanges = async () => {
  try {
    const newConfig = await getConfig();
    
    // Check if API configuration has changed
    if (
      currentApiConfig.ENDPOINT !== newConfig.API_ENDPOINT ||
      currentApiConfig.API_KEY !== newConfig.API_KEY
    ) {
      toast({
        title: "Konfiguration aktualisiert",
        description: "Die API-Konfiguration wurde geändert. Die Änderungen werden jetzt wirksam.",
        variant: "default",
      });
      
      // Update stored configuration
      currentApiConfig = {
        ENDPOINT: newConfig.API_ENDPOINT,
        API_KEY: newConfig.API_KEY
      };
      
      // Force refresh to apply new configuration
      window.location.reload();
      return true;
    }
    
    // Check if footer configuration has changed
    if (
      currentFooterConfig.CONTACT_PERSON.NAME !== newConfig.CONTACT_NAME ||
      currentFooterConfig.CONTACT_PERSON.TITLE !== newConfig.CONTACT_TITLE ||
      currentFooterConfig.CONTACT_PERSON.PHOTO_URL !== newConfig.CONTACT_PHOTO ||
      currentFooterConfig.CONTACT_PERSON.MEETING_URL !== newConfig.CONTACT_MEETING ||
      currentFooterConfig.CONTACT_PERSON.LINKEDIN_URL !== newConfig.CONTACT_LINKEDIN ||
      currentFooterConfig.COMPANY.NAME !== newConfig.COMPANY_NAME
    ) {
      toast({
        title: "Konfiguration aktualisiert",
        description: "Die Kontakt- und Firmeninformationen wurden geändert. Die Änderungen werden jetzt wirksam.",
        variant: "default",
      });
      
      // Update stored configuration
      currentFooterConfig = {
        CONTACT_PERSON: {
          NAME: newConfig.CONTACT_NAME,
          TITLE: newConfig.CONTACT_TITLE,
          PHOTO_URL: newConfig.CONTACT_PHOTO,
          MEETING_URL: newConfig.CONTACT_MEETING,
          LINKEDIN_URL: newConfig.CONTACT_LINKEDIN
        },
        COMPANY: {
          NAME: newConfig.COMPANY_NAME
        }
      };
      
      // Force refresh to apply new configuration
      window.location.reload();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error detecting configuration changes:', error);
    return false;
  }
};

// Export getter functions for configuration
export const getApiConfig = () => currentApiConfig;
export const getFooterConfig = () => currentFooterConfig;
