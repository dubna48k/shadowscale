import { motion } from "framer-motion";

export interface Tool {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  savings: number;
  icon: string;
}

const spring = { type: "spring", stiffness: 100, damping: 20 };

const ToolCard = ({ tool }: { tool: Tool }) => {
  return (
    <motion.div
      layout
      layoutId={tool.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={spring}
      whileHover={{ scale: 1.05 }}
      className="glass glass-hover p-5 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-2xl">
          {tool.icon}
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-secondary/60 px-2.5 py-1 rounded-lg">
          {tool.category}
        </span>
      </div>

      <h3 className="text-base font-semibold mb-1 group-hover:text-primary transition-colors">
        {tool.name}
      </h3>

      <div className="flex items-center gap-1.5">
        <span className="text-sm text-muted-foreground">Ahorras</span>
        <span className="text-savings-foreground font-bold text-lg">
          ${tool.savings}
        </span>
        <span className="text-sm text-muted-foreground">/mes</span>
      </div>
    </motion.div>
  );
};

export default ToolCard;
