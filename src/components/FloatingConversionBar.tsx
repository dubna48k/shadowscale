import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid } from "lucide-react";

interface FloatingConversionBarProps {
  settings?: Record<string, string>;
}

const FloatingConversionBar = ({ settings = {} }: FloatingConversionBarProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const text = settings["floatbar_text"] ?? "Desbloquea todas las herramientas premium";
  const ctaText = settings["floatbar_cta_text"] ?? settings["cta_text"] ?? "Comenzar ahora";
  const ctaLink = settings["floatbar_cta_link"] ?? settings["cta_link"] ?? "#pricing";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="bottom-bar"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[9999]"
        >
          <div className="bg-[hsl(var(--background))] border-t border-white/[0.08] px-4 sm:px-8 py-3 flex items-center justify-center gap-4 sm:gap-6">
            <span className="text-[12px] sm:text-[13px] text-muted-foreground">
              {text}
            </span>
            <a
              href={ctaLink}
              className="shrink-0 inline-flex items-center gap-2 bg-coral text-coral-foreground px-4 sm:px-5 py-2 rounded-lg text-[12px] sm:text-[13px] font-semibold shadow-[0_0_16px_rgba(255,90,54,0.35)] hover:shadow-[0_0_24px_rgba(255,90,54,0.5)] transition-shadow duration-300"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              {ctaText}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingConversionBar;
