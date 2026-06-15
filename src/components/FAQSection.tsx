import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿Cómo funciona la prueba gratuita de 3 días?",
    a: "Obtienes acceso completo a todas las herramientas de tu plan durante 3 días sin costo. Al finalizar, se activa tu suscripción mensual automáticamente. Puedes cancelar antes si no quieres continuar.",
  },
  {
    q: "¿Necesito crear una cuenta por separado en cada herramienta?",
    a: "No. ShadowScale gestiona el acceso por ti. Abres la app, seleccionas la herramienta y entras directamente — sin contraseñas, sin configuraciones.",
  },
  {
    q: "¿Qué pasa si el navegador no funciona?",
    a: "Nuestro equipo de soporte está disponible por WhatsApp y Discord para ayudarte a resolver cualquier problema lo antes posible, normalmente en menos de 1 hora.",
  },
  {
    q: "¿Se acaban los créditos o el uso?",
    a: "No. Si una herramienta alcanza su límite diario o mensual, la rotamos a otra cuenta en minutos para que sigas trabajando sin interrupciones.",
  },
  {
    q: "¿Para quién es ShadowScale?",
    a: "Para emprendedores, marketers, creadores de contenido, freelancers, agencias y estudiantes de LATAM que quieren acceder a las mejores herramientas de IA sin pagar múltiples suscripciones individuales.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos tarjetas de crédito/débito, PayPal y transferencias bancarias. Todos los pagos son procesados de forma segura.",
  },
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Sí. Cancelas cuando quieras sin penalización. Tu acceso permanece activo hasta el final del período pagado.",
  },
  {
    q: "¿Cuántas herramientas están incluidas?",
    a: "Dependiendo del plan: Starter incluye 4 herramientas, Pro incluye 7 y Elite incluye 10+. Seguimos agregando nuevas herramientas regularmente.",
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
