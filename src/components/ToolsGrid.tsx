import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  color: string;
  initial: string;
}

const tools: Tool[] = [
  // Fila 1
  { id: "claude", name: "Claude Pro", category: "IA", categoryId: "ia", color: "bg-amber-600", initial: "C" },
  { id: "chatgpt", name: "ChatGPT Plus", category: "IA", categoryId: "ia", color: "bg-emerald-600", initial: "G" },
  { id: "midjourney", name: "Midjourney", category: "IA", categoryId: "ia", color: "bg-indigo-500", initial: "M" },
  { id: "canva", name: "Canva Pro", category: "Diseño", categoryId: "design", color: "bg-cyan-500", initial: "C" },
  { id: "capcut", name: "Capcut Pro", category: "Video", categoryId: "video", color: "bg-violet-500", initial: "C" },
  { id: "kalodata", name: "Kalodata", category: "Ecommerce", categoryId: "ecommerce", color: "bg-blue-600", initial: "K" },
  // Fila 2
  { id: "fastmoss", name: "FastMoss", category: "Ecommerce", categoryId: "ecommerce", color: "bg-orange-500", initial: "F" },
  { id: "elevenlabs", name: "ElevenLabs", category: "IA", categoryId: "ia", color: "bg-gray-700", initial: "E" },
  { id: "envato", name: "Envato Elements", category: "Diseño", categoryId: "design", color: "bg-green-500", initial: "E" },
  { id: "freepik", name: "Freepik Premium", category: "Diseño", categoryId: "design", color: "bg-blue-700", initial: "F" },
  { id: "nordvpn", name: "NordVPN", category: "Seguridad", categoryId: "security", color: "bg-blue-500", initial: "N" },
  { id: "grammarly", name: "Grammarly", category: "Productividad", categoryId: "productivity", color: "bg-emerald-500", initial: "G" },
];

const categories = [
  { id: "all", label: "Todo" },
  { id: "ia", label: "IA" },
  { id: "design", label: "Diseño" },
  { id: "video", label: "Video y Edición" },
  { id: "ecommerce", label: "Ecommerce" },
  { id: "productivity", label: "Productividad" },
  { id: "security", label: "Seguridad" },
];

interface ToolsGridProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
}

const ToolsGrid = ({ searchQuery, onSearchChange }: ToolsGridProps) => {
  const [active, setActive] = useState("all");
  const [isExpanded, setIsExpanded] = useState(false);

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchCat = active === "all" || t.categoryId === active;
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [active, searchQuery]);

  return (
    <section
      id="herramientas"
      className="px-4 sm:px-8 py-8 sm:py-10"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.08) 0%, transparent 60%), #0a0a0a",
      }}
    >
      <div className="max-w-5xl mx-auto">
      {/* Search */}
      <div className="max-w-xl mx-auto mb-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search Tools"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#141416] border border-white/[0.08] rounded-full pl-10 pr-5 py-2.5 text-[14px] text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/15 transition-all"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`px-3.5 py-1 rounded-full text-[13px] font-medium transition-all duration-200 ${
              active === cat.id
                ? "bg-white text-black"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="mb-5 text-center">
        <h2 className="text-white text-[20px] sm:text-[24px] font-bold mb-1.5">
          Tu arsenal de herramientas premium 🛠️
        </h2>
        <p className="text-[13px] text-gray-400">
          Todas con inicio de sesión instantáneo — sin contraseñas, sin esperas
        </p>
      </div>

      <div className="flex items-center justify-end mb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-[13px] text-gray-400 hover:text-white transition-colors duration-200"
        >
          Mostrar Todo
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Grid */}
      <div className="relative">
        <div
          className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
          style={{ maxHeight: isExpanded ? "2000px" : "120px" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
            <AnimatePresence mode="popLayout">
              {filtered.map((tool) => (
                <motion.div
                  key={tool.id}
                  layout
                  layoutId={tool.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="bg-[#161618] rounded-xl p-3 cursor-pointer hover:bg-[#1e1e22] transition-colors duration-150"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 shrink-0 rounded-xl ${tool.color} flex items-center justify-center text-[11px] font-bold text-white`}>
                      {tool.initial}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[13px] font-semibold text-white truncate">{tool.name}</h3>
                      <p className="text-[11px] text-gray-500 truncate">{tool.category}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsGrid;
