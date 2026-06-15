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
  badge?: "nuevo" | "prueba";
}

const tools: Tool[] = [
  { id: "chatgpt", name: "ChatGPT Plus", category: "IA", categoryId: "ia", color: "bg-emerald-600", initial: "G" },
  { id: "claude", name: "Claude Pro", category: "IA", categoryId: "ia", color: "bg-orange-500", initial: "C", badge: "nuevo" },
  { id: "perplexity", name: "Perplexity Pro", category: "IA", categoryId: "ia", color: "bg-teal-500", initial: "P" },
  { id: "gemini", name: "Gemini Advanced", category: "IA", categoryId: "ia", color: "bg-sky-500", initial: "G", badge: "nuevo" },
  { id: "grok", name: "Grok Premium", category: "IA", categoryId: "ia", color: "bg-neutral-500", initial: "G" },
  { id: "elevenlabs", name: "ElevenLabs Creator", category: "IA", categoryId: "ia", color: "bg-gray-700", initial: "E" },
  { id: "higgsfield", name: "Higgsfield Plus", category: "IA", categoryId: "ia", color: "bg-pink-500", initial: "H" },
  { id: "leonardo", name: "Leonardo AI Pro", category: "IA", categoryId: "ia", color: "bg-purple-500", initial: "L" },
  { id: "hailuo", name: "Hailuo AI", category: "IA", categoryId: "ia", color: "bg-yellow-600", initial: "H", badge: "nuevo" },
  { id: "canva", name: "Canva Pro", category: "Diseño", categoryId: "design", color: "bg-cyan-500", initial: "C" },
  { id: "freepik", name: "Freepik Premium", category: "Diseño", categoryId: "design", color: "bg-blue-700", initial: "F" },
  { id: "envato", name: "Envato Elements", category: "Diseño", categoryId: "design", color: "bg-lime-600", initial: "E" },
  { id: "midjourney", name: "Midjourney", category: "Diseño", categoryId: "design", color: "bg-indigo-500", initial: "M" },
  { id: "capcut", name: "CapCut Pro", category: "Video y Edición", categoryId: "video", color: "bg-violet-500", initial: "C" },
  { id: "runway", name: "Runway Pro", category: "Video y Edición", categoryId: "video", color: "bg-rose-500", initial: "R" },
  { id: "seedance", name: "Seedance Pro", category: "Video y Edición", categoryId: "video", color: "bg-amber-500", initial: "S" },
  { id: "adspy", name: "AdSpy", category: "Espionaje", categoryId: "spy", color: "bg-red-600", initial: "A" },
  { id: "minea", name: "Minea", category: "Espionaje", categoryId: "spy", color: "bg-fuchsia-600", initial: "M" },
  { id: "similarweb", name: "SimilarWeb", category: "Espionaje", categoryId: "spy", color: "bg-cyan-700", initial: "S" },
  { id: "kalodata", name: "Kalodata", category: "Ecommerce", categoryId: "ecommerce", color: "bg-violet-600", initial: "K" },
  { id: "dropkiller", name: "Dropkiller", category: "Ecommerce", categoryId: "ecommerce", color: "bg-green-700", initial: "D", badge: "nuevo" },
  { id: "fastmoss", name: "FastMoss", category: "Ecommerce", categoryId: "ecommerce", color: "bg-emerald-700", initial: "F" },
];

const categories = [
  { id: "all", label: "Todo" },
  { id: "ia", label: "IA" },
  { id: "design", label: "Diseño" },
  { id: "video", label: "Video y Edición" },
  { id: "spy", label: "Espionaje" },
  { id: "ecommerce", label: "Ecommerce" },
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
              placeholder="Buscar herramientas..."
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
            {isExpanded ? "Mostrar menos" : "Mostrar todo"}
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
                    className="relative bg-[#161618] rounded-xl p-3 cursor-pointer hover:bg-[#1e1e22] transition-colors duration-150"
                  >
                    {tool.badge && (
                      <span
                        className="absolute -top-1.5 -right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: tool.badge === "nuevo" ? "#f97316" : "#7c3aed",
                          color: "#fff",
                          letterSpacing: "0.3px",
                        }}
                      >
                        {tool.badge === "nuevo" ? "NUEVO" : "BETA"}
                      </span>
                    )}
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
      </div>
    </section>
  );
};

export default ToolsGrid;
