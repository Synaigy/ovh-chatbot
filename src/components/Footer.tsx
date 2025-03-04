
import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getConfig, forceConfigRefresh } from '@/services/aiService';

interface FooterProps {
  configError?: boolean;
}

const Footer = ({ configError = false }: FooterProps) => {
  const [config, setConfig] = useState({
    CONTACT_PERSON: {
      NAME: '',
      TITLE: '',
      PHOTO_URL: '',
      MEETING_URL: '',
      LINKEDIN_URL: ''
    },
    COMPANY: {
      NAME: ''
    }
  });
  
  const [loadError, setLoadError] = useState(false);
  
  useEffect(() => {
    // Load configuration directly from the API with a forced refresh
    const loadConfig = async () => {
      try {
        // Force a refresh of the configuration first
        await forceConfigRefresh();
        
        // Then get the config
        const dbConfig = await getConfig();
        if (dbConfig && dbConfig.CONTACT_NAME && dbConfig.COMPANY_NAME) {
          setConfig({
            CONTACT_PERSON: {
              NAME: dbConfig.CONTACT_NAME || '',
              TITLE: dbConfig.CONTACT_TITLE || '',
              PHOTO_URL: dbConfig.CONTACT_PHOTO || '',
              MEETING_URL: dbConfig.CONTACT_MEETING || '',
              LINKEDIN_URL: dbConfig.CONTACT_LINKEDIN || ''
            },
            COMPANY: {
              NAME: dbConfig.COMPANY_NAME || ''
            }
          });
          setLoadError(false);
        } else {
          setLoadError(true);
        }
      } catch (error) {
        console.error('Error loading footer configuration:', error);
        setLoadError(true);
      }
    };
    
    loadConfig();
    
    // Refresh config whenever component becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadConfig();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  const { CONTACT_PERSON, COMPANY } = config;
  const isError = configError || loadError;
  
  // Show error state if configuration couldn't be loaded
  if (isError) {
    return (
      <footer className="w-full bg-black/30 border-t border-white/10 mt-16 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center p-4">
            <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
            <h3 className="text-lg font-medium text-red-400">Konfigurationsfehler</h3>
            <p className="text-white/70 max-w-lg mx-auto mt-2">
              Die Konfiguration konnte nicht von der Datenbank geladen werden. 
              Bitte wenden Sie sich an den Administrator.
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-white/50">
            <p>© {new Date().getFullYear()}. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    );
  }
  
  // Only show contact information if we have proper data
  const hasContactInfo = CONTACT_PERSON.NAME && COMPANY.NAME;
  
  if (!hasContactInfo) {
    return (
      <footer className="w-full bg-black/30 border-t border-white/10 mt-16 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <p className="text-white/50">Lade Konfiguration...</p>
          </div>
        </div>
      </footer>
    );
  }
  
  return (
    <footer className="w-full bg-black/30 border-t border-white/10 mt-16 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-6 text-center">
          <p className="text-xl font-medium">
            <span className="text-white">Deine Cloud Services:</span>{" "}
            <span className="highlight-text">Nur einen Klick entfernt</span>
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center mb-6 md:mb-0">
            <div className="flex items-center mb-4 md:mb-0 md:mr-6">
              <div className="relative overflow-hidden rounded-full border-2 border-highlight w-16 h-16 mr-4">
                <img 
                  src={CONTACT_PERSON.PHOTO_URL} 
                  alt={CONTACT_PERSON.NAME} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{CONTACT_PERSON.NAME}</h3>
                <p className="text-sm text-white/70">{CONTACT_PERSON.TITLE}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a 
              href={CONTACT_PERSON.MEETING_URL} 
              className={cn(
                "flex items-center space-x-2 px-5 py-2 rounded-full",
                "bg-highlight hover:bg-highlight/90 text-white",
                "transition-all duration-300"
              )}
            >
              <Mail size={18} className="text-white" />
              <span>Expertengespräch vereinbaren</span>
            </a>
            <a 
              href={CONTACT_PERSON.LINKEDIN_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                "flex items-center space-x-2 px-5 py-2 rounded-full",
                "glass-morphism hover:highlight-glow",
                "transition-all duration-300"
              )}
            >
              <Linkedin size={18} className="text-highlight" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-white/50">
          <p>© {new Date().getFullYear()} {COMPANY.NAME}. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
