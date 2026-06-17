import PageLayout from "@/components/PageLayout";
import { useSiteData } from "@/hooks/useSiteData";
import { Mail, MessageCircle, Clock, Zap, Hash } from "lucide-react";

const Soporte = () => {
  const { settings } = useSiteData();
  const email = settings["soporte_email"] ?? "soporte@shadowscale.pro";
  const whatsapp = settings["soporte_whatsapp"] ?? "";
  const discord = settings["soporte_discord"] ?? "";
  const horario = settings["soporte_horario"] ?? "Lunes a Viernes · 9am – 8pm (COT)";

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-white mb-3">Soporte</h1>
        <p className="text-gray-400 mb-12">Estamos aquí para ayudarte. Elige el canal que prefieras.</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {discord && (
            <a href={discord} target="_blank" rel="noopener noreferrer"
              className="group rounded-2xl p-6 flex flex-col gap-3 transition-colors hover:bg-white/[0.04] sm:col-span-2"
              style={{ background: "linear-gradient(135deg, rgba(88,101,242,0.12), rgba(0,0,0,0) 60%), #161618", border: "1px solid rgba(88,101,242,0.3)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(88,101,242,0.18)" }}>
                <Hash className="w-5 h-5" style={{ color: "#818cf8" }} />
              </div>
              <div>
                <h2 className="text-white font-bold mb-1 flex items-center gap-2">Discord <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(88,101,242,0.2)", color: "#818cf8" }}>RECOMENDADO</span></h2>
                <p className="text-gray-500 text-sm">Únete a nuestra comunidad. Soporte rápido, novedades y ayuda directa del equipo.</p>
              </div>
              <span className="text-indigo-400 text-sm font-medium group-hover:underline">Entrar al Discord →</span>
            </a>
          )}
          <a href={`mailto:${email}`} className="group rounded-2xl p-6 flex flex-col gap-3 transition-colors hover:bg-white/[0.04]"
            style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(249,115,22,0.15)" }}>
              <Mail className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-white font-bold mb-1">Correo electrónico</h2>
              <p className="text-gray-500 text-sm">{email}</p>
            </div>
            <span className="text-orange-400 text-sm font-medium group-hover:underline">Enviar correo →</span>
          </a>

          {whatsapp && (
            <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
              className="group rounded-2xl p-6 flex flex-col gap-3 transition-colors hover:bg-white/[0.04]"
              style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-white font-bold mb-1">WhatsApp</h2>
                <p className="text-gray-500 text-sm">{whatsapp}</p>
              </div>
              <span className="text-emerald-400 text-sm font-medium group-hover:underline">Abrir WhatsApp →</span>
            </a>
          )}

          <div className="rounded-2xl p-6 flex flex-col gap-3"
            style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.15)" }}>
              <Clock className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-white font-bold mb-1">Horario de atención</h2>
              <p className="text-gray-500 text-sm">{horario}</p>
            </div>
          </div>

          <div className="rounded-2xl p-6 flex flex-col gap-3"
            style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(249,115,22,0.15)" }}>
              <Zap className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-white font-bold mb-1">Tiempo de respuesta</h2>
              <p className="text-gray-500 text-sm">Respuesta en menos de 24 horas hábiles</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-white font-bold mb-4">Preguntas frecuentes</h2>
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-white/[0.05] last:border-0 py-3">
              <p className="text-white text-sm font-medium mb-1">{faq.q}</p>
              <p className="text-gray-500 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

const faqs = [
  { q: "¿Cómo accedo a las herramientas después de suscribirme?", a: "Recibirás un correo con acceso al panel de ShadowScale donde podrás iniciar sesión en todas las herramientas con un clic." },
  { q: "¿Puedo cancelar cuando quiera?", a: "Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de usuario. No hay penalidades ni compromisos a largo plazo." },
  { q: "¿Cuántos usuarios pueden usar la misma cuenta?", a: "Cada suscripción es para un usuario. No está permitido compartir el acceso con otras personas." },
  { q: "¿Qué pasa si una herramienta no funciona?", a: "Contáctanos por correo o WhatsApp y lo resolvemos en menos de 24 horas. En casos críticos, tenemos un proceso de resolución urgente." },
];

export default Soporte;
