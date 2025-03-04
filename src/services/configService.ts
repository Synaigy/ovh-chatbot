
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

// Keep track of the last fetch time to prevent constant reloading
let lastFetchTime = 0;
const MIN_FETCH_INTERVAL = 60000; // 1 minute minimum between forced refreshes

// Track if initialization is complete
let isInitialized = false;

// Track if a page reload is pending
let reloadPending = false;

// Function to load configuration from the database
export const loadConfiguration = async () => {
  try {
    // If we're in the midst of a reload cycle, don't fetch again
    if (reloadPending) {
      return null;
    }
    
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
    
    // Mark as initialized
    isInitialized = true;
    
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
      
      // Reset the fetch time to prevent immediate reload
      lastFetchTime = Date.now();
      
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
  // If a reload is already pending, don't check again
  if (reloadPending) {
    console.log('Skipping config check - reload already pending');
    return false;
  }
  
  // Don't check too frequently to avoid deadloops
  const now = Date.now();
  if (now - lastFetchTime < MIN_FETCH_INTERVAL) {
    console.log(`Skipping config check - too soon (${Math.round((now - lastFetchTime)/1000)}s since last check, minimum ${MIN_FETCH_INTERVAL/1000}s)`);
    return false;
  }
  
  try {
    // Update last fetch time FIRST to prevent concurrent calls
    lastFetchTime = now;
    
    console.log('Checking for configuration changes...');
    
    // Only fetch the config from the server
    const newConfig = await getConfig();
    
    // Skip if config is empty or incomplete
    if (!newConfig || !newConfig.API_ENDPOINT || !newConfig.API_KEY) {
      console.log('Skipping config update - incomplete config data');
      return false;
    }
    
    // If this is the first time loading config, just store it without reloading
    if (!isInitialized) {
      console.log('First-time configuration loaded - storing without reload');
      currentApiConfig = {
        ENDPOINT: newConfig.API_ENDPOINT,
        API_KEY: newConfig.API_KEY
      };
      
      currentFooterConfig = {
        CONTACT_PERSON: {
          NAME: newConfig.CONTACT_NAME || '',
          TITLE: newConfig.CONTACT_TITLE || '',
          PHOTO_URL: newConfig.CONTACT_PHOTO || '',
          MEETING_URL: newConfig.CONTACT_MEETING || '',
          LINKEDIN_URL: newConfig.CONTACT_LINKEDIN || ''
        },
        COMPANY: {
          NAME: newConfig.COMPANY_NAME || ''
        }
      };
      
      isInitialized = true;
      return false;
    }
    
    // Check if API configuration has changed
    const apiConfigChanged = 
      currentApiConfig.ENDPOINT !== newConfig.API_ENDPOINT ||
      currentApiConfig.API_KEY !== newConfig.API_KEY;
    
    // Check if footer configuration has changed
    const footerConfigChanged = 
      currentFooterConfig.CONTACT_PERSON.NAME !== newConfig.CONTACT_NAME ||
      currentFooterConfig.CONTACT_PERSON.TITLE !== newConfig.CONTACT_TITLE ||
      currentFooterConfig.CONTACT_PERSON.PHOTO_URL !== newConfig.CONTACT_PHOTO ||
      currentFooterConfig.CONTACT_PERSON.MEETING_URL !== newConfig.CONTACT_MEETING ||
      currentFooterConfig.CONTACT_PERSON.LINKEDIN_URL !== newConfig.CONTACT_LINKEDIN ||
      currentFooterConfig.COMPANY.NAME !== newConfig.COMPANY_NAME;
    
    // If any configuration has changed, reload once
    if (apiConfigChanged || footerConfigChanged) {
      // Set reload pending flag to prevent multiple reloads
      reloadPending = true;
      
      // Show an appropriate toast message
      if (apiConfigChanged) {
        toast({
          title: "Konfiguration aktualisiert",
          description: "Die API-Konfiguration wurde geändert. Die Änderungen werden jetzt wirksam.",
          variant: "default",
        });
        
        // Update stored API configuration
        currentApiConfig = {
          ENDPOINT: newConfig.API_ENDPOINT,
          API_KEY: newConfig.API_KEY
        };
      }
      
      if (footerConfigChanged) {
        toast({
          title: "Konfiguration aktualisiert",
          description: "Die Kontakt- und Firmeninformationen wurden geändert. Die Änderungen werden jetzt wirksam.",
          variant: "default",
        });
        
        // Update stored footer configuration
        currentFooterConfig = {
          CONTACT_PERSON: {
            NAME: newConfig.CONTACT_NAME || '',
            TITLE: newConfig.CONTACT_TITLE || '',
            PHOTO_URL: newConfig.CONTACT_PHOTO || '',
            MEETING_URL: newConfig.CONTACT_MEETING || '',
            LINKEDIN_URL: newConfig.CONTACT_LINKEDIN || ''
          },
          COMPANY: {
            NAME: newConfig.COMPANY_NAME || ''
          }
        };
      }
      
      // Use a timeout to prevent immediate reload (which can cause loops)
      console.log('Configuration changed - scheduling page reload');
      setTimeout(() => {
        window.location.reload();
      }, 1500); // Give time for toast to be seen
      
      return true;
    }
    
    console.log('No configuration changes detected');
    return false;
  } catch (error) {
    console.error('Error detecting configuration changes:', error);
    return false;
  }
};

// Initialize config detection once per page load
export const initializeConfigDetection = () => {
  console.log('Initializing config detection');
  
  // Initial load of configuration, but only if not already initialized
  if (!isInitialized) {
    console.log('First time initializing - loading configuration');
    detectConfigChanges();
  }
  
  // Set up event listener for when user returns to the tab
  const focusHandler = () => {
    console.log('Window focus detected - checking for config changes');
    detectConfigChanges();
  };
  
  window.addEventListener('focus', focusHandler);
  
  return () => {
    window.removeEventListener('focus', focusHandler);
  };
};

// Export getter functions for configuration
export const getApiConfig = () => currentApiConfig;
export const getFooterConfig = () => currentFooterConfig;
