import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ToolsGrid from "@/components/ToolsGrid";
import BrowserSection from "@/components/BrowserSection";
import FAQSection from "@/components/FAQSection";
import FloatingConversionBar from "@/components/FloatingConversionBar";
import TopBanner from "@/components/TopBanner";
import { Download, Globe } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen mesh-gradient">
      <Navbar />
      <TopBanner />
      <FloatingConversionBar />
      <HeroSection />
      <ToolsGrid searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BrowserSection />
      <FAQSection />

      {/* Footer CTA */}
      <section id="download" className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
        <h2 className="text-xl font-bold text-white mb-3">¿Listo para ahorrar?</h2>
        <p className="text-[13px] text-gray-500 mb-6">
          Descarga ScalPass Browser y empieza tu prueba gratuita de 3 días.
        </p>
        <button className="glow-button inline-flex items-center gap-2 bg-coral text-white px-6 py-2.5 rounded-xl text-[14px] font-semibold shadow-[0_0_25px_4px_rgba(255,90,54,0.4)]">
          <Download className="w-4 h-4" />
          Descargar ahora
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-[13px] font-bold text-white">Scal</span>
            <span className="bg-white text-black text-[13px] font-bold px-1 py-0.5 rounded ml-0.5">Pass</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-gray-600">© 2026 ScalPass</span>
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
