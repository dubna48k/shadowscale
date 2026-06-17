import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Admin from "./pages/Admin.tsx";
import Terminos from "./pages/Terminos.tsx";
import Politica from "./pages/Politica.tsx";
import Soporte from "./pages/Soporte.tsx";
import Afiliados from "./pages/Afiliados.tsx";
import AfiliadoAuth from "./pages/AfiliadoAuth.tsx";
import AfiliadoDashboard from "./pages/AfiliadoDashboard.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/politica" element={<Politica />} />
          <Route path="/soporte" element={<Soporte />} />
          <Route path="/afiliados" element={<Afiliados />} />
          <Route path="/afiliados/registro" element={<AfiliadoAuth />} />
          <Route path="/afiliados/login" element={<AfiliadoAuth />} />
          <Route path="/afiliados/dashboard" element={<AfiliadoDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
