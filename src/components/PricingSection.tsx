import { Check, Lock, RefreshCw, Zap, ChevronDown, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Plan as SupabasePlan } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";

const usePromoCountdown = (startedAt: string | null, durationHours: number) => {
  const endTime = startedAt
    ? new Date(new Date(startedAt).getTime() + durationHours * 3600000)
    : null;
  const calc = () => {
    if (!endTime) return { d: 0, h: 0, m: 0, s: 0 };
    const diff = endTime.getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { setT(calc()); }, [startedAt, durationHours]);
  useEffect(() => {
    if (!endTime) return;
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [endTime?.getTime()]);
  return t;
};

type Plan = {
  name: string;
  subtitle: string;
  oldPrice: string;
  price: string;
  discount: string;
  topBadge?: string;
  features: string[];
  realValue: string;
  savings: string;
  cta: string;
  ctaLink?: string;
  highlighted?: boolean;
  ctaStyle: "outline" | "solid" | "gradient";
};

const FALLBACK_PLANS: Plan[] = [
  {
    name: "Starter",
    subtitle: "Creación de contenido esencial",
    oldPrice: "$67/mes",
    price: "$9.9",
    discount: "LANZAMIENTO -85%",
    features: [
      "ChatGPT Plus",
      "Canva Pro",
      "CapCut Pro",
      "Freepik Premium",
    ],
    realValue: "",
    savings: "",
    cta: "Comenzar con Starter",
    ctaStyle: "outline",
  },
  {
    name: "Pro",
    subtitle: "Para creadores y emprendedores",
    oldPrice: "$144/mes",
    price: "$14.9",
    discount: "LANZAMIENTO -90%",
    topBadge: "MÁS POPULAR",
    features: [
      "ChatGPT Plus",
      "Canva Pro",
      "CapCut Pro",
      "Freepik Premium",
      "Perplexity Pro",
      "ElevenLabs Creator",
      "Higgsfield Plus — incluye Kling AI, Sora",
    ],
    realValue: "",
    savings: "",
    cta: "Comenzar con Pro",
    highlighted: true,
    ctaStyle: "solid",
  },
  {
    name: "Elite",
    subtitle: "Para profesionales e investigadores",
    oldPrice: "$304/mes",
    price: "$29.9",
    discount: "LANZAMIENTO -90%",
    topBadge: "MÁXIMO PODER",
    features: [
      "ChatGPT Plus",
      "Canva Pro",
      "CapCut Pro",
      "Freepik Premium",
      "Perplexity Pro",
      "ElevenLabs Creator",
      "Higgsfield Plus",
      "Leonardo AI Pro",
      "Runway Pro",
      "Seedance Pro",
    ],
    realValue: "",
    savings: "",
    cta: "Comenzar con Elite",
    ctaStyle: "gradient",
  },
];

const getCtaStyle = (style: Plan["ctaStyle"]): React.CSSProperties => {
  if (style === "outline") {
    return {
      background: "transparent",
      border: "2px solid #f97316",
      color: "#f97316",
    };
  }
  if (style === "gradient") {
    return {
      background: "linear-gradient(135deg, #f97316, #dc2626)",
      color: "#fff",
    };
  }
  return { background: "#f97316", color: "#fff" };
};

const ctaStyleByIndex = (i: number, highlight: boolean): Plan["ctaStyle"] =>
  highlight ? "solid" : i === 0 ? "outline" : "gradient";

interface PricingSectionProps {
  supabasePlans?: SupabasePlan[];
  settings?: Record<string, string>;
}

const TimeBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="text-white font-bold text-[20px] leading-none tabular-nums w-9 text-center"
      style={{ fontVariantNumeric: "tabular-nums" }}>
      {String(value).padStart(2, "0")}
    </div>
    <span className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "#f97316" }}>{label}</span>
  </div>
);

const PricingFaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
        style={{ background: open ? "rgba(249,115,22,0.05)" : "#161618" }}>
        <span className="text-white text-sm font-semibold">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <p className="px-5 pb-4 text-gray-400 text-sm leading-relaxed" style={{ background: "#161618" }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PricingSection = ({ supabasePlans, settings = {} }: PricingSectionProps) => {
  const [promoStartedAt, setPromoStartedAt] = useState<string | null>(null);
  useEffect(() => {
    supabase.functions.invoke("promo-timer")
      .then(({ data }) => { if (data?.started_at) setPromoStartedAt(data.started_at); })
      .catch(() => null);
  }, []);
  const promoDurationHours = Number(settings["promo_duration_hours"] ?? 72);
  const { d, h, m, s } = usePromoCountdown(promoStartedAt, promoDurationHours);
  const activePlans = (supabasePlans ?? []).filter(p => p.status === "active");

  const plans: Plan[] = activePlans.length > 0
    ? activePlans.map((p, i) => ({
        name: p.name,
        subtitle: p.subtitle ?? "",
        oldPrice: p.old_price ?? "",
        price: p.price ? `$${p.price}` : "",
        discount: p.discount ?? "",
        topBadge: p.top_badge ?? undefined,
        features: p.features ?? [],
        realValue: "",
        savings: "",
        cta: p.cta_text ?? "Comenzar",
        ctaLink: p.cta_link,
        highlighted: p.highlight,
        ctaStyle: ctaStyleByIndex(i, p.highlight),
      }))
    : FALLBACK_PLANS;

  // Social proof + FAQs from CMS
  const membersCount = settings["pricing_members_count"] ?? "500+";
  const membersSavings = settings["pricing_savings"] ?? "$200";
  const toolsValue = settings["pricing_tools_value"] ?? "$2,000";
  const showSocialProof = settings["pricing_show_social_proof"] !== "false";

  const pricingFaqs = Array.from({ length: 10 }, (_, i) => ({
    q: settings[`pricing_faq${i + 1}_q`] ?? [
      "¿Cómo funciona la prueba gratuita de 1 día?",
      "¿Necesito crear una cuenta por separado en cada herramienta?",
      "¿Qué pasa si el navegador no funciona?",
      "¿Se acaban los créditos o el uso?",
      "¿Para quién es ShadowScale?",
      "¿Qué métodos de pago aceptan?",
      "¿Puedo cancelar en cualquier momento?",
      "¿Cuántas herramientas están incluidas?",
      "¿Puedo cambiar de plan después?",
      "¿Cómo funciona el acceso compartido?",
    ][i],
    a: settings[`pricing_faq${i + 1}_a`] ?? [
      "Obtienes acceso completo a todas las herramientas de tu plan durante 1 día sin costo. Al finalizar, se activa tu suscripción mensual. Puedes cancelar antes si no quieres continuar.",
      "No. ShadowScale gestiona el acceso por ti. Abres la app, seleccionas la herramienta y entras directamente — sin contraseñas, sin configuraciones.",
      "Nuestro equipo de soporte está disponible por WhatsApp y Discord para ayudarte a resolver cualquier problema lo antes posible, normalmente en menos de 1 hora.",
      "No. Si una herramienta alcanza su límite diario o mensual, la rotamos a otra cuenta en minutos para que sigas trabajando sin interrupciones.",
      "Para emprendedores, marketers, creadores de contenido, freelancers, agencias y estudiantes de LATAM que quieren acceder a las mejores herramientas de IA sin pagar múltiples suscripciones.",
      "Procesamos pagos con Efipay: tarjetas débito/crédito, PSE y efectivo (Efecty, Baloto). Todos los pagos son seguros y en pesos colombianos.",
      "Sí. Cancelas cuando quieras sin penalización. Tu acceso permanece activo hasta el final del período pagado.",
      "Depende del plan: Starter incluye 4 herramientas, Pro incluye 7 y Elite incluye 10+. Seguimos agregando nuevas herramientas regularmente.",
      "Sí. Puedes actualizar tu plan en cualquier momento desde tu panel de cuenta. El cambio aplica en el siguiente ciclo de facturación.",
      "Las cuentas son personales. Cada miembro activa su acceso con su propio correo. Compartir credenciales viola los términos de servicio.",
    ][i],
  })).filter(f => f.q && f.a);

  return (
    <section id="pricing" className="px-4 sm:px-6 py-20">
      <div className="max-w-[1100px] mx-auto text-center">

        {/* Social proof banner */}
        {showSocialProof && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}>
              <Users className="w-4 h-4" />
              {membersCount} miembros ahorrando {membersSavings}+/mes
              <span className="text-emerald-400 opacity-50 mx-1">·</span>
              <span className="text-emerald-700 text-xs">herramientas por valor de {toolsValue}</span>
            </div>
          </div>
        )}

        {/* Countdown urgency */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-4 px-5 py-3 rounded-2xl"
            style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)" }}>
            <div className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#f97316" }}>
              <Zap className="w-3.5 h-3.5" />
              Precio de lanzamiento termina en
            </div>
            <div className="flex items-center gap-2.5">
              <TimeBox value={d} label="días" />
              <span className="text-gray-600 font-bold text-lg -mt-2">:</span>
              <TimeBox value={h} label="horas" />
              <span className="text-gray-600 font-bold text-lg -mt-2">:</span>
              <TimeBox value={m} label="min" />
              <span className="text-gray-600 font-bold text-lg -mt-2">:</span>
              <TimeBox value={s} label="seg" />
            </div>
          </div>
        </div>
        <h2 className="text-white text-[28px] sm:text-[34px] font-bold mb-3">
          {settings["pricing_title"] ?? "Elige tu plan ShadowScale"}
        </h2>
        <p className="text-gray-400 text-[14px] sm:text-[16px] mb-12">
          {settings["pricing_subtitle"] ?? "Sin sorpresas, sin contratos. Cancela cuando quieras."}
        </p>

        <div className={`grid grid-cols-1 gap-6 mx-auto justify-center items-stretch ${
          plans.length === 1 ? "md:grid-cols-1 max-w-md" :
          plans.length === 2 ? "md:grid-cols-2 max-w-3xl" :
          "md:grid-cols-3 max-w-5xl"
        }`}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="text-left relative flex flex-col h-full"
              style={{
                background: "#111",
                border: plan.highlighted ? "2px solid #f97316" : "1px solid #2a2a2a",
                borderRadius: "20px",
                padding: "32px 28px",
                transform: plan.highlighted ? "scale(1.05)" : "none",
                zIndex: plan.highlighted ? 2 : 1,
              }}
            >
              {plan.topBadge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  style={{
                    background: "#f97316",
                    borderRadius: "20px",
                    padding: "4px 14px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "0.5px",
                  }}
                >
                  {plan.topBadge}
                </div>
              )}

              <h3 className="text-white text-[22px] font-bold mb-1">{plan.name}</h3>
              <p className="text-gray-400 text-[13px] mb-5">{plan.subtitle}</p>

              <div className="mb-2">
                <span className="text-gray-500 line-through text-[14px]">{plan.oldPrice}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-white" style={{ fontSize: "44px", fontWeight: 700, lineHeight: 1 }}>
                  {plan.price}
                </span>
                <span className="text-gray-400 text-[14px]">/mes</span>
              </div>

              <div
                className="inline-block self-start mb-6"
                style={{
                  background: "#f97316",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "0.5px",
                }}
              >
                {plan.discount}
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 shrink-0 mt-1" style={{ color: "#f97316" }} strokeWidth={3} />
                    <span className="text-white text-[13.5px] leading-snug">{f}</span>
                  </li>
                ))}
              </ul>


              <a
                href={settings["checkout_provider"] === "efipay" ? `/checkout?plan=${plan.name.toLowerCase()}` : (plan.ctaLink ?? `/checkout?plan=${plan.name.toLowerCase()}`)}
                className="block w-full text-center transition-colors"
                style={{
                  ...getCtaStyle(plan.ctaStyle),
                  borderRadius: "12px",
                  padding: "14px",
                  fontSize: "15px",
                  fontWeight: 700,
                }}
                onMouseEnter={(e) => {
                  if (plan.ctaStyle === "solid") e.currentTarget.style.background = "#ea580c";
                  if (plan.ctaStyle === "outline") {
                    e.currentTarget.style.background = "#f97316";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (plan.ctaStyle === "solid") e.currentTarget.style.background = "#f97316";
                  if (plan.ctaStyle === "outline") {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#f97316";
                  }
                }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8">
          {[
            { icon: Lock, text: "Pago 100% seguro" },
            { icon: RefreshCw, text: "Cancela cuando quieras" },
            { icon: Zap, text: "Acceso instantáneo" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-[12px] text-gray-500">
              <Icon className="w-3.5 h-3.5 text-gray-600" />
              {text}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-16 text-left">
          <h3 className="text-xl font-bold text-white text-center mb-6">Preguntas frecuentes</h3>
          <div className="flex flex-col gap-2">
            {pricingFaqs.map((f, i) => <PricingFaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PricingSection;
