import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useSearchParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const RefCapture = () => {
  const [params] = useSearchParams();
  useEffect(() => {
    const ref = params.get("ref");
    if (ref) localStorage.setItem("ss_ref", ref);
  }, []);
  return null;
};
import Index from "./pages/Index.tsx";
import Admin from "./pages/Admin.tsx";
import Terminos from "./pages/Terminos.tsx";
import Politica from "./pages/Politica.tsx";
import Soporte from "./pages/Soporte.tsx";
import Afiliados from "./pages/Afiliados.tsx";
import AfiliadoAuth from "./pages/AfiliadoAuth.tsx";
import AfiliadoDashboard from "./pages/AfiliadoDashboard.tsx";
import Checkout from "./pages/Checkout.tsx";
import Gracias from "./pages/Gracias.tsx";
import ClienteAuth from "./pages/ClienteAuth.tsx";
import CuentaDashboard from "./pages/CuentaDashboard.tsx";
import PagoPendiente from "./pages/PagoPendiente.tsx";
import PagoRechazado from "./pages/PagoRechazado.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RefCapture />
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
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/gracias" element={<Gracias />} />
          <Route path="/cuenta" element={<CuentaDashboard />} />
          <Route path="/cuenta/login" element={<ClienteAuth />} />
          <Route path="/cuenta/registro" element={<ClienteAuth />} />
          <Route path="/pago-pendiente" element={<PagoPendiente />} />
          <Route path="/pago-rechazado" element={<PagoRechazado />} />
          <Route path="/cuenta/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
