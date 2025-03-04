
import OpenAI from 'openai';
import { API_CONFIG } from '../config/env';

// Initialize OpenAI client with the API key
const openaiClient = new OpenAI({
  apiKey: API_CONFIG.API_KEY,
  baseURL: API_CONFIG.ENDPOINT,
  dangerouslyAllowBrowser: true // Only for demo purposes
});

export const incrementCounter = async () => {
  try {
    const response = await fetch('/src/config/counter.txt');
    const count = await response.text();
    const newCount = parseInt(count.trim(), 10) + 1;
    
    // In a real app, this would be a server-side API call
    // Since we can't write to files directly in the browser, 
    // we'll just return the new count for demo purposes
    console.log(`Counter incremented to ${newCount}`);
    return newCount;
  } catch (error) {
    console.error('Error incrementing counter:', error);
    return null;
  }
};

export const getCounter = async () => {
  try {
    const response = await fetch('/src/config/counter.txt');
    const count = await response.text();
    return parseInt(count.trim(), 10);
  } catch (error) {
    console.error('Error getting counter:', error);
    return 0;
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

// These functions are no longer needed but kept for compatibility
export const initializeClient = (key: string) => {
  return openaiClient;
};

export const isClientInitialized = () => {
  return true;
};

export const resetClient = () => {
  // No-op since we're using a hardcoded token
};
