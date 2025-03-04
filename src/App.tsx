
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
import { loadConfiguration, initializeConfigDetection } from "./services/configService";

const queryClient = new QueryClient();

// Component to handle config loading and change detection
const ConfigHandler = () => {
  const location = useLocation();
  const [configLoaded, setConfigLoaded] = useState(false);
  
  useEffect(() => {
    // Load configuration on first render
    if (!configLoaded) {
      loadConfiguration().then(() => {
        setConfigLoaded(true);
        console.log('Initial configuration loaded via ConfigHandler');
      });
    }
    
    // Initialize config detection with proper timing - once per route change
    const cleanup = initializeConfigDetection();
    
    return cleanup;
  }, [location.pathname, configLoaded]);
  
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
