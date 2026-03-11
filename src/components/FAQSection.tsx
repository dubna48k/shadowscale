import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿Cómo funciona la prueba gratuita?",
    a: "Descarga ScalPass Browser y pruébalo durante 3 días sin costo. La prueba comienza al iniciar sesión en la aplicación, no al descargarla.",
  },
  {
    q: "¿Necesito tarjeta de crédito?",
    a: "No, puedes probar la aplicación durante 3 días sin ingresar ningún método de pago.",
  },
  {
    q: "¿Se acaban los créditos?",
    a: "No hay sistema de créditos. Con tu suscripción de $29/mes tienes acceso ilimitado a todas las herramientas premium del catálogo.",
  },
  {
    q: "¿Puedo cancelar?",
    a: "Sí, puedes cancelar en cualquier momento desde tu cuenta. Ofrecemos reembolso completo dentro de los primeros 7 días.",
  },
];

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const FAQSection = () => {
  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={spring}
      >
        <h2 className="text-xl font-bold text-white text-center mb-8">
          Preguntas frecuentes
        </h2>

        <Accordion type="single" collapsible className="space-y-0">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border-b border-white/[0.06] last:border-b-0"
            >
              <AccordionTrigger className="text-left text-[14px] font-medium text-white hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-[13px] text-gray-400 pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
};

export default FAQSection;
