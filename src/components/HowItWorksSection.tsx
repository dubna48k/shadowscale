import { motion } from "framer-motion";
import { CreditCard, Zap, Layers } from "lucide-react";

const steps = [
  {
    icon: CreditCard,
    number: "01",
    title: "Elige tu plan",
    desc: "Starter desde $9.9/mes. Pago en segundos.",
    result: "Sin contratos. Cancela cuando quieras.",
    color: "#f97316",
  },
  {
    icon: Zap,
    number: "02",
    title: "Accede al instante",
    desc: "Recibes acceso inmediato al navegador ShadowScale.",
    result: "Sin instalar nada. Listo en menos de 2 minutos.",
    color: "#8b5cf6",
  },
  {
    icon: Layers,
    number: "03",
    title: "Usa todo sin límites",
    desc: "Un clic y entras a ChatGPT, Canva, Runway y más.",
    result: "Sin contraseñas. Sin cuentas. Sin límite de herramientas.",
    color: "#10b981",
  },
];

const HowItWorksSection = () => (
  <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: "#0a0a0a" }}>
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <h2 className="text-white text-[24px] sm:text-[28px] font-bold mb-2">De cero a +20 herramientas en 2 minutos</h2>
          <p className="text-gray-500 text-[14px]">El proceso más sencillo que vas a ver hoy</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: "#111", border: `1px solid ${step.color}20` }}
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${step.color}15` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: step.color }} size={18} />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${step.color}12`, color: step.color }}>
                  Paso {step.number}
                </span>
              </div>
              <div>
                <h3 className="text-white font-bold text-[16px] mb-1">{step.title}</h3>
                <p className="text-gray-400 text-[13px] leading-relaxed">{step.desc}</p>
              </div>
              <p className="text-[12px] font-medium mt-auto pt-2"
                style={{ color: step.color, borderTop: `1px solid ${step.color}15` }}>
                ✓ {step.result}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
