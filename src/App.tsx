import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { getConfig, forceConfigRefresh } from "./services/aiService";
import { toast } from "@/components/ui/use-toast";

const queryClient = new QueryClient();

// Component to handle config loading once at startup
const ConfigHandler = () => {
  const [configLoaded, setConfigLoaded] = useState(false);
  const [configError, setConfigError] = useState(false);
  
  useEffect(() => {
    const loadConfig = async () => {
      if (!configLoaded) {
        try {
          const refreshSuccess = await forceConfigRefresh();
          
          if (refreshSuccess) {
            setConfigLoaded(true);
            setConfigError(false);
            console.log('Initial configuration loaded via ConfigHandler');
          } else {
            console.log('Failed to load initial configuration');
            setConfigError(true);
            
            toast({
              title: "Konfigurationsfehler",
              description: "Die Konfiguration konnte nicht von der Datenbank geladen werden. Bitte wenden Sie sich an den Administrator.",
              variant: "destructive",
            });
            
            setConfigLoaded(true);
          }
        } catch (error) {
          console.error('Error in ConfigHandler loadConfiguration:', error);
          setConfigError(true);
          
          toast({
            title: "Konfigurationsfehler",
            description: "Die Konfiguration konnte nicht von der Datenbank geladen werden. Bitte wenden Sie sich an den Administrator.",
            variant: "destructive",
          });
          
          setConfigLoaded(true);
        }
      }
    };
    
    loadConfig();
    
    const refreshInterval = setInterval(() => {
      forceConfigRefresh().then((success) => {
        if (success) {
          console.log('Configuration refreshed periodically');
          if (configError) {
            setConfigError(false);
            
            toast({
              title: "Konfiguration wiederhergestellt",
              description: "Die Verbindung zur Datenbank wurde wiederhergestellt.",
              variant: "default",
            });
          }
        } else if (!configError) {
          setConfigError(true);
          
          toast({
            title: "Konfigurationsfehler",
            description: "Die Konfiguration konnte nicht von der Datenbank geladen werden. Bitte wenden Sie sich an den Administrator.",
            variant: "destructive",
          });
        }
      }).catch(error => {
        console.error('Error refreshing configuration:', error);
        setConfigError(true);
      });
    }, 60000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [configLoaded, configError]);
  
  return null;
};

const App = () => {
  const [configLoaded, setConfigLoaded] = useState(false);
  const [configError, setConfigError] = useState(false);
  
  useEffect(() => {
    const initialConfigCheck = async () => {
      try {
        const config = await getConfig();
        if (config && config.API_ENDPOINT && config.API_KEY) {
          setConfigLoaded(true);
        } else {
          setConfigError(true);
          toast({
            title: "Konfigurationsfehler",
            description: "Die Konfiguration konnte nicht geladen werden. Bitte wenden Sie sich an den Administrator.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error loading initial configuration:", error);
        setConfigError(true);
        toast({
          title: "Konfigurationsfehler",
          description: "Die Konfiguration konnte nicht geladen werden. Bitte wenden Sie sich an den Administrator.",
          variant: "destructive",
        });
      }
    };
    
    initialConfigCheck();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <ConfigHandler />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer configError={configError} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
