import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const cardTools = [
  { name: "ChatGPT Plus", price: "$22", domain: "openai.com", color: "#10b981" },
  { name: "Canva Pro", price: "$13", domain: "canva.com", color: "#06b6d4" },
  { name: "CapCut Pro", price: "$10", domain: "capcut.com", color: "#8b5cf6" },
  { name: "Freepik Premium", price: "$12", domain: "freepik.com", color: "#1d4ed8" },
  { name: "Perplexity Pro", price: "$20", domain: "perplexity.ai", color: "#14b8a6" },
  { name: "ElevenLabs", price: "$22", domain: "elevenlabs.io", color: "#6b7280" },
  { name: "Higgsfield", price: "$39", domain: "higgsfield.ai", color: "#ec4899" },
  { name: "Leonardo AI", price: "$60", domain: "leonardo.ai", color: "#a855f7" },
  { name: "Runway Pro", price: "$100", domain: "runwayml.com", color: "#f43f5e" },
  { name: "Seedance Pro", price: "$16", domain: null, color: "#f59e0b" },
  { name: "Midjourney", price: "$30", domain: "midjourney.com", color: "#6366f1" },
  { name: "Claude Pro", price: "$20", domain: "anthropic.com", color: "#f97316" },
  { name: "Gemini Advanced", price: "$20", domain: "google.com", color: "#0ea5e9" },
  { name: "Grok Premium", price: "$16", domain: "x.ai", color: "#737373" },
  { name: "Kalodata", price: "$99", domain: "kalodata.com", color: "#7c3aed" },
  { name: "SimilarWeb", price: "$125", domain: "similarweb.com", color: "#0891b2" },
  { name: "AdSpy", price: "$149", domain: "adspy.com", color: "#dc2626" },
  { name: "Minea", price: "$99", domain: "minea.com", color: "#c026d3" },
  { name: "Envato Elements", price: "$17", domain: "elements.envato.com", color: "#65a30d" },
  { name: "Hailuo AI", price: "$199", domain: null, color: "#d97706" },
];

const tools = cardTools.map(t => ({ name: t.name, price: t.price, color: t.color }));

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

const ToolLogoSmall = ({ tool }: { tool: typeof cardTools[0] }) => {
  const sources = tool.domain ? [
    `https://logo.clearbit.com/${tool.domain}`,
    `https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`,
  ] : [];
  const [idx, setIdx] = useState(0);
  if (idx < sources.length) {
    return (
      <img
        src={sources[idx]}
        alt={tool.name}
        className="w-7 h-7 rounded-lg object-contain bg-white p-0.5 shrink-0"
        onError={() => setIdx(i => i + 1)}
      />
    );
  }
  return (
    <div
      className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-[9px] font-bold text-white"
      style={{ background: tool.color }}
    >
      {tool.name[0]}
    </div>
  );
};

const ITEM_H = 40;
const VISIBLE = 5;
const STEP = 3;
const INTERVAL_MS = 3000;

const PriceCard = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartOffset = useRef(0);
  const animating = useRef(false);

  const total = cardTools.length;
  const looped = [...cardTools, ...cardTools, ...cardTools];

  const smoothScrollTo = (target: number) => {
    if (!scrollRef.current || animating.current) return;
    animating.current = true;
    const start = offsetRef.current;
    const diff = target - start;
    const duration = 500;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const cur = start + diff * ease;
      offsetRef.current = cur;
      if (scrollRef.current) scrollRef.current.style.transform = `translateY(-${cur}px)`;
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        if (offsetRef.current >= total * ITEM_H * 2) {
          offsetRef.current -= total * ITEM_H;
          if (scrollRef.current) scrollRef.current.style.transform = `translateY(-${offsetRef.current}px)`;
        }
        if (offsetRef.current < total * ITEM_H) {
          offsetRef.current += total * ITEM_H;
          if (scrollRef.current) scrollRef.current.style.transform = `translateY(-${offsetRef.current}px)`;
        }
        animating.current = false;
      }
    };
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    offsetRef.current = total * ITEM_H;
    if (scrollRef.current) scrollRef.current.style.transform = `translateY(-${offsetRef.current}px)`;
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (!isDragging.current) smoothScrollTo(offsetRef.current + STEP * ITEM_H);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartY.current = e.clientY;
    dragStartOffset.current = offsetRef.current;
    document.body.style.cursor = "grabbing";
    e.preventDefault();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const dy = dragStartY.current - e.clientY;
    let next = dragStartOffset.current + dy;
    if (next >= total * ITEM_H * 2) next -= total * ITEM_H;
    if (next < total * ITEM_H) next += total * ITEM_H;
    offsetRef.current = next;
    scrollRef.current.style.transform = `translateY(-${next}px)`;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "";
    const snapped = Math.round(offsetRef.current / ITEM_H) * ITEM_H;
    smoothScrollTo(snapped);
  };

  return (
    <div
      className="w-[260px] rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(30,20,50,0.95) 0%, rgba(15,10,30,0.98) 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* Scroll area */}
      <div
        className="relative overflow-hidden pt-1"
        style={{
          height: `${VISIBLE * ITEM_H + 8}px`,
          cursor: "grab",
          maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div ref={scrollRef} style={{ willChange: "transform" }}>
          {looped.map((tool, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 select-none"
              style={{ height: `${ITEM_H}px` }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ToolLogoSmall tool={tool} />
                <span className="text-[13px] text-gray-200 truncate font-medium">{tool.name}</span>
              </div>
              <span className="text-[13px] font-bold text-white ml-2 shrink-0 tabular-nums">-{tool.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider + Total */}
      <div
        className="mx-4 border-t mb-2.5"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      />
      <div className="px-4 pb-3 flex items-center justify-between">
        <span className="text-[10px] text-gray-500 leading-tight max-w-[120px]">Total si se compran individualmente</span>
        <span className="text-[18px] font-bold tabular-nums" style={{ color: "#f97316" }}>$1,453</span>
      </div>

      {/* Brand bar */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}
      >
        <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-5 w-auto" />
        <span className="text-[20px] font-bold text-white tabular-nums">$14.9<span className="text-[13px] font-normal text-gray-400">/mes</span></span>
      </div>
    </div>
  );
};

const HeroSection = ({ settings = {} }: { settings?: Record<string, string> }) => {
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
                href={settings["cta_link"] ?? "https://app.shadowscale.pro/register"}
                className="glow-button inline-flex items-center justify-center text-white font-bold transition-colors"
                style={{ background: "#f97316", borderRadius: "12px", padding: "14px 28px", fontSize: "16px" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#ea580c")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#f97316")}
              >
                {settings["cta_text"] ?? "Comenzar gratis — 3 días"}
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

          {/* Right: vertical scroll price card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.25 }}
            className="hidden md:block shrink-0 self-center"
          >
            <PriceCard />
          </motion.div>
        </div>

        {/* Mobile price card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.4 }}
          className="md:hidden mt-6 mx-auto"
        >
          <PriceCard />
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
