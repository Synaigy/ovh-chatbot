import OpenAI from 'openai';
import { toast } from '@/components/ui/use-toast';

// Backend API URL for the counter and configuration - using HTTPS and the proper domain
const API_URL = 'https://chat.synaigy.cloud/api';

// Store API configuration fetched from the database
let apiConfig = {
  ENDPOINT: '',
  API_KEY: ''
};

// Flag to track if we've already shown a database connection error toast
let dbErrorToastShown = false;
// Flag to track if we've made at least one successful database fetch
let hasSuccessfullyFetchedConfig = false;

// Daily message limit per session
const DAILY_MESSAGE_LIMIT = 50;

// Session counter to track user's usage in current session
let sessionCounter = 0;

// Initialize OpenAI client with placeholder values
// Will be properly configured after the first getConfig() call
let openaiClient = new OpenAI({
  apiKey: 'placeholder', // Will be replaced
  baseURL: 'placeholder', // Will be replaced
  dangerouslyAllowBrowser: true // Only for demo purposes
});

// Function to initialize the OpenAI client with configuration from database
const initializeOpenAIClient = (config: any) => {
  if (config.API_ENDPOINT && config.API_KEY) {
    apiConfig = {
      ENDPOINT: config.API_ENDPOINT,
      API_KEY: config.API_KEY
    };
    
    openaiClient = new OpenAI({
      apiKey: apiConfig.API_KEY,
      baseURL: apiConfig.ENDPOINT,
      dangerouslyAllowBrowser: true // Only for demo purposes
    });
    
    console.log('OpenAI client initialized with configuration from database');
    return true;
  }
  return false;
};

export const incrementCounter = async () => {
  try {
    // Increment global counter in the database
    const response = await fetch(`${API_URL}/counter/increment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to increment counter: ${response.status} ${response.statusText}`);
    }
    
    const newCount = await response.text();
    const countValue = parseInt(newCount, 10);
    
    // Also increment the session counter
    sessionCounter++;
    
    console.log(`Global counter incremented to ${countValue}, Session counter: ${sessionCounter}`);
    return countValue;
  } catch (error) {
    console.error('Error incrementing counter:', error);
    // Still increment session counter even if global counter fails
    sessionCounter++;
    return 1; // Start from 1 if there's an error
  }
};

export const getGlobalCounter = async () => {
  try {
    // Call the backend API to get the total counter value from the database
    const response = await fetch(`${API_URL}/counter`);
    
    if (!response.ok) {
      throw new Error(`Failed to get counter: ${response.status} ${response.statusText}`);
    }
    
    const countText = await response.text();
    const count = parseInt(countText.trim() || '0', 10);
    
    console.log(`Global API Counter Response from ${API_URL}/counter:`, countText);
    
    // If NaN, return 0 instead
    return {
      count: isNaN(count) ? 0 : count,
      url: `${API_URL}/counter`
    };
  } catch (error) {
    console.error('Error getting global counter:', error);
    return {
      count: 0,
      url: `${API_URL}/counter (error occurred)`
    };
  }
};

// Get the current session counter (for the current user session)
export const getSessionCounter = () => {
  return sessionCounter;
};

// Reset the session counter (e.g., on page refresh or new session)
export const resetSessionCounter = () => {
  sessionCounter = 0;
  return sessionCounter;
};

export const checkMessageLimit = async (): Promise<{limitReached: boolean; count: number}> => {
  try {
    // Use session counter, not global counter, for message limit checking
    return { 
      limitReached: sessionCounter >= DAILY_MESSAGE_LIMIT,
      count: sessionCounter
    };
  } catch (error) {
    console.error('Error checking message limit:', error);
    return { limitReached: false, count: 0 };
  }
};

// Keep backward compatibility with existing code
export const getCounter = async () => {
  return getGlobalCounter();
};

export const getConfig = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${API_URL}/config`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to get config: ${response.status} ${response.statusText}`);
    }
    
    const config = await response.json();
    dbErrorToastShown = false; // Reset error toast flag on successful fetch
    hasSuccessfullyFetchedConfig = true; // Mark that we've successfully fetched config
    
    // Initialize OpenAI client with fetched config
    initializeOpenAIClient(config);
    
    return config;
  } catch (error) {
    console.error('Error getting configuration:', error);
    
    // If we've never successfully fetched from the database, show an error toast
    if (!hasSuccessfullyFetchedConfig && !dbErrorToastShown) {
      toast({
        title: "Konfigurationsfehler",
        description: "Die Konfiguration konnte nicht von der Datenbank geladen werden. Bitte wenden Sie sich an den Administrator.",
        variant: "destructive",
      });
      dbErrorToastShown = true;
    }
    
    // Return null to indicate error
    return null;
  }
};

export const updateConfig = async (newConfig: any) => {
  try {
    console.log('Updating configuration with:', newConfig);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${API_URL}/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newConfig),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`Failed to update config: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to update config: ${response.status} ${response.statusText}`);
    }
    
    const updatedConfig = await response.json();
    console.log('Configuration updated successfully:', updatedConfig);
    
    // Re-initialize OpenAI client with the updated config
    if (updatedConfig.API_ENDPOINT && updatedConfig.API_KEY) {
      apiConfig = {
        ENDPOINT: updatedConfig.API_ENDPOINT,
        API_KEY: updatedConfig.API_KEY
      };
      
      openaiClient = new OpenAI({
        apiKey: apiConfig.API_KEY,
        baseURL: apiConfig.ENDPOINT,
        dangerouslyAllowBrowser: true // Only for demo purposes
      });
      
      console.log('OpenAI client re-initialized with updated configuration');
    }
    
    return { success: true, data: updatedConfig };
  } catch (error) {
    console.error('Error updating configuration:', error);
    
    toast({
      title: "Konfigurationsfehler",
      description: "Die Konfiguration konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut oder wenden Sie sich an den Administrator.",
      variant: "destructive",
    });
    
    return { success: false, error };
  }
};

export const sendMessage = async (messages: any[]) => {
  try {
    // Check if message limit reached
    const { limitReached, count } = await checkMessageLimit();
    
    if (limitReached) {
      throw new Error(`Tägliches Nachrichtenlimit erreicht (${DAILY_MESSAGE_LIMIT}). Bitte versuchen Sie es morgen wieder.`);
    }
    
    // Always attempt to fetch fresh configuration first
    const config = await getConfig();
    
    // Only initialize if needed
    if (!apiConfig.API_KEY || !apiConfig.ENDPOINT) {
      if (config && config.API_ENDPOINT && config.API_KEY) {
        initializeOpenAIClient(config);
      } else {
        console.error('Failed to get valid API configuration');
        throw new Error('Konfiguration konnte nicht geladen werden. Bitte wenden Sie sich an den Administrator.');
      }
    }
    
    // Increment the counter
    await incrementCounter();
    
    const response = await openaiClient.chat.completions.create({
      model: 'DeepSeek-R1-Distill-Llama-70B',
      stream: true,
      messages,
    });

    return response;
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw error;
  }
};

// These functions are kept for compatibility
export const initializeClient = async (key: string) => {
  if (!apiConfig.API_KEY || !apiConfig.ENDPOINT) {
    await getConfig();
  }
  return openaiClient;
};

export const isClientInitialized = () => {
  return apiConfig.API_KEY && apiConfig.ENDPOINT;
};

export const resetClient = async () => {
  apiConfig = { ENDPOINT: '', API_KEY: '' };
  await getConfig(); // Reload the configuration
};

// Add a force refresh function to ensure we have the latest config
export const forceConfigRefresh = async () => {
  // Clear current config
  apiConfig = { ENDPOINT: '', API_KEY: '' };
  
  // Fetch fresh config from database
  const freshConfig = await getConfig();
  
  // Initialize client with fresh config
  if (freshConfig) {
    initializeOpenAIClient(freshConfig);
    return true;
  }
  
  return false;
};

// Export the message limit for use in UI components
export const getDailyMessageLimit = () => DAILY_MESSAGE_LIMIT;
