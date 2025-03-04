
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
    const countText = await response.text();
    // Ensure we're parsing a clean number by trimming whitespace
    const count = parseInt(countText.trim() || '0', 10);
    // Check if count is a valid number
    const newCount = isNaN(count) ? 1 : count + 1;
    
    console.log(`Counter incremented to ${newCount}`);
    return newCount;
  } catch (error) {
    console.error('Error incrementing counter:', error);
    return 1; // Start from 1 if there's an error
  }
};

export const getCounter = async () => {
  try {
    const response = await fetch('/src/config/counter.txt');
    const countText = await response.text();
    // Ensure we're parsing a clean number
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
    // In a real application, this would be a server-side API call
    // For this demo, we're simulating a successful update
    console.log('Configuration updated:', newConfig);
    
    // In a production environment, this would update the actual env.ts file
    // Here we'll just return success and the updated config would be applied on restart
    return { success: true };
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
