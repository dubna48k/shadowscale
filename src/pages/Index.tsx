import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ToolsGrid from "@/components/ToolsGrid";
import BrowserSection from "@/components/BrowserSection";
import FAQSection from "@/components/FAQSection";
import FloatingConversionBar from "@/components/FloatingConversionBar";
import TopBanner from "@/components/TopBanner";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import { useSiteData } from "@/hooks/useSiteData";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Globe } from "lucide-react";


const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { tools, categories, plans, settings } = useSiteData();
  useAnalytics();

  useEffect(() => {
    const clarityId = settings["clarity_id"];
    if (!clarityId || document.getElementById("clarity-script")) return;
    const s = document.createElement("script");
    s.id = "clarity-script";
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${clarityId}`;
    document.head.appendChild(s);
  }, [settings]);

  return (
    <div className="min-h-screen mesh-gradient">
      <TopBanner settings={settings} />
      <Navbar settings={settings} />
      <FloatingConversionBar settings={settings} />
      <HeroSection settings={settings} />
      <ToolsGrid
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        supabaseTools={tools}
        supabaseCategories={categories}
        settings={settings}
      />
      <BrowserSection settings={settings} />
      <TestimonialsSection />
      <PricingSection supabasePlans={plans} settings={settings} />
      <FAQSection />

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-4 items-center text-center">
          <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-20 w-auto" />
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12px] text-gray-500">
            {[
              { label: settings["footer_link_1_label"] ?? "Términos y Condiciones", href: settings["footer_link_1_href"] ?? "/terminos" },
              { label: settings["footer_link_2_label"] ?? "Política de Privacidad", href: settings["footer_link_2_href"] ?? "/politica" },
              { label: settings["footer_link_3_label"] ?? "Soporte", href: settings["footer_link_3_href"] ?? "/soporte" },
              { label: settings["footer_link_4_label"] ?? "Afiliados", href: settings["footer_link_4_href"] ?? "/afiliados" },
            ].map((link, i) => (
              <span key={link.href} className="flex items-center gap-2">
                {i > 0 && <span className="text-gray-700">|</span>}
                <a href={link.href} className="hover:text-white transition-colors">{link.label}</a>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-gray-600">{settings["footer_copyright"] ?? "© 2026 ShadowScale · Todos los derechos reservados"}</span>
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

