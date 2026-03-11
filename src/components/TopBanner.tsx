import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TopBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="top-banner"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[9999] bg-coral py-2 text-center"
        >
          <span className="text-[12px] sm:text-[13px] font-medium text-coral-foreground">
            Desbloquea más de 50 herramientas premium – Comienza tu prueba gratuita de 3 días
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopBanner;
