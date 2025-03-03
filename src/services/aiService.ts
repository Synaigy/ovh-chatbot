
import OpenAI from 'openai';

// In a production environment, this would be loaded from environment variables
const API_ENDPOINT = 'https://deepseek-r1-distill-llama-70b.endpoints.kepler.ai.cloud.ovh.net/api/openai_compat/v1';

// Note: API key would typically come from environment variables
// in a production environment
let apiKey = '=eyJhbGciOiJFZERTQSJ9.eyJwcm9qZWN0IjoiMDM3YTQ4YzhhNTU4NDExMmI4ZmFiZDM1ZGE4YTk4N2EiLCJhdWQiOiIzNzM4NjExNjY0MDQzMDM0IiwiZXhwIjoxNzcyNTI1NDQ3LCJqdGkiOiIzYjcyNTc3MC0wMWEyLTRiYmYtYTUxOS1kZTVhZmZjYjI4OWQiLCJpc3MiOiJ0cmFpbmluZy5haS5jbG91ZC5vdmgubmV0Iiwic3ViIjoidnMyMjc3MDMtb3ZoIiwib3ZoVG9rZW4iOiIzeGlxb3Z2RmNyaTMtTU1pd2dxa1U3TklDdXZtV0Y2dW5yWE5xeG9Ra0E2RE9lUDNiQ1dsX045T19MYnA0ZDdwN1pPa19GQTdZMk9iZjBxc2plZ2lxRXV3c1dTNWFLM25RMU5jaVJnNHNqdS1BYzMwQy1nLWFOcE4zaDdfZTk0a2tjSGxoaWFEeE1fUUp6WEVIY0dicHhZaHNXNURpa3NOczhOZkljYld4aE5HTVNhNmhQZXBPcnlOb05xNzhZUWFFQWhHMElNaC00Vm1lME52UUhXNWRGR3h6bGV2eWJ2NmlibHFIVGVRR2RmRHJ2NENiaFhUSEIyTkZKeXZ3c21IaG9lMFM3Z3VwSTQ5MV93am5IckpGSVlPQkpiVFU1WVJ6N19HMEtkNko1M0tfYWg0amRaREN3NGt3aXBuMkU3cy13V1NoektLcE1scG5vS2tZTzYwZHFDT3l2S2RjOU1HcUNRTl9OWUxUWFM5YWdxYXpMSzZGYzdrcWVYMWEwbEJDLWVvNGFEb085eG9wWkJwdzRiMFdtc2VCaXRNaTlqa1dBV2RZU2JzT1NjLTd4MFVTY1pxb1AyVUtabk9CTnY1cDVkM1RIVjNnM3RNMnU5enJRMzFzN1lmNmNPUXdlcTludjdDUDFUY0RqcXVrSUZCemthY3FmWFFmSEtGWE9Gajd1ZW1WV0RuSWFwNElhRks5bE10SEwwVV9McWowZHlXUFJtYjlZWm5LLWZVWWI1Unh0R3hGTlhyLVRHLWlkdUtnMnVaSU1QTy0zMUVfS2VnSmU5WG5OSUhqaG9SaGt2a182aFRHemlhVTg4STNkRzdabWhrZkh4Y2QtNHYwMWsxZmlfaWhTb1paUFRDeFVZTmtPRWlNR0QxTUliUlE3X2dPWl9wTC1DOWI3cDdueEo3S3RuUEdBZlZJS0hhREFXWmtoNlE4VmM2UFFqa0J5SEFLM3JLMHllcXgxNEdnZUxUT3RCZDIya0RXZ1NjeFc4QXlKdk1FSlFneW5tSjlmX1J4NzcwUTRwaENXU3hTanFpQXBFajNQZFNUZVM1WHU3bndLZFZsd3ZSakpocU95cl9HNEl2Z1NfUTBZTE5sejQ5ZXFaU2dXcVdOOUo2WDVqeG5EODdyOXZISGc3YkNuY2xSRUdqVS04dUtsUkZ2akliczNWU3NHNi1yTW5zU2VBR2l2TEM3SlJUNzNGNDQ1b05lcEo2cHdKY3lHWGJWSzFoVWxJZ3phT19VeFluVC1CMW05eXY4NmR6Ti1JeXlaYVkwSl9QWHlOTjJJdV94MHhvZHg1dFR4ZVU5WDVDM29NemZDQWRUaG1KYmh0bSJ9.uzey-28dSX6ZsWJcUFw7Y9Cal1LtlXT0ttrE0ScxHdPs5LOxQYXgs9AK1M-EUkgizraZXT2ToBRYInPiSB30Dg';

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
