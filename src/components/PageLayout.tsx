import { Globe } from "lucide-react";
import Navbar from "./Navbar";
import { useSiteData } from "@/hooks/useSiteData";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const { settings } = useSiteData();

  const footerLinks = [
    { label: settings["footer_link_1_label"] ?? "Términos y Condiciones", href: settings["footer_link_1_href"] ?? "/terminos" },
    { label: settings["footer_link_2_label"] ?? "Política de Privacidad", href: settings["footer_link_2_href"] ?? "/politica" },
    { label: settings["footer_link_3_label"] ?? "Soporte", href: settings["footer_link_3_href"] ?? "/soporte" },
    { label: settings["footer_link_4_label"] ?? "Afiliados", href: settings["footer_link_4_href"] ?? "/afiliados" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <Navbar settings={settings} />
      <main>{children}</main>
      <footer className="border-t border-white/[0.06] px-6 py-8 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col gap-4 items-center text-center">
          <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-20 w-auto" />
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12px] text-gray-500">
            {footerLinks.map((link, i) => (
              <span key={link.href} className="flex items-center gap-2">
                {i > 0 && <span className="text-gray-700">|</span>}
                <a href={link.href} className="hover:text-white transition-colors">{link.label}</a>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-gray-600">{settings["footer_copyright"] ?? "© 2026 ShadowScale · Todos los derechos reservados"}</span>
            <button className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-300 transition-colors">
              <Globe className="w-3.5 h-3.5" /> Español
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
