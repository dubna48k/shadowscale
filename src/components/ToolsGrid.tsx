import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  icon: string;
}

const tools: Tool[] = [
  { id: "perplexity", name: "Perplexity", category: "IA", categoryId: "ia", icon: "P" },
  { id: "dropkiller", name: "Dropkiller", category: "Ecommerce", categoryId: "ecommerce", icon: "D" },
  { id: "fishaudio", name: "FishAudio", category: "Audio", categoryId: "audio", icon: "F" },
  { id: "envato", name: "Envato", category: "Diseño", categoryId: "design", icon: "E" },
  { id: "canva", name: "Canva Pro", category: "Diseño", categoryId: "design", icon: "C" },
  { id: "fastmoss", name: "FastMoss", category: "Espionaje", categoryId: "spy", icon: "F" },
  { id: "similarweb", name: "SimilarWeb", category: "Espionaje", categoryId: "spy", icon: "S" },
  { id: "claude", name: "Claude", category: "IA", categoryId: "ia", icon: "C" },
  { id: "adspy", name: "Adspy", category: "Espionaje", categoryId: "spy", icon: "A" },
  { id: "gethookd", name: "Gethookd", category: "Video", categoryId: "video", icon: "G" },
  { id: "brainfm", name: "BrainFM", category: "Audio", categoryId: "audio", icon: "B" },
  { id: "foreplay", name: "Foreplay", category: "Espionaje", categoryId: "spy", icon: "F" },
  { id: "hailuo", name: "Hailuo", category: "Video", categoryId: "video", icon: "H" },
  { id: "chatgpt", name: "ChatGPT Pro", category: "IA", categoryId: "ia", icon: "C" },
  { id: "minea", name: "Minea", category: "Ecommerce", categoryId: "ecommerce", icon: "M" },
  { id: "midjourney", name: "Midjourney", category: "Diseño", categoryId: "design", icon: "M" },
  { id: "elevenlabs", name: "ElevenLabs", category: "IA", categoryId: "ia", icon: "E" },
  { id: "sora", name: "Sora", category: "Video", categoryId: "video", icon: "S" },
  { id: "kalodata", name: "Kalodata", category: "Ecommerce", categoryId: "ecommerce", icon: "K" },
  { id: "trendlab", name: "TrendLab", category: "Espionaje", categoryId: "spy", icon: "T" },
];

const categories = [
  { id: "all", label: "Todo" },
  { id: "ia", label: "IA" },
  { id: "video", label: "Video y Edición" },
  { id: "design", label: "Diseño" },
  { id: "spy", label: "Espionaje" },
  { id: "ecommerce", label: "Ecommerce" },
  { id: "audio", label: "Audio" },
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
    <section id="tools" className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-bold">Explora Herramientas Premium</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-white text-[12px] font-medium px-3 py-1 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          {isExpanded ? (
            <>Mostrar menos <ChevronUp className="w-3 h-3" /></>
          ) : (
            <>Mostrar todo <ChevronDown className="w-3 h-3" /></>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="max-w-sm mx-auto mb-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar herramientas"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#111113] border border-white/[0.08] rounded-full pl-9 pr-4 py-2 text-[13px] text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-white/15 transition-all"
          />
        </div>
      </div>

      {/* Pills */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all duration-200 ${
              active === cat.id
                ? "bg-white text-black"
                : "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid with expand/collapse */}
      <div className="relative">
        <div
          className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
          style={{ maxHeight: isExpanded ? "2000px" : "220px" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
                  className="bg-[#111113] border border-white/5 rounded-xl p-2.5 cursor-pointer hover:border-white/20 hover:bg-white/[0.04] transition-all duration-150"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 shrink-0 rounded-lg bg-white/10 flex items-center justify-center text-[11px] font-bold text-gray-400">
                      {tool.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[13px] font-semibold text-white truncate">{tool.name}</h3>
                      <p className="text-[11px] text-gray-600">{tool.category}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Gradient overlay + button */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-transparent pointer-events-none" />
        )}

      </div>
    </section>
  );
};

export default ToolsGrid;
