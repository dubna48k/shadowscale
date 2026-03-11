import { motion } from "framer-motion";
import { LayoutGrid, ArrowUpRight, ChevronRight } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const tools = [
  { name: "TrendLab", price: "$99" },
  { name: "Eleven Labs", price: "$11" },
  { name: "Adsparo", price: "$69" },
  { name: "Grok", price: "$20" },
  { name: "Kalodata", price: "$99" },
  { name: "ChatGPT Pro", price: "$20" },
  { name: "Claude Pro", price: "$100" },
  { name: "Midjourney", price: "$30" },
  { name: "Canva Pro", price: "$7" },
  { name: "SimilarWeb", price: "$125" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Purple glow on right */}
      <div className="absolute top-0 right-0 w-[60%] h-full pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[hsl(260_50%_30%/0.25)] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-[hsl(280_40%_25%/0.2)] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Left Column */}
        <div>
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-[3.5rem] font-extrabold tracking-tight leading-tight text-foreground mb-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            Accede a más de $2,000 en herramientas por $29/mes
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-sm mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
          >
            • 50+ herramientas premium • Inicio de sesión instantáneo • No hay contraseña
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.3 }}
          >
            <button className="glow-button inline-flex items-center gap-2 bg-coral text-coral-foreground px-5 py-2.5 rounded-2xl text-sm font-semibold">
              <LayoutGrid className="w-4 h-4" />
              Descargar (3 días gratis)
            </button>
            <button className="inline-flex items-center gap-2 border border-glass-hover text-foreground px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-secondary/40 transition-all duration-300">
              Ver todas las herramientas
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span>
              <span className="text-savings-foreground font-semibold">1,634</span>{" "}
              miembros ahorrando{" "}
              <span className="text-savings-foreground font-semibold">$2,221+/mes</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-savings" />
          </motion.div>
        </div>

        {/* Right Column - Pricing Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...spring, delay: 0.25 }}
          className="relative w-full max-w-sm mx-auto lg:ml-auto"
        >
          {/* Glow behind card */}
          <div className="absolute -inset-8 -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-[hsl(260_60%_30%/0.3)] rounded-full blur-[80px]" />
            <div className="absolute inset-4 bg-[hsl(220_60%_30%/0.2)] rounded-full blur-[60px]" />
          </div>

          <div className="glass rounded-3xl p-5">
            {/* Scrollable tool list */}
            <div className="max-h-48 overflow-y-auto scrollbar-hide">
              {tools.map((tool, i) => (
                <div
                  key={tool.name}
                  className="tool-item flex items-center justify-between py-2 px-2.5 rounded-xl cursor-default"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {tool.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-foreground">{tool.name}</span>
                  </div>
                  <span className="tool-price text-sm font-semibold text-coral transition-all duration-200">
                    -{tool.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Dashed separator */}
            <div className="border-t border-dashed border-muted my-3" />

            {/* Total */}
            <div className="flex items-center justify-between px-2.5 mb-3">
              <span className="text-xs text-muted-foreground">Total si se compran individualmente</span>
              <span className="text-base font-bold text-coral">$2,250</span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-2.5 pt-2.5 border-t border-[hsl(0_0%_100%/0.08)]">
              <div className="flex items-center">
                <span className="text-sm font-bold text-foreground">Scal</span>
                <span className="bg-foreground text-background text-sm font-bold px-1 py-0.5 rounded ml-0.5">
                  Pass
                </span>
              </div>
              <span className="text-xl font-extrabold text-foreground">
                29$/mes
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
