import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const tools = [
  { name: "ChatGPT Plus", price: "$22", color: "#10b981" },
  { name: "Canva Pro", price: "$13", color: "#06b6d4" },
  { name: "CapCut Pro", price: "$10", color: "#8b5cf6" },
  { name: "Freepik Premium", price: "$12", color: "#1d4ed8" },
  { name: "Perplexity Pro", price: "$20", color: "#14b8a6" },
  { name: "ElevenLabs", price: "$22", color: "#6b7280" },
  { name: "Higgsfield", price: "$39", color: "#ec4899" },
  { name: "Leonardo AI", price: "$60", color: "#a855f7" },
  { name: "Runway Pro", price: "$100", color: "#f43f5e" },
  { name: "Seedance Pro", price: "$16", color: "#f59e0b" },
  { name: "Midjourney", price: "$30", color: "#6366f1" },
  { name: "Claude Pro", price: "$20", color: "#f97316" },
  { name: "Gemini Advanced", price: "$20", color: "#0ea5e9" },
  { name: "Grok Premium", price: "$16", color: "#737373" },
  { name: "Kalodata", price: "$99", color: "#7c3aed" },
  { name: "SimilarWeb", price: "$125", color: "#0891b2" },
  { name: "AdSpy", price: "$149", color: "#dc2626" },
  { name: "Minea", price: "$99", color: "#c026d3" },
  { name: "Envato Elements", price: "$17", color: "#65a30d" },
  { name: "Hailuo AI", price: "$199", color: "#d97706" },
];

const row1 = tools.slice(0, 10);
const row2 = tools.slice(10);

interface MarqueeRowProps {
  items: typeof tools;
  direction: "left" | "right";
}

const MarqueeRow = ({ items, direction }: MarqueeRowProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const [paused, setPaused] = useState(false);

  const tripled = [...items, ...items, ...items];

  const onMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    isDragging.current = true;
    startX.current = e.clientX;
    startScroll.current = trackRef.current.scrollLeft;
    setPaused(true);
    document.body.style.cursor = "grabbing";
    e.preventDefault();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const dx = e.clientX - startX.current;
    trackRef.current.scrollLeft = startScroll.current - dx;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "";
    setPaused(false);
  };

  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div
        ref={trackRef}
        className={`flex w-max ${direction === "left" ? "marquee-left" : "marquee-right"} ${paused ? "marquee-paused" : ""}`}
        style={{ cursor: isDragging.current ? "grabbing" : "grab", userSelect: "none" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {tripled.map((tool, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 mx-1.5 px-3 py-1.5 rounded-full shrink-0"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: tool.color }} />
            <span className="text-[12px] text-gray-300 font-medium whitespace-nowrap">{tool.name}</span>
            <span className="text-[12px] font-bold whitespace-nowrap" style={{ color: "#f97316" }}>-{tool.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative pt-20 md:pt-14 pb-0 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[50%] h-full pointer-events-none hidden md:block">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[hsl(260_50%_30%/0.25)] rounded-full blur-[130px]" />
        <div className="absolute top-1/2 right-[10%] w-[250px] h-[250px] bg-[hsl(280_40%_25%/0.2)] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="md:grid md:grid-cols-[1fr_auto] md:gap-12 md:items-center">
          {/* Left */}
          <div>
            <motion.h1
              className="text-[32px] sm:text-[36px] md:text-[2.8rem] font-bold leading-tight md:leading-[1.15] tracking-[-0.01em] text-white max-w-[500px] mb-3 md:mb-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 }}
            >
              <span className="md:whitespace-nowrap">Accede a +$1,400</span>
              <br />
              en herramientas premium por
              <br />
              <span style={{ color: "#f97316" }}>$14.9/mes</span>
            </motion.h1>

            <motion.p
              className="text-[12px] sm:text-[13px] md:text-[14px] text-gray-400 mb-4 md:mb-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.2 }}
            >
              • 20+ herramientas premium • Sin contraseñas • Cancela cuando quieras
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 mb-3 md:mb-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.3 }}
            >
              <a
                href="https://app.shadowscale.pro/register"
                className="glow-button inline-flex items-center justify-center text-white font-bold transition-colors"
                style={{ background: "#f97316", borderRadius: "12px", padding: "14px 28px", fontSize: "16px" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#ea580c")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#f97316")}
              >
                Comenzar gratis — 3 días
              </a>
              <a
                href="#herramientas"
                className="inline-flex items-center justify-center font-semibold transition-colors"
                style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "14px 24px", fontSize: "15px", color: "#ccc" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#ccc"; }}
              >
                Ver herramientas
              </a>
            </motion.div>

            <motion.div
              className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <span className="text-savings-foreground font-semibold">⚡ 1,634</span>
              <span>miembros activos ahorrando</span>
              <span className="text-savings-foreground font-semibold">$2,200+/mes</span>
              <ArrowUpRight className="w-3 md:w-3.5 h-3 md:h-3.5 text-savings" />
            </motion.div>
          </div>

          {/* Right: price card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.25 }}
            className="hidden md:block relative w-[280px] shrink-0 self-center"
          >
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl px-3 py-3">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-[11px] text-gray-500">Si se compran individualmente</span>
                <span className="text-[15px] font-bold text-coral">$1,453/mes</span>
              </div>
              <div className="flex items-center justify-between px-1 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center">
                  <span className="text-[14px] font-bold text-white italic">Shadow</span>
                  <span className="bg-white text-black text-[13px] font-bold italic px-1.5 py-0.5 rounded ml-0.5">Scale</span>
                </div>
                <span className="text-[18px] font-extrabold text-white">$14.9/mes</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile price card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.4 }}
          className="md:hidden mt-6 max-w-[320px] mx-auto"
        >
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl px-3 py-3">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10px] text-gray-500">Si se compran individualmente</span>
              <span className="text-[14px] font-bold text-coral">$1,453/mes</span>
            </div>
            <div className="flex items-center justify-between px-1 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center">
                <span className="text-[13px] font-bold text-white italic">Shadow</span>
                <span className="bg-white text-black text-[12px] font-bold italic px-1 py-0.5 rounded ml-0.5">Scale</span>
              </div>
              <span className="text-[16px] font-extrabold text-white">$14.9/mes</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Horizontal tool ticker — full width, below headline */}
      <motion.div
        className="mt-10 md:mt-12 pb-8 space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <MarqueeRow items={row1} direction="left" />
        <MarqueeRow items={row2} direction="right" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
