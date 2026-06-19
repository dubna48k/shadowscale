import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { useSiteData } from "@/hooks/useSiteData";
import {
  DollarSign, TrendingUp, ArrowUpRight, Star, Copy, Check,
  ChevronLeft, ChevronRight, ChevronDown, Zap, Crown,
  MessageCircle, Users, Link2, BarChart3,
} from "lucide-react";

// ─── Animation presets ───────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay },
});

const fadeUpView = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 } as { opacity: number; y: number },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay },
});

// ─── Animated number ─────────────────────────────────────────────────────────
const AnimNum = ({ to, prefix = "", suffix = "", decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const step = to / 40;
    const timer = setInterval(() => {
      cur += step;
      if (cur >= to) { setVal(to); clearInterval(timer); }
      else setVal(cur);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, to]);
  return <span ref={ref}>{prefix}{val.toFixed(decimals)}{suffix}</span>;
};

// ─── FAQ item ─────────────────────────────────────────────────────────────────
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-all hover:bg-white/[0.03]"
        style={{ background: open ? "rgba(249,115,22,0.06)" : "rgba(255,255,255,0.02)" }}>
        <span className="text-white text-sm font-semibold leading-snug">{q}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-orange-400" : "text-gray-600"}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <p className="px-5 pb-5 pt-1 text-gray-400 text-sm leading-relaxed" style={{ background: "rgba(255,255,255,0.01)" }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TIER_ICONS = [Zap, Star, Crown];
const TIER_COLORS = ["#f97316", "#8b5cf6", "#f59e0b"];

// ─── Main ─────────────────────────────────────────────────────────────────────
const Afiliados = () => {
  const { settings, plans } = useSiteData();

  const commission  = Number(settings["affiliate_commission"]  ?? "30");
  const minPayout   = settings["affiliate_min_payout"]         ?? "$50";
  const applyLink   = settings["affiliate_apply_link"]         ?? "/afiliados/registro";
  const intro       = settings["affiliate_intro"]              ?? "Gana comisiones recurrentes recomendando ShadowScale. Sin inversión, sin límites.";
  const socialCount = settings["affiliate_social_count"]       ?? "200+ afiliados activos";
  const discordLink = settings["soporte_discord"]              ?? "#";
  const whatsappNum = settings["soporte_whatsapp"]             ?? "";

  const avgPrice = plans.filter(p => p.status === "active").length > 0
    ? plans.filter(p => p.status === "active").reduce((s, p) => s + Number(p.price), 0) / plans.filter(p => p.status === "active").length
    : 14.9;

  const tiers = [
    {
      name:       settings["aff_tier1_name"]      ?? "Afiliado Básico",
      refs:       settings["aff_tier1_refs"]       ?? "De 1 a 20 referidos activos",
      commission: settings["aff_tier1_commission"] ?? `${commission}%`,
      perks:      (settings["aff_tier1_perks"]     ?? "Comisión recurrente por referido\nLink personalizado de afiliado\nAcceso al panel de estadísticas").split("\n").filter(Boolean),
      highlight: false,
    },
    {
      name:       settings["aff_tier2_name"]      ?? "Afiliado Pro",
      refs:       settings["aff_tier2_refs"]       ?? "De 21 a 100 referidos activos",
      commission: settings["aff_tier2_commission"] ?? `${commission + 5}%`,
      perks:      (settings["aff_tier2_perks"]     ?? "Todo lo del Básico\nMateriales exclusivos gratis\nSoporte prioritario dedicado\nTodo optimizado para tu crecimiento").split("\n").filter(Boolean),
      highlight: true,
    },
    {
      name:       settings["aff_tier3_name"]      ?? "Afiliado Elite Max",
      refs:       settings["aff_tier3_refs"]       ?? "100+ referidos activos",
      commission: settings["aff_tier3_commission"] ?? `${commission + 10}%`,
      perks:      (settings["aff_tier3_perks"]     ?? "Clases privadas con la comunidad\nComisión máxima progresiva\nBadge exclusivo en tu perfil").split("\n").filter(Boolean),
      highlight: false,
    },
  ];

  const testimonials = Array.from({ length: 4 }, (_, i) => ({
    name:     settings[`aff_test${i+1}_name`]   ?? ["Carlos M.","Daniela R.","Luis T.","Valentina G."][i],
    role:     settings[`aff_test${i+1}_role`]   ?? ["Content Creator","Marketing Digital","Emprendedor","Diseñadora UI"][i],
    text:     settings[`aff_test${i+1}_text`]   ?? [
      "Llevo 3 meses en el programa y ya genero más de $200 al mes sin hacer prácticamente nada. Las herramientas se venden solas.",
      "Me uní por curiosidad y en el primer mes recuperé más de lo que esperaba. El panel de estadísticas es muy claro.",
      "Compartí mi link en mi canal de YouTube y en dos semanas ya tenía 15 referidos. La plataforma es increíble.",
      "Lo que más me gusta es que la comisión es recurrente. No es venta única — cobras todos los meses.",
    ][i],
    rating:   Number(settings[`aff_test${i+1}_rating`] ?? "5"),
    initials: (settings[`aff_test${i+1}_name`] ?? "CDLV")[i === 0 ? 0 : 0]?.toUpperCase() ?? ["C","D","L","V"][i],
    color:    ["#f97316","#8b5cf6","#0ea5e9","#10b981"][i],
  }));

  const faqs = Array.from({ length: 6 }, (_, i) => ({
    q: settings[`aff_faq${i+1}_q`] ?? [
      "¿Necesito experiencia previa para unirme?",
      "¿Cuándo y cómo recibo mis pagos?",
      "¿Cómo funciona el sistema de tracking?",
      "¿Hay límite de referidos o ganancias?",
      "¿Puedo promover en redes sociales?",
      "¿Cómo me registro al programa?",
    ][i],
    a: settings[`aff_faq${i+1}_a`] ?? [
      "No necesitas experiencia. Solo necesitas una audiencia o comunidad interesada en IA y productividad.",
      `Los pagos se procesan mensualmente cuando superas el mínimo de ${minPayout} acumulado.`,
      "Cada link tiene un ID único. Registramos clics, registros y conversiones en tiempo real en tu panel.",
      "No hay ningún límite. Cuantos más referidos consigas, más subes de nivel y mayor es tu comisión.",
      "Sí, puedes promover en Instagram, TikTok, YouTube, Twitter, Discord y cualquier canal.",
      "Haz clic en 'Aplicar ahora', completa el formulario y recibirás respuesta en menos de 48h.",
    ][i],
  })).filter(f => f.q && f.a);

  const resources = Array.from({ length: 4 }, (_, i) => ({
    title: settings[`aff_res${i+1}_title`] ?? ["Plantillas listas","Scripts de ventas","Imágenes y assets","Guía de estrategia"][i],
    desc:  settings[`aff_res${i+1}_desc`]  ?? ["Posts, stories y reels para compartir en redes.","Textos probados para cerrar más referidos.","Banners y creativos para tus campañas.","Step-by-step para maximizar tus conversiones."][i],
    emoji: ["🎨","📝","🖼️","📈"][i],
  }));

  // Calculator
  const [refs, setRefs] = useState(10);
  const monthly = refs * avgPrice * (commission / 100);
  const yearly  = monthly * 12;

  // Copy link
  const [copied, setCopied] = useState(false);
  const copyLink = () => {
    const link = `${typeof window !== "undefined" ? window.location.origin : "https://shadowscale.pro"}/?ref=tucodigo`;
    navigator.clipboard.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  // Testimonials carousel
  const [tIdx, setTIdx] = useState(0);
  const maxT = testimonials.length;

  return (
    <PageLayout>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-1/4 w-[600px] h-[400px] blur-[140px] rounded-full"
            style={{ background: "rgba(249,115,22,0.08)" }} />
          <div className="absolute top-40 right-0 w-[400px] h-[300px] blur-[120px] rounded-full"
            style={{ background: "rgba(139,92,246,0.06)" }} />
        </div>

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <motion.div {...fadeUp(0)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-6 uppercase"
              style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)", color: "#fb923c" }}>
              <DollarSign className="w-3.5 h-3.5" /> Programa de Afiliados
            </motion.div>

            <motion.h1 {...fadeUp(0.05)}
              className="text-4xl sm:text-5xl lg:text-[52px] font-black text-white leading-[1.08] mb-5">
              Genera{" "}
              <span style={{ color: "#f97316" }}>Ingresos Recurrentes</span>
              {" "}con ShadowScale
            </motion.h1>

            <motion.p {...fadeUp(0.1)} className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">{intro}</motion.p>

            <motion.div {...fadeUp(0.15)} className="flex flex-col sm:flex-row gap-3">
              <a href={applyLink}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-white text-base transition-all hover:scale-105 hover:opacity-90"
                style={{ background: "#f97316", boxShadow: "0 0 40px rgba(249,115,22,0.3)" }}>
                Aplicar ahora <ArrowUpRight className="w-4 h-4" />
              </a>
              <a href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-gray-300 text-base transition-all hover:text-white"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                Cómo funciona
              </a>
            </motion.div>

            <motion.div {...fadeUp(0.2)}
              className="inline-flex items-center gap-2 mt-8 px-4 py-2 rounded-full text-xs font-semibold"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {socialCount}
            </motion.div>
          </div>

          {/* Right: earnings card */}
          <motion.div {...fadeUp(0.1)}>
            <div className="rounded-2xl p-6"
              style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-white font-bold text-sm">Empieza con un</span>
                <div className="px-4 py-2 rounded-xl font-black text-2xl"
                  style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }}>
                  {commission}%
                </div>
              </div>

              {/* Slider */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 text-xs">Referidos por mes</span>
                  <span className="text-white font-bold text-sm">{refs}</span>
                </div>
                <input type="range" min={1} max={100} value={refs} onChange={e => setRefs(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full outline-none cursor-pointer" style={{ accentColor: "#f97316" }} />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-gray-700">1</span>
                  <span className="text-[10px] text-gray-700">100</span>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                {[
                  { label: "Pendiente", val: "$0",                active: false },
                  { label: "Disponible", val: `$${(monthly * 0.6).toFixed(0)}`, active: false },
                  { label: "Este mes",   val: `$${monthly.toFixed(2)}`,          active: true  },
                ].map((s, i) => (
                  <motion.div key={i} layout
                    className="rounded-xl p-3 text-center"
                    style={{
                      background: s.active ? "rgba(249,115,22,0.1)" : "rgba(255,255,255,0.04)",
                      border: s.active ? "1px solid rgba(249,115,22,0.2)" : "1px solid rgba(255,255,255,0.06)",
                    }}>
                    <p className="text-gray-500 text-[10px] mb-1">{s.label}</p>
                    <p className={`font-bold text-sm ${s.active ? "text-orange-400" : "text-white"}`}>{s.val}</p>
                  </motion.div>
                ))}
              </div>

              {/* Mini bar chart */}
              <div className="flex items-end gap-1 h-12 mb-3">
                {[15,25,20,35,28,45,40,55,50,65,70,100].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm transition-all"
                    style={{
                      height: `${h}%`,
                      background: i === 11 ? "#f97316" : "rgba(255,255,255,0.07)",
                      minHeight: "4px",
                    }} />
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-600">Proyección mensual</span>
                <span className="text-orange-400 font-bold">
                  ${monthly.toFixed(2)}/mes · ${yearly.toFixed(0)}/año
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────── */}
      <section className="py-20 px-6 overflow-hidden">
        <motion.div {...fadeUpView()} className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#f97316" }}>Comunidad</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Opiniones de <span style={{ color: "#f97316" }}>nuestros afiliados</span>
            </h2>
            <p className="text-gray-500 text-sm mt-3">Generando ingresos reales con ShadowScale</p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div key={tIdx}
                  initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
                  className="grid md:grid-cols-3 gap-4">
                  {[tIdx, (tIdx+1)%maxT, (tIdx+2)%maxT].map((idx, pos) => {
                    const t = testimonials[idx];
                    return (
                      <div key={idx} className="rounded-2xl p-6 flex flex-col gap-4 transition-all"
                        style={{
                          background: "#111",
                          border: "1px solid rgba(255,255,255,0.07)",
                          opacity: pos === 0 ? 1 : 0.65,
                        }}>
                        <div className="flex gap-0.5">
                          {Array.from({ length: t.rating }).map((_, s) => (
                            <Star key={s} className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                          ))}
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed flex-1">"{t.text}"</p>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                            style={{ background: t.color }}>
                            {t.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">{t.name}</p>
                            <p className="text-gray-600 text-[11px]">{t.role}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              {[ChevronLeft, ChevronRight].map((Icon, i) => (
                <button key={i} onClick={i === 0 ? () => setTIdx(x => (x-1+maxT)%maxT) : () => setTIdx(x => (x+1)%maxT)}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:border-orange-400/50 hover:text-white"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#6b7280" }}>
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section id="como-funciona" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUpView()} className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#f97316" }}>¿Cómo Funciona?</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Así de simple es comenzar<br />a <span style={{ color: "#f97316" }}>ganar dinero</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <motion.div {...fadeUpView(0)} className="rounded-2xl overflow-hidden flex flex-col"
              style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="p-6 pb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(249,115,22,0.12)" }}>
                  <Users className="w-4 h-4 text-orange-400" />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">Regístrate en la Plataforma</h3>
                <p className="text-gray-500 text-xs leading-relaxed">Crea una cuenta de afiliado y obtén tu Link de afiliado en menos de 48h.</p>
              </div>
              <div className="mx-4 mb-4 rounded-xl p-4 flex flex-col gap-2"
                style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.05)" }}>
                {[{ l: "Nombre", v: "Tu nombre" }, { l: "Email", v: "tu@email.com" }].map(f => (
                  <div key={f.l}>
                    <p className="text-[10px] text-gray-600 mb-1">{f.l}</p>
                    <div className="rounded-lg px-3 py-2 text-[11px] text-gray-500"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>{f.v}</div>
                  </div>
                ))}
                <a href={applyLink}
                  className="mt-1 block text-center py-2 rounded-lg text-[11px] font-bold text-white"
                  style={{ background: "#f97316" }}>
                  Aplicar →
                </a>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div {...fadeUpView(0.08)} className="rounded-2xl overflow-hidden flex flex-col"
              style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="p-6 pb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(139,92,246,0.12)" }}>
                  <Link2 className="w-4 h-4" style={{ color: "#8b5cf6" }} />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">Comparte tu link</h3>
                <p className="text-gray-500 text-xs leading-relaxed">Comparte en redes, grupos, YouTube o con tus Seguidores y Clientes.</p>
              </div>
              <div className="mx-4 mb-4 rounded-xl p-4 flex flex-col gap-2"
                style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="text-[10px] text-gray-600">Tu link de referencia</p>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-lg px-3 py-2 text-[10px] text-gray-500 truncate"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    shadowscale.pro/?ref=tucodigo
                  </div>
                  <button onClick={copyLink}
                    className="px-3 py-2 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 transition-all"
                    style={{
                      background: copied ? "rgba(16,185,129,0.15)" : "#f97316",
                      color: copied ? "#10b981" : "#fff",
                      border: copied ? "1px solid rgba(16,185,129,0.3)" : "none",
                    }}>
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copiado" : "Copiar"}
                  </button>
                </div>
                <div className="flex gap-1.5 mt-1">
                  {["Instagram","TikTok","Discord"].map(p => (
                    <div key={p} className="flex-1 text-center py-1.5 rounded-lg text-[10px] text-gray-600"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>{p}</div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div {...fadeUpView(0.16)} className="rounded-2xl overflow-hidden flex flex-col"
              style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="p-6 pb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(16,185,129,0.12)" }}>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">Recibe tus Pagos</h3>
                <p className="text-gray-500 text-xs leading-relaxed">Genera el {commission}% por cada suscripción recurrente en ShadowScale de manera continua.</p>
              </div>
              <div className="mx-4 mb-4 rounded-xl p-4 flex flex-col gap-2"
                style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-xl p-3 text-center"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[10px] text-gray-600 mb-1">Pendiente</p>
                    <p className="text-white font-bold text-sm">$0</p>
                  </div>
                  <div className="flex-1 rounded-xl p-3 text-center"
                    style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)" }}>
                    <p className="text-[10px] text-gray-600 mb-1">Disponible</p>
                    <p className="text-orange-400 font-bold text-sm">$256</p>
                  </div>
                </div>
                <button className="w-full py-2 rounded-lg text-[11px] font-bold text-white" style={{ background: "#f97316" }}>
                  Retirar fondos →
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── COMMISSION + TIERS ─────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUpView()} className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
              Programa de <span style={{ color: "#f97316" }}>Afiliados</span>
            </h2>
            <p className="text-gray-500 text-sm">Gana más mientras más afiliados activos tengas</p>
          </motion.div>

          {/* Big badge */}
          <motion.div {...fadeUpView(0.05)} className="flex justify-center mb-10">
            <div className="rounded-2xl px-12 py-8 text-center"
              style={{ background: "linear-gradient(135deg,rgba(249,115,22,0.12),rgba(0,0,0,0) 60%),#111", border: "1px solid rgba(249,115,22,0.25)" }}>
              <p className="text-gray-500 text-[11px] font-bold tracking-widest uppercase mb-3">Comisión por referido</p>
              <p className="font-black text-[72px] sm:text-[96px] leading-none" style={{ color: "#f97316" }}>{commission}%</p>
              <p className="text-gray-600 text-xs mt-2">recurrente · mes tras mes · sin límites</p>
            </div>
          </motion.div>

          {/* Tiers */}
          <div className="grid md:grid-cols-3 gap-4">
            {tiers.map((tier, i) => {
              const Icon = TIER_ICONS[i];
              const color = TIER_COLORS[i];
              return (
                <motion.div key={tier.name} {...fadeUpView(i * 0.1)}
                  className="relative rounded-2xl p-6 flex flex-col gap-4"
                  style={{
                    background: tier.highlight ? "linear-gradient(135deg,rgba(249,115,22,0.08),rgba(0,0,0,0) 60%),#111" : "#111",
                    border: tier.highlight ? "1.5px solid rgba(249,115,22,0.35)" : "1px solid rgba(255,255,255,0.08)",
                  }}>
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-black text-white"
                      style={{ background: "#f97316" }}>MÁS POPULAR</div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{tier.name}</p>
                      <p className="text-[11px]" style={{ color }}>{tier.refs}</p>
                    </div>
                  </div>
                  <p className="text-3xl font-black" style={{ color }}>{tier.commission}</p>
                  <ul className="flex flex-col gap-2 flex-1">
                    {tier.perks.map((p, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div {...fadeUpView(0.3)} className="text-center mt-10">
            <a href={applyLink}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white text-base transition-all hover:scale-105 hover:opacity-90"
              style={{ background: "#f97316", boxShadow: "0 0 40px rgba(249,115,22,0.25)" }}>
              Comenzar ahora <ArrowUpRight className="w-4 h-4" />
            </a>
            <p className="text-gray-700 text-xs mt-3">No se cobra comisión antes de recibir tus beneficios</p>
          </motion.div>
        </div>
      </section>

      {/* ── RESOURCES ──────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUpView()} className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#f97316" }}>Recursos</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              <span style={{ color: "#f97316" }}>Crea</span> tu contenido
            </h2>
            <p className="text-gray-500 text-sm mt-3">Todo lo que necesitas para promocionar desde el primer día</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {resources.map((r, i) => (
              <motion.div key={i} {...fadeUpView(i * 0.08)}
                className="rounded-2xl p-6 flex items-start gap-4 transition-all hover:border-orange-400/20"
                style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-3xl shrink-0 mt-0.5">{r.emoji}</div>
                <div>
                  <h3 className="text-white font-bold mb-1">{r.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ SPLIT ──────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_1.6fr] gap-12 items-start">
          <motion.div {...fadeUpView()} className="lg:sticky lg:top-24">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight">
              ¿Tienes alguna duda que desees aclarar?
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Escríbenos directamente y te orientamos a través de WhatsApp o Discord.
            </p>
            <div className="flex flex-col gap-3">
              {whatsappNum && (
                <a href={`https://wa.me/${whatsappNum.replace(/\D/g,"")}`} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)", color: "#25D366" }}>
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </a>
              )}
              {discordLink && discordLink !== "#" && (
                <a href={discordLink} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: "rgba(88,101,242,0.1)", border: "1px solid rgba(88,101,242,0.2)", color: "#7289DA" }}>
                  <BarChart3 className="w-5 h-5" /> Discord
                </a>
              )}
            </div>
          </motion.div>

          <motion.div {...fadeUpView(0.05)} className="flex flex-col gap-2">
            {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <section className="py-20 px-6 pb-28">
        <motion.div {...fadeUpView()} className="max-w-3xl mx-auto rounded-2xl p-12 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,rgba(249,115,22,0.1),rgba(0,0,0,0) 60%),#111", border: "1px solid rgba(249,115,22,0.2)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[400px] h-[200px] blur-[100px] rounded-full"
              style={{ background: "rgba(249,115,22,0.1)" }} />
          </div>
          <TrendingUp className="w-10 h-10 text-orange-400 mx-auto mb-5 relative" />
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 relative">¿Listo para empezar?</h2>
          <p className="text-gray-400 text-base mb-8 max-w-sm mx-auto relative">
            Únete a los afiliados que ya generan ingresos pasivos con ShadowScale.
          </p>
          <a href={applyLink}
            className="relative inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white text-base transition-all hover:scale-105"
            style={{ background: "#f97316", boxShadow: "0 0 40px rgba(249,115,22,0.3)" }}>
            Aplicar al programa <ArrowUpRight className="w-5 h-5" />
          </a>
          <p className="mt-5 text-[12px] text-gray-700 relative">Sin costo · Sin contratos · Cancela cuando quieras</p>
        </motion.div>
      </section>

    </PageLayout>
  );
};

export default Afiliados;
