import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid } from "lucide-react";

const StickyConversionBar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="sticky-bar"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-4xl"
        >
          <div className="bg-black/80 backdrop-blur-lg border border-white/10 rounded-full px-6 py-3 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center shrink-0">
                <span className="text-xs font-bold text-white italic">Scal</span>
                <span className="bg-white text-black text-[10px] font-bold italic px-1 py-0.5 rounded ml-0.5">Pass</span>
              </div>
              <span className="text-xs text-gray-400 hidden sm:inline">50+ Tools</span>
            </div>
            <a
              href="#download"
              className="shrink-0 inline-flex items-center gap-1.5 bg-coral text-white px-4 py-2 rounded-full text-xs font-semibold shadow-[0_0_20px_rgba(255,90,54,0.4)]"
            >
              <LayoutGrid className="w-3 h-3" />
              Descargar
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyConversionBar;
