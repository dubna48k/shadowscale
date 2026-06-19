import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ToolsGrid from "@/components/ToolsGrid";
import BrowserSection from "@/components/BrowserSection";
import FloatingConversionBar from "@/components/FloatingConversionBar";
import TopBanner from "@/components/TopBanner";
import TestimonialsSection from "@/components/TestimonialsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PricingSection from "@/components/PricingSection";
import { useSiteData } from "@/hooks/useSiteData";
import { useAnalytics } from "@/hooks/useAnalytics";


const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { tools, categories, plans, settings, loading } = useSiteData();
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
    <div className="min-h-screen mesh-gradient" style={{ opacity: loading ? 0 : 1, transition: "opacity 0.18s ease" }}>
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
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection supabasePlans={plans} settings={settings} />

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
              { label: "Mi cuenta", href: "/cuenta" },
            ].map((link, i) => (
              <span key={link.href} className="flex items-center gap-2">
                {i > 0 && <span className="text-gray-700">|</span>}
                <a href={link.href} className="hover:text-white transition-colors">{link.label}</a>
              </span>
            ))}
          </div>
          <span className="text-[12px] text-gray-600">{settings["footer_copyright"] ?? "© 2026 ShadowScale · Todos los derechos reservados"}</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;

