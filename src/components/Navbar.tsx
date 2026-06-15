import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


const links = [
  { label: "Herramientas", href: "#herramientas" },
  { label: "Afiliados (próximamente)", href: "#" },
  { label: "Precios", href: "#pricing" },
];

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
        <a href="/" className="flex items-center shrink-0">
          <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-18 sm:h-20 w-auto" />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link text-[14px] font-light text-gray-400 hover:text-white transition-colors duration-200 pb-0.5"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <a
            href="#pricing"
            className="glow-button inline-flex items-center justify-center text-white font-bold transition-colors"
            style={{ background: "#f97316", borderRadius: "10px", padding: "8px 14px", fontSize: "13px" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ea580c")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f97316")}
          >
            <span className="hidden sm:inline">Comenzar ahora — $14.9/mes</span>
            <span className="sm:hidden">Comenzar — $14.9</span>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-1.5 text-gray-400 hover:text-white transition-colors"
            aria-label="Menu"
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
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
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-[14px] text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
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
