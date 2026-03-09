import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿Necesito tarjeta de crédito para la prueba gratuita?",
    a: "No, puedes descargar Scalboost Browser y probarlo durante 3 días sin ingresar ningún método de pago. La prueba comienza al iniciar sesión en la aplicación, no al descargarla.",
  },
  {
    q: "¿Cómo funcionan los créditos de herramientas?",
    a: "Con tu suscripción mensual de $29 tienes acceso ilimitado a todas las herramientas premium incluidas en el catálogo. No hay sistema de créditos ni límites de uso.",
  },
  {
    q: "¿Cuál es la política de reembolsos?",
    a: "Ofrecemos reembolso completo dentro de los primeros 7 días después de tu primer pago. Si no estás satisfecho, contáctanos y procesaremos tu reembolso sin preguntas.",
  },
  {
    q: "¿Es seguro usar cuentas compartidas?",
    a: "Sí. Scalboost Browser gestiona las sesiones de forma aislada. Cada usuario tiene su propio entorno seguro sin compartir datos personales con otros miembros.",
  },
  {
    q: "¿En qué sistemas operativos funciona?",
    a: "Scalboost Browser está disponible para Windows 10+ y macOS 12+. Próximamente agregaremos soporte para Linux.",
  },
];

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const FAQSection = () => {
  return (
    <section className="max-w-3xl mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={spring}
      >
        <h2 className="text-3xl font-bold text-center mb-2">Preguntas frecuentes</h2>
        <p className="text-muted-foreground text-center mb-10">Todo lo que necesitas saber</p>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="glass border border-glass px-6 rounded-2xl"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
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
