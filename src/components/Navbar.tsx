import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      className="relative z-50 bg-background/80 backdrop-blur-xl border-b border-white/[0.06]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center shrink-0">
          <span className="text-[14px] font-bold text-white">Shadow</span>
          <span className="bg-white text-black text-[14px] font-bold px-1 py-0.5 rounded ml-0.5">Scale</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {["Herramientas", "Afiliados", "Precios"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="nav-link text-[14px] font-light text-gray-400 hover:text-white transition-colors duration-200 pb-0.5"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <a
            href="#download"
            className="glow-button inline-flex items-center gap-1.5 bg-coral text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[12px] sm:text-[13px] font-medium"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Descargar</span>
            <span className="sm:hidden">Descargar</span>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/[0.06] overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-3">
              {["Herramientas", "Afiliados", "Precios"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-[14px] text-gray-400 hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
