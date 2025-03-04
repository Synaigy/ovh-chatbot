
/**
 * This file simulates environment variables for frontend-only applications
 * In a real production environment, these values would be injected during build time
 * or managed through a backend service to avoid exposing tokens in client-side code.
 */

export const API_CONFIG = {
  ENDPOINT: 'https://deepseek-r1-distill-llama-70b.endpoints.kepler.ai.cloud.ovh.net/api/openai_compat/v1',
  API_KEY: '<TOKEN>',
};

export const FOOTER_CONFIG = {
  CONTACT_PERSON: {
    NAME: 'Marc Achsnich',
    TITLE: 'Head of Cloud',
    PHOTO_URL: 'https://profile-images.xing.com/images/0bac708fee0a79e6e7186a5fb08af312-26/marc-achsnich.1024x1024.jpg',
    MEETING_URL: 'https://meetings.hubspot.com/frank-hoerning/expertengesprach-kreativer-dialog?uuid=e99278b4-1943-4661-ab4e-9d07a49536cf',
    LINKEDIN_URL: 'https://www.linkedin.com/in/achsnich/'
  },
  COMPANY: {
    NAME: 'Synaigy GmbH'
  }
};

// Admin password (in a real app, this would be hashed and stored securely)
export const ADMIN_PASSWORD = 'admin123';

