import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ToolsGrid from "@/components/ToolsGrid";
import BrowserSection from "@/components/BrowserSection";
import FAQSection from "@/components/FAQSection";
import FloatingConversionBar from "@/components/FloatingConversionBar";
import TopBanner from "@/components/TopBanner";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import { Globe } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen mesh-gradient">
      <TopBanner />
      <Navbar />
      <FloatingConversionBar />
      <HeroSection />
      <ToolsGrid searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BrowserSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-4 items-center text-center">
          <div className="flex items-center">
            <span className="text-[13px] font-bold text-white">Shadow</span>
            <span className="bg-white text-black text-[13px] font-bold px-1 py-0.5 rounded ml-0.5">Scale</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12px] text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
            <span className="text-gray-700">|</span>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
            <span className="text-gray-700">|</span>
            <a href="#" className="hover:text-white transition-colors">Soporte</a>
            <span className="text-gray-700">|</span>
            <a href="#" className="hover:text-white transition-colors">Afiliados</a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-gray-600">© 2025 ShadowScale · Todos los derechos reservados</span>
            <button className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-300 transition-colors">
              <Globe className="w-3.5 h-3.5" />
              Español
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

