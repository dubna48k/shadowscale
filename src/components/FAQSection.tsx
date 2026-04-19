import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿Qué pasa si el navegador no funciona?",
    a: "Nuestro equipo de soporte está disponible para ayudarte a resolver cualquier problema lo antes posible.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Puedes pagar con tarjetas de crédito o débito, Apple Pay, Amazon Pay, Klarna, Cash App Pay y Link para un proceso rápido y seguro.",
  },
  {
    q: "¿Se acaban los créditos?",
    a: "No. Si una herramienta alcanza su límite diario/mensual, la cambiamos a otra cuenta en minutos, para que sigas trabajando.",
  },
  {
    q: "¿Ofrecen reembolsos?",
    a: "No hay reembolsos disponibles. Una vez que pagas, obtienes acceso inmediato.",
  },
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Sí. Cancela en cualquier momento. Tu acceso permanece activo hasta el final de tu período de prueba/facturación actual.",
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
