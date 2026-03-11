import { motion } from "framer-motion";
import { LayoutGrid, ArrowUpRight, ChevronRight } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const tools = [
  { name: "Dropkiller", price: "$24", color: "bg-emerald-500" },
  { name: "FishAudio", price: "$11", color: "bg-rose-500" },
  { name: "Envato", price: "$16.5", color: "bg-green-500" },
  { name: "Canva Pro", price: "$7", color: "bg-cyan-500" },
  { name: "FastMoss", price: "$20", color: "bg-red-500" },
  { name: "ChatGPT Pro", price: "$20", color: "bg-emerald-400" },
  { name: "Claude Pro", price: "$100", color: "bg-orange-400" },
  { name: "Midjourney", price: "$30", color: "bg-indigo-500" },
  { name: "SimilarWeb", price: "$125", color: "bg-blue-500" },
  { name: "TrendLab", price: "$99", color: "bg-violet-500" },
];

const HeroSection = () => {
  return (
    <section className="relative flex items-center px-6 pt-16 pb-6 min-h-[65vh] overflow-hidden">
      {/* Purple glow */}
      <div className="absolute top-0 right-0 w-[50%] h-full pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[hsl(260_50%_30%/0.25)] rounded-full blur-[130px]" />
        <div className="absolute top-1/2 right-[10%] w-[250px] h-[250px] bg-[hsl(280_40%_25%/0.2)] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
        {/* Left */}
        <div>
          <motion.h1
            className="text-[2.5rem] md:text-[3rem] font-bold leading-[1.15] tracking-[-0.01em] text-white max-w-[480px] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            Accede a más de $2,000 en herramientas por $29/mes
          </motion.h1>

          <motion.p
            className="text-[14px] text-gray-400 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
          >
            • 50+ herramientas premium • Inicio de sesión instantáneo • No hay contraseña
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.3 }}
          >
            <button className="glow-button inline-flex items-center gap-2 bg-coral text-white px-6 py-2.5 rounded-xl text-[15px] font-semibold shadow-[0_0_25px_4px_rgba(255,90,54,0.4)]">
              <LayoutGrid className="w-4 h-4" />
              Descargar (3 días gratis)
            </button>
            <button className="inline-flex items-center gap-2 border border-white/15 text-white px-6 py-2.5 rounded-xl text-[15px] font-medium hover:bg-white/5 transition-all duration-300">
              Ver todas las herramientas
            </button>
          </motion.div>

          <motion.div
            className="flex items-center gap-1.5 text-[13px] text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <span className="text-savings-foreground font-semibold">1634</span>
            <span>miembros ahorrando</span>
            <span className="text-savings-foreground font-semibold">$2,221+/mes</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-savings" />
          </motion.div>
        </div>

        {/* Right - Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...spring, delay: 0.25 }}
          className="relative w-[320px] shrink-0 hidden lg:block"
        >
          <div className="absolute -inset-6 -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-[hsl(260_60%_28%/0.2)] rounded-full blur-[60px]" />
          </div>

          <div className="bg-[#1a1a1f]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-4">
            {/* Scrollable list */}
            <div className="h-[150px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-coral [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center justify-between py-[7px] px-1 hover:bg-white/5 rounded-lg transition-colors duration-150 cursor-default"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full ${tool.color} shrink-0`} />
                    <span className="text-[14px] font-medium text-white">{tool.name}</span>
                  </div>
                  <span className="text-[14px] font-medium text-white">-{tool.price}</span>
                </div>
              ))}
            </div>

            {/* Separator */}
            <div className="border-t border-gray-700/60 my-3" />

            {/* Total */}
            <div className="flex items-center justify-between px-1 mb-3">
              <span className="text-[13px] text-gray-400">Total si se compran individualmente</span>
              <span className="text-[16px] font-bold text-coral">$2250</span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-1 pt-2.5 border-t border-gray-700/40">
              <div className="flex items-center">
                <span className="text-[15px] font-bold text-white italic">Scal</span>
                <span className="bg-white text-black text-[14px] font-bold italic px-1.5 py-0.5 rounded ml-0.5">Pass</span>
              </div>
              <span className="text-[20px] font-extrabold text-white">29$/mes</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
