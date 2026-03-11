import { useEffect, useRef } from "react";
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

const InfiniteToolScroll = ({ tools, height, textSize }: { tools: typeof toolsList; height: string; textSize: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScroll = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf: number;
    let paused = false;

    const step = () => {
      if (!paused) {
        el.scrollTop += 0.5;
        if (el.scrollTop >= el.scrollHeight / 2) {
          el.scrollTop = 0;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const pause = () => { paused = true; };
    const resume = () => { if (!isDragging.current) paused = false; };
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause);
    el.addEventListener("touchend", resume);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    startY.current = e.clientY;
    startScroll.current = el.scrollTop;
    document.body.style.cursor = "grabbing";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const delta = startY.current - e.clientY;
    el.scrollTop = startScroll.current + delta;
    if (el.scrollTop >= el.scrollHeight / 2) el.scrollTop = 0;
    if (el.scrollTop < 0) el.scrollTop = el.scrollHeight / 2 + el.scrollTop;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "";
  };

  useEffect(() => {
    const up = () => { isDragging.current = false; document.body.style.cursor = ""; };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  const doubled = [...tools, ...tools];

  return (
    <div
      ref={scrollRef}
      className={`${height} overflow-y-auto scrollbar-hide select-none cursor-grab active:cursor-grabbing touch-pan-y`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {doubled.map((tool, i) => (
        <div key={`${tool.name}-${i}`} className="flex items-center justify-between py-[5px] px-1 hover:bg-white/5 rounded-md transition-colors duration-150">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${tool.color} shrink-0`} />
            <span className={`${textSize} font-medium text-white`}>{tool.name}</span>
          </div>
          <span className={`${textSize} font-medium text-white`}>-{tool.price}</span>
        </div>
      ))}
    </div>
  );
};

const toolsList = tools;

const HeroSection = () => {
  return (
    <section className="relative px-6 pt-20 md:pt-14 pb-6 overflow-hidden md:min-h-[60vh] md:flex md:items-center">
      <div className="absolute top-0 right-0 w-[50%] h-full pointer-events-none hidden md:block">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[hsl(260_50%_30%/0.25)] rounded-full blur-[130px]" />
        <div className="absolute top-1/2 right-[10%] w-[250px] h-[250px] bg-[hsl(280_40%_25%/0.2)] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Desktop: grid side by side / Mobile: stacked */}
        <div className="md:grid md:grid-cols-[1fr_auto] md:gap-12 md:items-center">
          {/* Left content */}
          <div>
            <motion.h1
              className="text-[32px] sm:text-[36px] md:text-[2.8rem] font-bold leading-tight md:leading-[1.15] tracking-[-0.01em] text-white max-w-[500px] mb-3 md:mb-4 text-left"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 }}
            >
              <span className="md:whitespace-nowrap">Accede a más de $2,000</span>
              <br />
              en herramientas por
              <br />
              <span className="text-gray-500">$29/mes</span>
            </motion.h1>

            <motion.p
              className="text-[12px] sm:text-[13px] md:text-[14px] text-gray-400 mb-4 md:mb-6 text-left"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.2 }}
            >
              • 50+ herramientas premium • Inicio de sesión instantáneo • No hay contraseña
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 mb-3 md:mb-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.3 }}
            >
              <button className="glow-button inline-flex items-center justify-center gap-2 bg-coral text-white px-6 py-2.5 rounded-xl text-[14px] md:text-[15px] font-semibold shadow-[0_0_25px_4px_rgba(255,90,54,0.4)]">
                <LayoutGrid className="w-4 h-4" />
                Descargar (3 días gratis)
              </button>
              <button className="inline-flex items-center justify-center gap-2 border border-white/15 text-white px-6 py-2.5 rounded-xl text-[14px] md:text-[15px] font-medium hover:bg-white/5 transition-all duration-300">
                Ver todas las herramientas
              </button>
            </motion.div>

            <motion.div
              className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <span className="text-savings-foreground font-semibold">1634</span>
              <span>miembros ahorrando</span>
              <span className="text-savings-foreground font-semibold">$2,221+/mes</span>
              <ArrowUpRight className="w-3 md:w-3.5 h-3 md:h-3.5 text-savings" />
            </motion.div>
          </div>

          {/* Right card - hidden on mobile, shown on md+ in grid position */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.25 }}
            className="hidden md:block relative w-[280px] shrink-0 self-center"
          >
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl px-3 py-3">
              <InfiniteToolScroll tools={toolsList} height="h-[120px]" textSize="text-[13px]" />
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

        {/* Mobile-only card: below the text block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.4 }}
          className="md:hidden mt-6 w-full max-w-[320px] mx-auto"
        >
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl px-3 py-3">
            <InfiniteToolScroll tools={toolsList} height="h-[110px]" textSize="text-[12px]" />
            <div className="border-t border-white/[0.08] my-2" />
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10px] text-gray-500">Total si se compran individualmente</span>
              <span className="text-[14px] font-bold text-coral">$2250</span>
            </div>
            <div className="flex items-center justify-between px-1 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center">
                <span className="text-[13px] font-bold text-white italic">Scal</span>
                <span className="bg-white text-black text-[12px] font-bold italic px-1 py-0.5 rounded ml-0.5">Pass</span>
              </div>
              <span className="text-[16px] font-extrabold text-white">29$/mes</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
