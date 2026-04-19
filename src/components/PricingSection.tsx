import { Check } from "lucide-react";

const features = [
  "20+ herramientas premium incluidas",
  "Acceso instantáneo sin contraseñas",
  "Nuevas tools cada mes",
  "Soporte por Discord 24/7",
  "Cancela en cualquier momento",
  "Cursos y recursos de bonus",
];

const PricingSection = () => {
  return (
    <section id="pricing" className="px-4 sm:px-6 py-20">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-white text-[28px] sm:text-[34px] font-bold mb-3">
          Un plan. Todo incluido.
        </h2>
        <p className="text-gray-400 text-[14px] sm:text-[16px] mb-10">
          Sin sorpresas, sin contratos. Cancela cuando quieras.
        </p>

        <div
          className="mx-auto text-left relative"
          style={{
            maxWidth: "420px",
            background: "#111",
            border: "2px solid #f97316",
            borderRadius: "20px",
            padding: "40px",
          }}
        >
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2"
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
            MÁS POPULAR
          </div>

          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-white" style={{ fontSize: "48px", fontWeight: 700, lineHeight: 1 }}>
              $14.9
            </span>
            <span className="text-gray-400 text-[14px]">/mes</span>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <span className="text-gray-500 line-through text-[14px]">$323/mes</span>
            <span className="text-gray-500 text-[12px]">Valor real</span>
          </div>

          <ul className="space-y-3 mb-8">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#f97316" }} strokeWidth={3} />
                <span className="text-white text-[14px]">{f}</span>
              </li>
            ))}
          </ul>

          <button
            className="w-full text-white transition-colors"
            style={{
              background: "#f97316",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "18px",
              fontWeight: 700,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ea580c")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f97316")}
          >
            Comenzar ahora
          </button>

          <p className="text-center text-gray-500 text-[12px] mt-3">
            🔒 Pago seguro · Sin compromisos
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
