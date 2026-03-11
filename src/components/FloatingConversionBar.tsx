import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid } from "lucide-react";

const FloatingConversionBar = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="floating-bar"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] w-[90%] md:w-auto md:min-w-[500px]"
        >
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex justify-between items-center gap-8">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center shrink-0">
                <span className="text-[12px] font-bold text-white italic">Scal</span>
                <span className="bg-white text-black text-[10px] font-bold italic px-1 py-0.5 rounded ml-0.5">Pass</span>
              </div>
              <span className="text-[12px] text-gray-400 truncate">50+ Premium Tools</span>
            </div>
            <a
              href="#download"
              className="shrink-0 inline-flex items-center gap-1.5 bg-coral text-coral-foreground px-4 py-2 rounded-full text-[12px] font-bold shadow-[0_0_16px_rgba(255,90,54,0.35)] hover:shadow-[0_0_24px_rgba(255,90,54,0.5)] transition-shadow duration-300"
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

export default FloatingConversionBar;
