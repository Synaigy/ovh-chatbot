
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

// Detection state
let isConfigDetectionRunning = false;
let lastFetchTime = 0;
const MIN_FETCH_INTERVAL = 300000; // 5 minutes minimum between forced refreshes
let isInitialized = false;
let reloadPending = false;
let initialConfigLoaded = false;
let connectionErrorCount = 0;
const MAX_CONNECTION_ERRORS = 3;
let dbErrorToastShown = false;

// Function to load configuration from the database
export const loadConfiguration = async () => {
  try {
    // If we're in the midst of a reload cycle, don't fetch again
    if (reloadPending) {
      console.log('Skipping loadConfiguration - reload already pending');
      return null;
    }
    
    const config = await getConfig();
    
    // Reset connection error count on successful fetch
    connectionErrorCount = 0;
    
    // Skip if config is incomplete
    if (!config || !config.API_ENDPOINT || !config.API_KEY) {
      console.log('Skipping loadConfiguration - incomplete config data');
      return null;
    }
    
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
    initialConfigLoaded = true;
    
    return {
      api: currentApiConfig,
      footer: currentFooterConfig
    };
  } catch (error) {
    console.error('Error loading configuration:', error);
    
    // Increment connection error count
    connectionErrorCount++;
    
    // Only show toast for database errors after multiple failures
    if (connectionErrorCount >= MAX_CONNECTION_ERRORS && !dbErrorToastShown) {
      toast({
        title: "Verbindungsproblem",
        description: "Die Verbindung zur Datenbank konnte nicht hergestellt werden. Es wird mit lokalen Einstellungen fortgefahren.",
        variant: "destructive",
      });
      dbErrorToastShown = true;
    }
    
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
    
    // Increment connection error count
    connectionErrorCount++;
    
    // Show toast for database connection errors
    if (connectionErrorCount >= MAX_CONNECTION_ERRORS && !dbErrorToastShown) {
      toast({
        title: "Verbindungsproblem",
        description: "Die Verbindung zur Datenbank konnte nicht hergestellt werden. Änderungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
      dbErrorToastShown = true;
    }
    
    return false;
  }
};

// Hash function to create a unique identifier for config state
const hashConfig = (config) => {
  return Object.entries(config)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
};

// Store config hash after initialization to prevent false detection
let initialConfigHash = '';

// Function to check if configuration has changed and reload if necessary
export const detectConfigChanges = async () => {
  // Skip if detection is already running
  if (isConfigDetectionRunning) {
    console.log('Skipping config check - detection already running');
    return false;
  }
  
  // Skip if a reload is already pending
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
    // Set detection running flag
    isConfigDetectionRunning = true;
    
    // Update last fetch time
    lastFetchTime = now;
    
    console.log('Checking for configuration changes...');
    
    // Only fetch the config from the server with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch('https://chat.synaigy.cloud/api/config', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to get config: ${response.status} ${response.statusText}`);
      }
      
      const newConfig = await response.json();
      
      // Reset connection error count on successful fetch
      connectionErrorCount = 0;
      dbErrorToastShown = false;
      
      // Skip if config is empty or incomplete
      if (!newConfig || !newConfig.API_ENDPOINT || !newConfig.API_KEY) {
        console.log('Skipping config update - incomplete config data');
        isConfigDetectionRunning = false;
        return false;
      }
      
      // If this is the first successful config load, just store it without comparing
      if (!initialConfigLoaded) {
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
        
        // Create initial hash to compare future changes against
        initialConfigHash = hashConfig({
          API_ENDPOINT: newConfig.API_ENDPOINT,
          API_KEY: newConfig.API_KEY,
          CONTACT_NAME: newConfig.CONTACT_NAME,
          CONTACT_TITLE: newConfig.CONTACT_TITLE,
          CONTACT_PHOTO: newConfig.CONTACT_PHOTO,
          CONTACT_MEETING: newConfig.CONTACT_MEETING,
          CONTACT_LINKEDIN: newConfig.CONTACT_LINKEDIN,
          COMPANY_NAME: newConfig.COMPANY_NAME
        });
        
        initialConfigLoaded = true;
        isInitialized = true;
        isConfigDetectionRunning = false;
        return false;
      }
      
      // Create current config hash
      const newConfigHash = hashConfig({
        API_ENDPOINT: newConfig.API_ENDPOINT,
        API_KEY: newConfig.API_KEY,
        CONTACT_NAME: newConfig.CONTACT_NAME,
        CONTACT_TITLE: newConfig.CONTACT_TITLE,
        CONTACT_PHOTO: newConfig.CONTACT_PHOTO,
        CONTACT_MEETING: newConfig.CONTACT_MEETING,
        CONTACT_LINKEDIN: newConfig.CONTACT_LINKEDIN,
        COMPANY_NAME: newConfig.COMPANY_NAME
      });
      
      // Compare hashes instead of individual fields
      if (initialConfigHash !== newConfigHash) {
        console.log('Configuration hash changed - reload needed');
        
        // Set reload pending flag to prevent multiple reloads
        reloadPending = true;
        
        // Only show toast once and with a single message
        toast({
          title: "Konfiguration aktualisiert",
          description: "Die Konfiguration wurde geändert. Die Anwendung wird aktualisiert.",
          variant: "default",
        });
        
        // Update stored configurations silently
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
        
        // Update the hash
        initialConfigHash = newConfigHash;
        
        // Use a longer timeout to prevent rapid reloads
        console.log('Scheduling page reload in 3 seconds');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        
        isConfigDetectionRunning = false;
        return true;
      }
      
      console.log('No configuration changes detected (hashes match)');
      isConfigDetectionRunning = false;
      return false;
    } catch (error) {
      console.error('Error fetching configuration:', error);
      
      // Increment connection error count
      connectionErrorCount++;
      
      // Only show toast for database errors after multiple failures
      if (connectionErrorCount >= MAX_CONNECTION_ERRORS && !dbErrorToastShown) {
        toast({
          title: "Verbindungsproblem",
          description: "Die Verbindung zur Datenbank konnte nicht hergestellt werden. Es wird mit lokalen Einstellungen fortgefahren.",
          variant: "destructive",
        });
        dbErrorToastShown = true;
      }
      
      isConfigDetectionRunning = false;
      return false;
    }
  } catch (error) {
    console.error('Error detecting configuration changes:', error);
    isConfigDetectionRunning = false;
    return false;
  }
};

// Initialize config detection once per page load
export const initializeConfigDetection = () => {
  console.log('Initializing config detection');
  
  // Initial load of configuration
  if (!initialConfigLoaded) {
    console.log('First time initializing - loading configuration');
    detectConfigChanges().catch(err => {
      console.error('Error during initial config detection:', err);
    });
  }
  
  // Set up event listener for when user returns to the tab (focus)
  const focusHandler = () => {
    // Don't check immediately on window focus if there were connection errors
    if (connectionErrorCount < MAX_CONNECTION_ERRORS) {
      console.log('Window focus detected - checking for config changes');
      detectConfigChanges().catch(err => {
        console.error('Error during focus-triggered config detection:', err);
      });
    } else {
      console.log('Skipping config check on focus due to connection errors');
    }
  };
  
  window.addEventListener('focus', focusHandler);
  
  return () => {
    window.removeEventListener('focus', focusHandler);
  };
};

// Export getter functions for configuration
export const getApiConfig = () => currentApiConfig;
export const getFooterConfig = () => currentFooterConfig;
