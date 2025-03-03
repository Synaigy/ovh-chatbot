
import OpenAI from 'openai';

// In a production environment, this would be loaded from environment variables
const API_ENDPOINT = 'https://deepseek-r1-distill-llama-70b.endpoints.kepler.ai.cloud.ovh.net/api/openai_compat/v';

// Note: API key would typically come from environment variables
// in a production environment
let apiKey = '';

// Initialize OpenAI client with null config, will be set later
let openaiClient: OpenAI | null = null;

export const initializeClient = (key: string) => {
  apiKey = key;
  
  // Initialize the OpenAI client with the OVHcloud endpoint
  openaiClient = new OpenAI({
    apiKey: key,
    baseURL: API_ENDPOINT,
    dangerouslyAllowBrowser: true // Only for demo purposes
  });
  
  return openaiClient;
};

export const sendMessage = async (messages: any[]) => {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized. Please provide an API key first.');
  }

  try {
    const response = await openaiClient.chat.completions.create({
      model: 'deepseek-r1-distill-llama-70b',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response;
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw error;
  }
};

export const isClientInitialized = () => {
  return !!openaiClient;
};

// Reset client (e.g., for logout)
export const resetClient = () => {
  openaiClient = null;
  apiKey = '';
};
