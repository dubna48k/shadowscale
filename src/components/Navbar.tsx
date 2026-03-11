import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";

const Navbar = () => {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/[0.06]"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center shrink-0">
          <span className="text-[14px] font-bold text-white">Scal</span>
          <span className="bg-white text-black text-[14px] font-bold px-1 py-0.5 rounded ml-0.5">Pass</span>
        </div>

        {/* Center links */}
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

        {/* CTA */}
        <a
          href="#download"
          className="glow-button inline-flex items-center gap-2 bg-coral text-white px-4 py-2 rounded-xl text-[13px] font-medium"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Descargar (3 días gratis)
        </a>
      </div>
    </motion.nav>
  );
};

export default Navbar;
