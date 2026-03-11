import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  icon: string;
}

const tools: Tool[] = [
  { id: "perplexity", name: "Perplexity", category: "IA", categoryId: "ia", icon: "P" },
  { id: "dropkiller", name: "Dropkiller", category: "Comercio electrónico", categoryId: "ecommerce", icon: "D" },
  { id: "fishaudio", name: "FishAudio", category: "Audio", categoryId: "audio", icon: "F" },
  { id: "envato", name: "Envato", category: "Diseño", categoryId: "design", icon: "E" },
  { id: "canva", name: "Canva Pro", category: "Diseño", categoryId: "design", icon: "C" },
  { id: "fastmoss", name: "FastMoss", category: "Espionaje e Investigación", categoryId: "spy", icon: "F" },
  { id: "similarweb", name: "SimilarWeb", category: "Espionaje e Investigación", categoryId: "spy", icon: "S" },
  { id: "claude", name: "Claude", category: "IA", categoryId: "ia", icon: "C" },
  { id: "adspy", name: "Adspy", category: "Espionaje e Investigación", categoryId: "spy", icon: "A" },
  { id: "gethookd", name: "Gethookd", category: "Video y Edición", categoryId: "video", icon: "G" },
  { id: "brainfm", name: "BrainFM", category: "Audio", categoryId: "audio", icon: "B" },
  { id: "foreplay", name: "Foreplay", category: "Espionaje e Investigación", categoryId: "spy", icon: "F" },
  { id: "hailuo", name: "Hailuo", category: "Video y Edición", categoryId: "video", icon: "H" },
  { id: "chatgpt", name: "ChatGPT Pro", category: "IA", categoryId: "ia", icon: "C" },
  { id: "minea", name: "Minea", category: "Comercio electrónico", categoryId: "ecommerce", icon: "M" },
  { id: "midjourney", name: "Midjourney", category: "Diseño", categoryId: "design", icon: "M" },
  { id: "elevenlabs", name: "ElevenLabs", category: "IA", categoryId: "ia", icon: "E" },
  { id: "sora", name: "Sora", category: "Video y Edición", categoryId: "video", icon: "S" },
  { id: "kalodata", name: "Kalodata", category: "Comercio electrónico", categoryId: "ecommerce", icon: "K" },
  { id: "trendlab", name: "TrendLab", category: "Espionaje e Investigación", categoryId: "spy", icon: "T" },
];

const categories = [
  { id: "all", label: "Todo" },
  { id: "ia", label: "IA" },
  { id: "video", label: "Video y Edición" },
  { id: "design", label: "Diseño" },
  { id: "spy", label: "Espionaje e Investigación" },
  { id: "ecommerce", label: "Comercio electrónico" },
  { id: "audio", label: "Audio" },
];

interface ToolsGridProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
}

const ToolsGrid = ({ searchQuery, onSearchChange }: ToolsGridProps) => {
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchCat = active === "all" || t.categoryId === active;
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [active, searchQuery]);

  return (
    <section id="tools" className="max-w-6xl mx-auto px-6 py-14">
      <h2 className="text-white text-2xl font-bold text-center mb-8">
        Explora Herramientas Premium
      </h2>

      {/* Search */}
      <div className="max-w-md mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar herramientas"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#111113] border border-white/10 rounded-full pl-11 pr-5 py-2.5 text-[14px] text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
              active === cat.id
                ? "bg-white text-black"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((tool) => (
            <motion.div
              key={tool.id}
              layout
              layoutId={tool.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 cursor-pointer hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-[13px] font-bold text-gray-300 mb-3">
                {tool.icon}
              </div>
              <h3 className="text-[14px] font-semibold text-white mb-0.5 group-hover:text-white/90">
                {tool.name}
              </h3>
              <p className="text-[11px] text-gray-500">{tool.category}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ToolsGrid;
