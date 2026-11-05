import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import States from "./pages/States";
import Features from "./pages/Features";
import NotFound from "./pages/NotFound";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import { AuthProvider } from "./contexts/AuthContext";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";
import { SiteSupportChat } from "./components/SiteSupportChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <SiteSettingsProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/generator" element={<Index />} />
              <Route path="/states" element={<States />} />
              <Route path="/features" element={<Features />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <SiteSupportChat />
          </SiteSettingsProvider>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
