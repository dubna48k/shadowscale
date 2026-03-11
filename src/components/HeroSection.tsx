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
    <section className="relative flex items-center px-6 pt-20 pb-8 min-h-[75vh] overflow-hidden">
      <div className="absolute top-0 right-0 w-[60%] h-full pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[hsl(260_50%_30%/0.2)] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left */}
        <div>
          <motion.h1
            className="text-[2.8rem] md:text-[3.2rem] font-bold leading-[1.1] tracking-[-0.02em] text-white max-w-[500px] mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            Accede a más de $2,000 en herramientas por $29/mes
          </motion.h1>

          <motion.p
            className="text-[14px] text-gray-400 mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
          >
            • 50+ herramientas premium • Inicio de sesión instantáneo • No hay contraseña
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-2.5 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.3 }}
          >
            <button className="glow-button inline-flex items-center gap-2 bg-coral text-white px-5 py-2 rounded-xl text-[13px] font-semibold shadow-[0_0_25px_4px_rgba(255,90,54,0.45)]">
              <LayoutGrid className="w-3.5 h-3.5" />
              Descargar (3 días gratis)
            </button>
            <button className="inline-flex items-center gap-1.5 border border-white/10 text-white px-5 py-2 rounded-xl text-[13px] font-medium hover:bg-white/5 transition-all duration-300">
              Ver todas las herramientas
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          <motion.div
            className="flex items-center gap-1.5 text-[11px] text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <span className="text-savings-foreground font-semibold">1,634</span>
            <span>miembros ahorrando</span>
            <span className="text-savings-foreground font-semibold">$2,221+/mes</span>
            <ArrowUpRight className="w-3 h-3 text-savings" />
          </motion.div>
        </div>

        {/* Right - Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...spring, delay: 0.25 }}
          className="relative w-full max-w-[380px] mx-auto lg:ml-auto"
        >
          <div className="absolute -inset-6 -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-[hsl(260_60%_28%/0.25)] rounded-full blur-[70px]" />
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-4">
            <div className="h-[160px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center justify-between py-[6px] px-2 rounded-lg hover:bg-white/10 transition-all duration-150 cursor-default"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400">
                      {tool.name.charAt(0)}
                    </div>
                    <span className="text-[13px] font-medium text-white">{tool.name}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-coral">-{tool.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-700 my-2.5" />

            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] text-gray-500">Total individualmente</span>
              <span className="text-[14px] font-bold text-coral">$2,250</span>
            </div>

            <div className="flex items-center justify-between px-2 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center">
                <span className="text-[13px] font-bold text-white">Scal</span>
                <span className="bg-white text-black text-[13px] font-bold px-1 py-0.5 rounded ml-0.5">Pass</span>
              </div>
              <span className="text-[18px] font-extrabold text-white">29$/mes</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
