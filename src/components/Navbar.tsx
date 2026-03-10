import { motion } from "framer-motion";
import { Search, LayoutGrid } from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const Navbar = ({ searchQuery, onSearchChange }: NavbarProps) => {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-[hsl(0_0%_100%/0.08)]"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center shrink-0">
          <span className="text-lg font-bold tracking-tight text-foreground">
            Scal
          </span>
          <span className="bg-foreground text-background text-lg font-bold px-1.5 py-0.5 rounded-md ml-0.5">
            Pass
          </span>
        </div>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          {["Herramientas", "Afiliados", "Precios"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="nav-link text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 pb-0.5"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar herramientas..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-48 bg-secondary/60 border border-[hsl(0_0%_100%/0.1)] rounded-xl pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-coral/50 transition-all"
            />
          </div>
          <a
            href="#download"
            className="glow-button inline-flex items-center gap-2 bg-coral text-coral-foreground px-4 py-2 rounded-xl text-sm font-medium"
          >
            <LayoutGrid className="w-4 h-4" />
            Descargar (3 días gratis)
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
