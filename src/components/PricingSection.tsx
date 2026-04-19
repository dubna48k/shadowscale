import { Check } from "lucide-react";

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
  highlighted?: boolean;
  ctaStyle: "outline" | "solid" | "gradient";
};

const plans: Plan[] = [
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
      "ChatGPT Plus ($22/mes)",
      "Canva Pro ($13/mes)",
      "CapCut Pro ($10/mes)",
      "Freepik Premium ($12/mes)",
      "Perplexity Pro ($20/mes)",
      "ElevenLabs Creator ($22/mes)",
      "Higgsfield Plus ($39/mes) — incluye Kling AI, Sora",
    ],
    realValue: "Valor real: $138/mes",
    savings: "Ahorras $123/mes",
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
      "ChatGPT Plus ($22/mes)",
      "Canva Pro ($13/mes)",
      "CapCut Pro ($10/mes)",
      "Freepik Premium ($12/mes)",
      "Perplexity Pro ($20/mes)",
      "ElevenLabs Creator ($22/mes)",
      "Higgsfield Plus ($39/mes)",
      "Leonardo AI Pro ($60/mes)",
      "Runway Pro ($100/mes)",
      "Seedance Pro ($16/mes)",
    ],
    realValue: "Valor real: $304/mes",
    savings: "Ahorras $274/mes",
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

const PricingSection = () => {
  return (
    <section id="pricing" className="px-4 sm:px-6 py-20">
      <div className="max-w-[1100px] mx-auto text-center">
        <h2 className="text-white text-[28px] sm:text-[34px] font-bold mb-3">
          Elige tu plan ShadowScale
        </h2>
        <p className="text-gray-400 text-[14px] sm:text-[16px] mb-12">
          Sin sorpresas, sin contratos. Cancela cuando quieras.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-start">
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

              <div className="border-t border-white/[0.08] pt-4 mb-5">
                <p className="text-gray-400 text-[13px]">{plan.realValue}</p>
                <p className="text-[13px] font-semibold" style={{ color: "#f97316" }}>
                  {plan.savings}
                </p>
              </div>

              <a
                href="https://app.shadowscale.pro/register"
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

        <p className="text-center mt-6" style={{ fontSize: "13px", color: "#666" }}>
          🔒 Acceso instantáneo · Sin contraseña · Cancela cuando quieras
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
