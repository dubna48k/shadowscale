import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ToolsGrid from "@/components/ToolsGrid";
import BrowserSection from "@/components/BrowserSection";
import FAQSection from "@/components/FAQSection";
import { Download } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen mesh-gradient">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <HeroSection />
      <ToolsGrid searchQuery={searchQuery} />
      <BrowserSection />
      <FAQSection />

      {/* Footer CTA */}
      <section id="download" className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">¿Listo para ahorrar?</h2>
        <p className="text-muted-foreground mb-8">
          Descarga Scalboost Browser y empieza tu prueba gratuita de 3 días.
        </p>
        <button className="glow-button inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-2xl text-lg font-semibold hover:brightness-110 transition-all duration-300 shadow-lg shadow-primary/25">
          <Download className="w-5 h-5" />
          Descargar ahora
        </button>
      </section>

      <footer className="border-t border-glass py-8 text-center text-sm text-muted-foreground">
        © 2026 Scalboost. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Index;
