import { motion } from "framer-motion";
import { LayoutGrid, ArrowUpRight } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const tools = [
  { name: "Gethookd", price: "$149", color: "bg-emerald-500" },
  { name: "BrainFM", price: "$7", color: "bg-rose-500" },
  { name: "Foreplay", price: "$175", color: "bg-indigo-500" },
  { name: "Hailuo", price: "$199", color: "bg-red-500" },
  { name: "ChatGPT Pro", price: "$20", color: "bg-emerald-400" },
  { name: "Dropkiller", price: "$24", color: "bg-cyan-500" },
  { name: "FishAudio", price: "$11", color: "bg-pink-500" },
  { name: "Envato", price: "$16.5", color: "bg-green-500" },
  { name: "Canva Pro", price: "$7", color: "bg-blue-400" },
  { name: "FastMoss", price: "$20", color: "bg-orange-500" },
];

const HeroSection = () => {
  return (
    <section className="relative flex items-center px-6 pt-16 pb-6 min-h-[65vh] overflow-hidden">
      <div className="absolute top-0 right-0 w-[50%] h-full pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[hsl(260_50%_30%/0.25)] rounded-full blur-[130px]" />
        <div className="absolute top-1/2 right-[10%] w-[250px] h-[250px] bg-[hsl(280_40%_25%/0.2)] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
        {/* Left */}
        <div>
          <motion.h1
            className="text-[2.2rem] md:text-[2.8rem] font-bold leading-[1.15] tracking-[-0.01em] text-white max-w-[500px] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <span className="whitespace-nowrap">Accede a más de $2,000</span>
            <br />
            en herramientas por
            <br />
            <span className="text-gray-500">$29/mes</span>
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
          className="relative w-[280px] shrink-0 hidden lg:block self-center"
        >
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl px-3 py-3">
            {/* Scrollable list */}
            <div className="h-[120px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:bg-coral [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center justify-between py-[5px] px-1 hover:bg-white/5 rounded-md transition-colors duration-150 cursor-default"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${tool.color} shrink-0`} />
                    <span className="text-[13px] font-medium text-white">{tool.name}</span>
                  </div>
                  <span className="text-[13px] font-medium text-white">-{tool.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/[0.08] my-2" />

            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[11px] text-gray-500">Total si se compran individualmente</span>
              <span className="text-[15px] font-bold text-coral">$2250</span>
            </div>

            <div className="flex items-center justify-between px-1 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center">
                <span className="text-[14px] font-bold text-white italic">Scal</span>
                <span className="bg-white text-black text-[13px] font-bold italic px-1.5 py-0.5 rounded ml-0.5">Pass</span>
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
