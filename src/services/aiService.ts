
import OpenAI from 'openai';

// Backend API URL for the counter and configuration - using HTTPS and the proper domain
const API_URL = 'https://chat.synaigy.cloud/api';

// Store API configuration fetched from the database
let apiConfig = {
  ENDPOINT: '',
  API_KEY: ''
};

// Default configuration to use when database is unavailable
const DEFAULT_CONFIG = {
  API_ENDPOINT: 'https://deepseek-r1-distill-llama-70b.endpoints.kepler.ai.cloud.ovh.net/api/openai_compat/v1',
  API_KEY: 'placeholder-key-only-for-ui-rendering',
  CONTACT_NAME: 'Support Team',
  CONTACT_TITLE: 'Customer Support',
  CONTACT_PHOTO: 'https://profile-images.xing.com/images/0bac708fee0a79e6e7186a5fb08af312-26/marc-achsnich.1024x1024.jpg',
  CONTACT_MEETING: '#',
  CONTACT_LINKEDIN: '#',
  COMPANY_NAME: 'Synaigy GmbH'
};

// Flag to track if we've already shown a database connection error toast
let dbErrorToastShown = false;

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
    // Call the backend API to increment the counter using GET instead of POST
    const response = await fetch(`${API_URL}/counter/increment`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/plain'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to increment counter: ${response.status} ${response.statusText}`);
    }
    
    const newCount = await response.text();
    const countValue = parseInt(newCount, 10);
    
    console.log(`Counter incremented to ${countValue}`);
    return countValue;
  } catch (error) {
    console.error('Error incrementing counter:', error);
    return 1; // Start from 1 if there's an error
  }
};

export const getCounter = async () => {
  try {
    // Call the backend API to get the counter value
    const response = await fetch(`${API_URL}/counter`);
    
    if (!response.ok) {
      throw new Error(`Failed to get counter: ${response.status} ${response.statusText}`);
    }
    
    const countText = await response.text();
    const count = parseInt(countText.trim() || '0', 10);
    
    // If NaN, return 0 instead
    return isNaN(count) ? 0 : count;
  } catch (error) {
    console.error('Error getting counter:', error);
    return 0;
  }
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
    
    // Initialize OpenAI client with fetched config
    initializeOpenAIClient(config);
    
    return config;
  } catch (error) {
    console.error('Error getting configuration:', error);
    
    // Return default config for UI rendering when database is unavailable
    return DEFAULT_CONFIG;
  }
};

export const updateConfig = async (newConfig: any) => {
  try {
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
      throw new Error(`Failed to update config: ${response.status} ${response.statusText}`);
    }
    
    const updatedConfig = await response.json();
    
    // Re-initialize OpenAI client with the updated config
    initializeOpenAIClient(updatedConfig);
    
    return { success: true, data: updatedConfig };
  } catch (error) {
    console.error('Error updating configuration:', error);
    return { success: false, error };
  }
};

export const sendMessage = async (messages: any[]) => {
  try {
    // If client is not initialized yet, fetch configuration
    if (!apiConfig.API_KEY || !apiConfig.ENDPOINT) {
      await getConfig();
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
