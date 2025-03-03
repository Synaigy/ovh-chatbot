
import OpenAI from 'openai';
import { API_CONFIG } from '../config/env';

// Initialize OpenAI client with the API key
const openaiClient = new OpenAI({
  apiKey: API_CONFIG.API_KEY,
  baseURL: API_CONFIG.ENDPOINT,
  dangerouslyAllowBrowser: true // Only for demo purposes
});

export const sendMessage = async (messages: any[]) => {
  try {
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
