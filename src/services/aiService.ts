
import OpenAI from 'openai';
import { API_CONFIG } from '../config/env';

// Initialize OpenAI client with the API key
const openaiClient = new OpenAI({
  apiKey: API_CONFIG.API_KEY,
  baseURL: API_CONFIG.ENDPOINT,
  dangerouslyAllowBrowser: true // Only for demo purposes
});

// Backend API URL for the counter
const COUNTER_API_URL = 'http://localhost:3001/api';

export const incrementCounter = async () => {
  try {
    // Call the backend API to increment the counter
    const response = await fetch(`${COUNTER_API_URL}/counter/increment`, {
      method: 'POST',
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
    const response = await fetch(`${COUNTER_API_URL}/counter`);
    
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

export const updateConfig = async (newConfig: any) => {
  try {
    // In a real application, this would be a server-side API call to update env.ts
    // For this demo, we're simulating a successful update
    console.log('Configuration updated:', newConfig);
    
    // In a production environment, we would:
    // 1. Send the new config to a backend endpoint
    // 2. The backend would update the env.ts file
    // 3. The frontend would be reloaded to apply changes
    
    // Simulate a successful update with a short delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return { 
      success: true,
      message: "Konfiguration erfolgreich gespeichert" 
    };
  } catch (error) {
    console.error('Error updating configuration:', error);
    throw error;
  }
};

export const sendMessage = async (messages: any[]) => {
  try {
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
export const initializeClient = (key: string) => {
  return openaiClient;
};

export const isClientInitialized = () => {
  return true;
};

export const resetClient = () => {
  // No-op since we're using a hardcoded token
};
