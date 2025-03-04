
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Tutorial from "./pages/Tutorial";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import { initializeConfigDetection } from "./services/configService";

const queryClient = new QueryClient();

// Component to handle config change detection only once per route change
const ConfigChangeDetector = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Initialize config detection with proper timing
    const cleanup = initializeConfigDetection();
    
    return cleanup;
    // We only want to run this once per route change
  }, [location.pathname]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <ConfigChangeDetector />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
