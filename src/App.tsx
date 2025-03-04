
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Tutorial from "./pages/Tutorial";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { loadConfiguration } from "./services/configService";

const queryClient = new QueryClient();

// Component to handle config loading once at startup
const ConfigHandler = () => {
  const [configLoaded, setConfigLoaded] = useState(false);
  
  useEffect(() => {
    // Load configuration only once on initial load
    const loadConfig = async () => {
      if (!configLoaded) {
        try {
          const config = await loadConfiguration();
          if (config) {
            setConfigLoaded(true);
            console.log('Initial configuration loaded via ConfigHandler');
          } else {
            console.log('Failed to load initial configuration, will use defaults');
            // Still mark as loaded to prevent loops, we'll use defaults
            setConfigLoaded(true);
          }
        } catch (error) {
          console.error('Error in ConfigHandler loadConfiguration:', error);
          // Still mark as loaded to prevent loops, we'll use defaults
          setConfigLoaded(true);
        }
      }
    };
    
    loadConfig();
    
    // No cleanup needed as we're not setting up event listeners anymore
  }, [configLoaded]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <ConfigHandler />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
