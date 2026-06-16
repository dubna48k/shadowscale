import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import type { Tool as SupabaseTool, Category as SupabaseCategory } from "@/lib/supabase";

interface Tool {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  color: string;
  initial: string;
  domain?: string;
  badge?: "nuevo" | "prueba";
  note?: string;
}

const FALLBACK_TOOLS: Tool[] = [
  { id: "chatgpt", name: "ChatGPT Plus", category: "IA", categoryId: "ia", color: "#10b981", initial: "G", domain: "openai.com" },
  { id: "claude", name: "Claude Pro", category: "IA", categoryId: "ia", color: "#f97316", initial: "C", domain: "anthropic.com", badge: "nuevo" },
  { id: "perplexity", name: "Perplexity Pro", category: "IA", categoryId: "ia", color: "#14b8a6", initial: "P", domain: "perplexity.ai" },
  { id: "gemini", name: "Gemini Advanced", category: "IA", categoryId: "ia", color: "#0ea5e9", initial: "G", domain: "google.com", badge: "nuevo" },
  { id: "grok", name: "Grok Premium", category: "IA", categoryId: "ia", color: "#737373", initial: "G", domain: "x.ai" },
  { id: "elevenlabs", name: "ElevenLabs Creator", category: "IA", categoryId: "ia", color: "#6b7280", initial: "E", domain: "elevenlabs.io" },
  { id: "higgsfield", name: "Higgsfield Plus", category: "IA", categoryId: "ia", color: "#ec4899", initial: "H", domain: "higgsfield.ai", note: "Solo modelos ILIMITADOS · Sin límite de renders" },
  { id: "leonardo", name: "Leonardo AI Pro", category: "IA", categoryId: "ia", color: "#a855f7", initial: "L", domain: "leonardo.ai" },
  { id: "hailuo", name: "Hailuo AI", category: "IA", categoryId: "ia", color: "#d97706", initial: "H", badge: "nuevo", note: "Acceso compartido · Créditos rotativos" },
  { id: "canva", name: "Canva Pro", category: "Diseño", categoryId: "design", color: "#06b6d4", initial: "C", domain: "canva.com" },
  { id: "freepik", name: "Freepik Premium", category: "Diseño", categoryId: "design", color: "#1d4ed8", initial: "F", domain: "freepik.com" },
  { id: "envato", name: "Envato Elements", category: "Diseño", categoryId: "design", color: "#65a30d", initial: "E", domain: "elements.envato.com" },
  { id: "midjourney", name: "Midjourney", category: "Diseño", categoryId: "design", color: "#6366f1", initial: "M", domain: "midjourney.com" },
  { id: "capcut", name: "CapCut Pro", category: "Video y Edición", categoryId: "video", color: "#8b5cf6", initial: "C", domain: "capcut.com" },
  { id: "runway", name: "Runway Pro", category: "Video y Edición", categoryId: "video", color: "#f43f5e", initial: "R", domain: "runwayml.com", note: "500 créditos/mes · Se renuevan el día 1" },
  { id: "seedance", name: "Seedance Pro", category: "Video y Edición", categoryId: "video", color: "#f59e0b", initial: "S" },
  { id: "adspy", name: "AdSpy", category: "Espionaje", categoryId: "spy", color: "#dc2626", initial: "A", domain: "adspy.com" },
  { id: "minea", name: "Minea", category: "Espionaje", categoryId: "spy", color: "#c026d3", initial: "M", domain: "minea.com" },
  { id: "similarweb", name: "SimilarWeb", category: "Espionaje", categoryId: "spy", color: "#0891b2", initial: "S", domain: "similarweb.com" },
  { id: "kalodata", name: "Kalodata", category: "Ecommerce", categoryId: "ecommerce", color: "#7c3aed", initial: "K", domain: "kalodata.com" },
  { id: "dropkiller", name: "Dropkiller", category: "Ecommerce", categoryId: "ecommerce", color: "#16a34a", initial: "D", badge: "nuevo" },
  { id: "fastmoss", name: "FastMoss", category: "Ecommerce", categoryId: "ecommerce", color: "#059669", initial: "F", domain: "fastmoss.com" },
];

const FALLBACK_CATS = [
  { id: "all", label: "Todo" },
  { id: "ia", label: "IA" },
  { id: "design", label: "Diseño" },
  { id: "video", label: "Video y Edición" },
  { id: "spy", label: "Espionaje" },
  { id: "ecommerce", label: "Ecommerce" },
];

const COLLAPSED_COUNT = 12;

const ToolLogo = ({ tool }: { tool: Tool }) => {
  const [failed, setFailed] = useState(false);
  if (tool.domain && !failed) {
    return (
      <img
        src={`https://logo.clearbit.com/${tool.domain}`}
        alt={tool.name}
        className="w-9 h-9 rounded-xl object-contain bg-white p-1 shrink-0"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div
      className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-[11px] font-bold text-white"
      style={{ background: tool.color }}
    >
      {tool.initial}
    </div>
  );
};

const NoteTicker = ({ note, color }: { note: string; color: string }) => {
  const chunk = `${note}  ·  `;
  return (
    <div
      className="overflow-hidden mt-2"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
      }}
    >
      <div style={{ display: "flex", flexWrap: "nowrap", animation: "marquee-left 22s linear infinite", width: "max-content" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="text-[9px] font-medium shrink-0" style={{ color, whiteSpace: "nowrap", paddingRight: "4px" }}>
            {chunk}
          </span>
        ))}
      </div>
    </div>
  );
};

interface ToolsGridProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  supabaseTools?: SupabaseTool[];
  supabaseCategories?: SupabaseCategory[];
  settings?: Record<string, string>;
}

const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 26, delay: i * 0.025 },
  }),
  exit: { opacity: 0, scale: 0.94, transition: { duration: 0.15 } },
};

const ToolsGrid = ({ searchQuery, onSearchChange, supabaseTools, supabaseCategories, settings = {} }: ToolsGridProps) => {
  const [active, setActive] = useState("all");
  const [isExpanded, setIsExpanded] = useState(false);

  const title = settings["tools_title"] ?? "Tu arsenal de herramientas premium 🛠️";
  const subtitle = settings["tools_subtitle"] ?? "Todas con inicio de sesión instantáneo — sin contraseñas, sin esperas";

  // Build category label map for Supabase tools
  const catLabelMap = useMemo(() => {
    const map: Record<string, string> = {};
    (supabaseCategories ?? []).forEach(c => { map[c.id] = c.label; });
    return map;
  }, [supabaseCategories]);

  // Convert Supabase tools → local Tool shape; filter active only
  const tools: Tool[] = useMemo(() => {
    if (supabaseTools && supabaseTools.length > 0) {
      return supabaseTools
        .filter(t => t.status === "active")
        .map(t => ({
          id: t.id,
          name: t.name,
          category: catLabelMap[t.category_id] ?? t.category_id,
          categoryId: t.category_id,
          color: t.color,
          initial: t.initial,
          domain: t.domain ?? undefined,
          badge: t.badge ?? undefined,
          note: t.note ?? undefined,
        }));
    }
    return FALLBACK_TOOLS;
  }, [supabaseTools, catLabelMap]);

  const categories = useMemo(() => {
    if (supabaseCategories && supabaseCategories.length > 0) {
      return supabaseCategories.map(c => ({ id: c.id, label: c.label }));
    }
    return FALLBACK_CATS;
  }, [supabaseCategories]);

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchCat = active === "all" || t.categoryId === active;
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [tools, active, searchQuery]);

  const visible = (isExpanded || searchQuery) ? filtered : filtered.slice(0, COLLAPSED_COUNT);
  const hasMore = !searchQuery && filtered.length > COLLAPSED_COUNT;

  return (
    <section
      id="herramientas"
      className="px-4 sm:px-8 py-8 sm:py-10"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.08) 0%, transparent 60%), #0a0a0a",
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
                active === cat.id ? "bg-white text-black" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="mb-5 text-center">
          <motion.div
            className="inline-flex items-center justify-center gap-2.5 mb-2"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-7 w-auto" />
            <h2 className="text-white text-[20px] sm:text-[24px] font-bold">{title}</h2>
          </motion.div>
          <p className="text-[13px] text-gray-400">{subtitle}</p>
        </div>

        {hasMore && (
          <div className="flex items-center justify-end mb-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-[13px] text-gray-400 hover:text-white transition-colors duration-200"
            >
              {isExpanded ? "Mostrar menos" : "Mostrar todo"}
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
          <AnimatePresence mode="popLayout">
            {visible.map((tool, i) => (
              <motion.div
                key={tool.id}
                layout
                layoutId={tool.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="relative bg-[#161618] rounded-xl p-3 cursor-pointer hover:bg-[#1e1e22] transition-colors duration-150"
                style={{ transformOrigin: "center" }}
              >
                {tool.badge && (
                  <div className="mb-1.5">
                    <span
                      className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-md leading-tight"
                      style={tool.badge === "nuevo"
                        ? { background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" }
                        : { background: "rgba(255,255,255,0.06)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.1)" }
                      }
                    >
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: tool.badge === "nuevo" ? "#34d399" : "#9ca3af" }} />
                      {tool.badge === "nuevo" ? "Nuevo" : "En prueba"}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <ToolLogo tool={tool} />
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-semibold text-white truncate">{tool.name}</h3>
                    <p className="text-[11px] text-gray-500 truncate">{tool.category}</p>
                  </div>
                </div>
                {tool.note && <NoteTicker note={tool.note} color={tool.color} />}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ToolsGrid;
