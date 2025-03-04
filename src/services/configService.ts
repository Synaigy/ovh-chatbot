
import { API_CONFIG, FOOTER_CONFIG } from '@/config/env';
import { toast } from '@/components/ui/use-toast';

// Store initial configuration
let currentApiConfig = { ...API_CONFIG };
let currentFooterConfig = { ...FOOTER_CONFIG };

// Function to check if configuration has changed
export const detectConfigChanges = () => {
  // Check if API configuration has changed
  if (
    currentApiConfig.ENDPOINT !== API_CONFIG.ENDPOINT ||
    currentApiConfig.API_KEY !== API_CONFIG.API_KEY
  ) {
    toast({
      title: "Konfiguration aktualisiert",
      description: "Die API-Konfiguration wurde geändert. Die Änderungen werden jetzt wirksam.",
      variant: "default",
    });
    
    // Update stored configuration
    currentApiConfig = { ...API_CONFIG };
    
    // Force refresh to apply new configuration
    window.location.reload();
    return true;
  }
  
  // Check if footer configuration has changed
  if (
    currentFooterConfig.CONTACT_PERSON.NAME !== FOOTER_CONFIG.CONTACT_PERSON.NAME ||
    currentFooterConfig.CONTACT_PERSON.TITLE !== FOOTER_CONFIG.CONTACT_PERSON.TITLE ||
    currentFooterConfig.CONTACT_PERSON.PHOTO_URL !== FOOTER_CONFIG.CONTACT_PERSON.PHOTO_URL ||
    currentFooterConfig.CONTACT_PERSON.MEETING_URL !== FOOTER_CONFIG.CONTACT_PERSON.MEETING_URL ||
    currentFooterConfig.CONTACT_PERSON.LINKEDIN_URL !== FOOTER_CONFIG.CONTACT_PERSON.LINKEDIN_URL ||
    currentFooterConfig.COMPANY.NAME !== FOOTER_CONFIG.COMPANY.NAME
  ) {
    toast({
      title: "Konfiguration aktualisiert",
      description: "Die Kontakt- und Firmeninformationen wurden geändert. Die Änderungen werden jetzt wirksam.",
      variant: "default",
    });
    
    // Update stored configuration
    currentFooterConfig = { ...FOOTER_CONFIG };
    
    // Force refresh to apply new configuration
    window.location.reload();
    return true;
  }
  
  return false;
};
