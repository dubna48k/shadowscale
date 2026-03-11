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
      <div className="absolute top-0 right-0 w-[60%] h-full pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[hsl(260_50%_30%/0.25)] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-[hsl(280_40%_25%/0.2)] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Left Column */}
        <div>
          <motion.h1
            className="text-white text-4xl md:text-[3.5rem] font-bold leading-tight tracking-tight mb-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            Accede a más de $2,000 en herramientas por $29/mes
          </motion.h1>

          <motion.p
            className="text-sm text-gray-400 flex flex-row items-center whitespace-nowrap mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
          >
            50+ herramientas premium&nbsp;•&nbsp;Inicio de sesión instantáneo&nbsp;•&nbsp;No hay contraseña
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3 mb-5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.3 }}
          >
            <button className="glow-button inline-flex items-center gap-2 bg-coral text-coral-foreground px-6 py-2.5 rounded-2xl text-sm font-semibold shadow-[0_0_25px_4px_rgba(255,90,54,0.5)]">
              <LayoutGrid className="w-4 h-4" />
              Descargar (3 días gratis)
            </button>
            <button className="inline-flex items-center gap-2 border border-white/10 text-white px-6 py-2.5 rounded-2xl text-sm font-semibold hover:bg-white/5 transition-all duration-300">
              Ver todas las herramientas
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            className="flex items-center gap-1.5 text-xs text-gray-500"
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
          className="relative w-full max-w-[340px] mx-auto lg:ml-auto"
        >
          <div className="absolute -inset-8 -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-[hsl(260_60%_30%/0.3)] rounded-full blur-[80px]" />
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-4">
            {/* Scrollable tool list with visible thin scrollbar */}
            <div className="flex flex-col gap-1 max-h-36 overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-default shrink-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400">
                      {tool.name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-white">{tool.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-coral">-{tool.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-600 my-3" />

            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] text-gray-500">Total si se compran individualmente</span>
              <span className="text-sm font-bold text-coral">$2,250</span>
            </div>

            <div className="flex items-center justify-between px-2 pt-2 border-t border-white/[0.08]">
              <div className="flex items-center">
                <span className="text-xs font-bold text-white">Scal</span>
                <span className="bg-white text-black text-xs font-bold px-1 py-0.5 rounded ml-0.5">Pass</span>
              </div>
              <span className="text-lg font-extrabold text-white">29$/mes</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
