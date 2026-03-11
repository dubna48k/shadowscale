import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid } from "lucide-react";

const FloatingBar = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 450);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl"
        >
          <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center shrink-0">
                <span className="text-[12px] sm:text-[13px] font-bold text-white italic">Scal</span>
                <span className="bg-white text-black text-[11px] sm:text-[12px] font-bold italic px-1 py-0.5 rounded ml-0.5">Pass</span>
              </div>
              <span className="text-[11px] sm:text-[13px] text-gray-400 truncate hidden sm:inline">
                50+ herramientas premium
              </span>
            </div>
            <a
              href="#download"
              className="shrink-0 inline-flex items-center gap-1.5 bg-coral text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[13px] font-semibold shadow-[0_0_20px_rgba(255,90,54,0.4)] hover:shadow-[0_0_30px_rgba(255,90,54,0.6)] transition-shadow duration-300"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Descargar (3 días gratis)
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingBar;
