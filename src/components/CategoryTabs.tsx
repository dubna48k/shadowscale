import { motion } from "framer-motion";

const categories = [
  { id: "all", label: "Todas" },
  { id: "ia", label: "IA" },
  { id: "video", label: "Video y Edición" },
  { id: "design", label: "Diseño" },
  { id: "spy", label: "Espionaje e Investigación" },
  { id: "ecommerce", label: "Comercio electrónico" },
  { id: "audio", label: "Audio" },
];

interface CategoryTabsProps {
  active: string;
  onChange: (id: string) => void;
}

const CategoryTabs = ({ active, onChange }: CategoryTabsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className="category-tab relative"
        >
          {active === cat.id && (
            <motion.div
              layoutId="category-indicator"
              className="absolute inset-0 bg-secondary rounded-xl border border-glass"
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
          )}
          <span className={`relative z-10 ${active === cat.id ? "category-tab-active" : ""}`}>
            {cat.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
