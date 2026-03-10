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

// Duplicate for seamless infinite scroll
const marqueeTools = [...tools, ...tools];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Purple glow on right */}
      <div className="absolute top-0 right-0 w-[60%] h-full pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[hsl(260_50%_30%/0.25)] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-[hsl(280_40%_25%/0.2)] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column */}
        <div>
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            Accede a más de{" "}
            <span className="text-coral">$2,000</span>{" "}
            en herramientas por{" "}
            <span className="text-coral">$29/mes</span>
          </motion.h1>

          <motion.p
            className="text-secondary-foreground text-lg mb-8 flex flex-wrap items-center gap-x-3 gap-y-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
          >
            <span>• 50+ herramientas premium</span>
            <span>• Inicio de sesión instantáneo</span>
            <span>• No hay contraseña</span>
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.3 }}
          >
            <button className="glow-button inline-flex items-center gap-2 bg-coral text-coral-foreground px-7 py-3.5 rounded-2xl text-base font-semibold">
              <LayoutGrid className="w-5 h-5" />
              Descargar (3 días gratis)
            </button>
            <button className="inline-flex items-center gap-2 border border-glass-hover text-foreground px-7 py-3.5 rounded-2xl text-base font-semibold hover:bg-secondary/40 transition-all duration-300">
              Ver todas las herramientas
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span>
              <span className="text-savings-foreground font-semibold">1,634</span>{" "}
              miembros ahorrando{" "}
              <span className="text-savings-foreground font-semibold">$2,221+/mes</span>
            </span>
            <ArrowUpRight className="w-4 h-4 text-savings" />
          </motion.div>
        </div>

        {/* Right Column - Pricing Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...spring, delay: 0.25 }}
          className="relative w-full max-w-md mx-auto lg:ml-auto"
        >
          {/* Glow behind card */}
          <div className="absolute -inset-8 -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-[hsl(260_60%_30%/0.3)] rounded-full blur-[80px]" />
            <div className="absolute inset-4 bg-[hsl(220_60%_30%/0.2)] rounded-full blur-[60px]" />
          </div>

          <div className="glass rounded-3xl p-6 marquee-container">
            {/* Marquee tool list */}
            <div className="max-h-56 overflow-hidden scrollbar-hide relative">
              {/* Fade edges */}
              <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-card/80 to-transparent z-10 pointer-events-none rounded-t-xl" />
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card/80 to-transparent z-10 pointer-events-none" />

              <div className="marquee-track space-y-1">
                {marqueeTools.map((tool, i) => (
                  <div
                    key={`${tool.name}-${i}`}
                    className="tool-item flex items-center justify-between py-2.5 px-3 rounded-xl cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
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
            </div>

            {/* Dashed separator */}
            <div className="border-t border-dashed border-muted my-4" />

            {/* Total */}
            <div className="flex items-center justify-between px-3 mb-4">
              <span className="text-sm text-muted-foreground">Total si se compran individualmente</span>
              <span className="text-lg font-bold text-coral">$2,250</span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-3 pt-3 border-t border-[hsl(0_0%_100%/0.08)]">
              <div className="flex items-center">
                <span className="text-sm font-bold text-foreground">Scal</span>
                <span className="bg-foreground text-background text-sm font-bold px-1 py-0.5 rounded ml-0.5">
                  Pass
                </span>
              </div>
              <span className="text-2xl font-extrabold text-foreground">
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
