import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Antes gastaba $150/mes solo en Canva y ChatGPT. Con ShadowScale pago $15 y tengo todo. Ahorro $135 al mes.",
    name: "Carlos M.",
    role: "Diseñador freelance",
    platform: "Instagram",
    platformColor: "#e1306c",
    seed: "CarlosM",
    metric: "Ahorra $135/mes",
  },
  {
    quote: "El acceso a Kalodata solo vale $99. Con el plan Elite tengo eso más 9 herramientas más por $30. Matemática simple.",
    name: "Laura R.",
    role: "Seller TikTok Shop",
    platform: "TikTok",
    platformColor: "#ff0050",
    seed: "LauraR",
    metric: "+$370 en herramientas",
  },
  {
    quote: "Probé el día gratis a las 11pm. A las 11:15 ya estaba usando Runway para mi proyecto. Compré de inmediato.",
    name: "Diego F.",
    role: "Creador de contenido",
    platform: "YouTube",
    platformColor: "#ff0000",
    seed: "DiegoF",
    metric: "Activo en 15 minutos",
  },
  {
    quote: "Uso Runway y Higgsfield todos los días para clientes. Solos valen $140. Con ShadowScale los tengo por $30.",
    name: "Valeria S.",
    role: "Editora de video",
    platform: "Instagram",
    platformColor: "#e1306c",
    seed: "ValeriaS",
    metric: "Ahorra $110/mes",
  },
  {
    quote: "Llevo 4 meses. Nunca tuve un problema. El soporte me respondió en 20 minutos cuando tuve una duda.",
    name: "Miguel A.",
    role: "Emprendedor digital",
    platform: "Twitter/X",
    platformColor: "#1da1f2",
    seed: "MiguelA",
    metric: "4 meses activo",
  },
  {
    quote: "Mi agencia usa los 10 tools del Elite. Antes pagábamos $900+/mes. Ahora $30. Presenté esto al equipo y todos quedaron locos.",
    name: "Patricia G.",
    role: "Dueña de agencia",
    platform: "LinkedIn",
    platformColor: "#0077b5",
    seed: "PatriciaG",
    metric: "Ahorra $870/mes",
  },
];

const TestimonialsSection = () => (
  <section style={{ background: "#0d0d0d", padding: "80px 0" }}>
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-white text-[24px] sm:text-[28px] font-bold mb-2">
          +1,600 miembros ya están ahorrando
        </h2>
        <p className="text-gray-500 text-[14px]">Lo que dicen quienes ya usan ShadowScale</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 100, damping: 20 }}
            className="flex flex-col"
            style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "16px", padding: "22px" }}
          >
            {/* Header: stars + platform */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-[#f97316] text-[#f97316]" />
                ))}
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${t.platformColor}18`, color: t.platformColor, border: `1px solid ${t.platformColor}30` }}>
                {t.platform}
              </span>
            </div>

            {/* Quote */}
            <p className="text-gray-300 text-[13.5px] leading-relaxed mb-4 flex-1">"{t.quote}"</p>

            {/* Metric badge */}
            <div className="mb-4">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>
                ✓ {t.metric}
              </span>
            </div>

            {/* Author */}
            <div className="flex items-center gap-2.5 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <img
                src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${t.seed}&backgroundColor=0a0a0a&shapeColor=f97316`}
                alt={t.name}
                className="w-8 h-8 rounded-full shrink-0"
                style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
              />
              <div>
                <p className="text-white text-[13px] font-semibold">{t.name}</p>
                <p className="text-gray-600 text-[12px]">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
