import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import CategoryTabs from "./CategoryTabs";
import ToolCard, { type Tool } from "./ToolCard";

const tools: Tool[] = [
  { id: "perplexity", name: "Perplexity Pro", category: "IA", categoryId: "ia", savings: 20, icon: "🔍" },
  { id: "chatgpt", name: "ChatGPT Pro", category: "IA", categoryId: "ia", savings: 200, icon: "🤖" },
  { id: "claude", name: "Claude Pro", category: "IA", categoryId: "ia", savings: 100, icon: "🧠" },
  { id: "midjourney", name: "Midjourney", category: "Diseño", categoryId: "design", savings: 30, icon: "🎨" },
  { id: "canva", name: "Canva Pro", category: "Diseño", categoryId: "design", savings: 7, icon: "✏️" },
  { id: "similarweb", name: "SimilarWeb", category: "Espionaje e Investigación", categoryId: "spy", savings: 125, icon: "🌐" },
  { id: "minea", name: "Minea", category: "Comercio electrónico", categoryId: "ecommerce", savings: 99, icon: "📦" },
  { id: "adspy", name: "AdSpy", category: "Espionaje e Investigación", categoryId: "spy", savings: 149, icon: "👁️" },
];

interface ToolsGridProps {
  searchQuery: string;
}

const ToolsGrid = ({ searchQuery }: ToolsGridProps) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchCategory = activeCategory === "all" || t.categoryId === activeCategory;
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="tools" className="max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold text-center mb-2">Herramientas Premium</h2>
      <p className="text-muted-foreground text-center mb-10">Todas incluidas en tu suscripción</p>

      <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ToolsGrid;
