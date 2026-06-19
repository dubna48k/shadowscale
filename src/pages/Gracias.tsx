import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, Home } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";

const REDIRECT_SECS = 30;

const Gracias = () => {
  const navigate = useNavigate();
  const { settings, loading } = useSiteData();
  const [secs, setSecs] = useState(REDIRECT_SECS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecs(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  const wppNumber = (settings["gracias_wpp_number"] || settings["soporte_whatsapp"] || "").replace(/\D/g, "");
  const wppMessage = encodeURIComponent(
    settings["gracias_wpp_message"] || "¡Hola! Acabo de suscribirme a ShadowScale y quiero comenzar."
  );
  const wppUrl = wppNumber ? `https://wa.me/${wppNumber}?text=${wppMessage}` : null;

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (secs / REDIRECT_SECS) * circumference;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#0a0a0a" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="w-full max-w-md flex flex-col items-center gap-6 text-center"
      >
        {/* Logo */}
        <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-10 w-auto opacity-80" />

        {/* Icono éxito */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 16 }}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "rgba(16,185,129,0.12)", border: "2px solid rgba(16,185,129,0.3)" }}
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </motion.div>

        {/* Texto */}
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-2xl font-bold">¡Pago recibido!</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Tu acceso a ShadowScale está siendo activado. En los próximos minutos recibirás un correo con los detalles.
          </p>
        </div>

        {/* WhatsApp CTA */}
        {!loading && wppUrl && (
          <motion.a
            href={wppUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
            style={{ background: "#25d366" }}
          >
            <MessageCircle className="w-5 h-5" />
            Escríbenos por WhatsApp
          </motion.a>
        )}

        {/* Countdown ring */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r={radius} fill="none" stroke="#1f1f1f" strokeWidth="3" />
              <circle
                cx="28" cy="28" r={radius}
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <span className="text-white font-bold text-sm tabular-nums">{secs}</span>
          </div>
          <p className="text-gray-600 text-xs">Volviendo al inicio en {secs}s</p>
        </div>

        {/* Ir al inicio ya */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" /> Ir al inicio ahora
        </button>
      </motion.div>
    </div>
  );
};

export default Gracias;
