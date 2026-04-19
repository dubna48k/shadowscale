import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Antes gastaba $150/mes solo en Canva y ChatGPT. Ahora pago $15 y tengo todo.",
    name: "Carlos M.",
    role: "Diseñador freelance",
  },
  {
    quote: "El acceso a Kalodata vale 10 veces el precio del plan. Indispensable para mi tienda.",
    name: "Laura R.",
    role: "Seller TikTok Shop",
  },
  {
    quote: "Sin contraseñas, sin complicaciones. Entro y listo. 100% recomendado.",
    name: "Diego F.",
    role: "Creador de contenido",
  },
];

const TestimonialsSection = () => {
  return (
    <section style={{ background: "#0d0d0d", padding: "80px 0" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-white text-[24px] sm:text-[28px] font-bold text-center mb-10">
          Lo que dicen nuestros miembros
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "24px" }}
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-[#f97316] text-[#f97316]" />
                ))}
              </div>
              <p className="text-white text-[15px] leading-relaxed mb-5">"{t.quote}"</p>
              <div>
                <p className="text-white text-[14px] font-semibold">{t.name}</p>
                <p className="text-gray-500 text-[13px]">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
