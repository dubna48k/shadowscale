import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, MessageCircle, RefreshCw } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";

const PagoRechazado = () => {
  const navigate = useNavigate();
  const { settings } = useSiteData();
  const wppNumber = (settings["gracias_wpp_number"] || settings["soporte_whatsapp"] || "").replace(/\D/g, "");
  const wppMsg = encodeURIComponent("Hola, intenté pagar en ShadowScale pero fue rechazado. ¿Me pueden ayudar?");
  const wppUrl = wppNumber ? `https://wa.me/${wppNumber}?text=${wppMsg}` : null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0a0a0a" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="w-full max-w-md flex flex-col items-center gap-6 text-center"
      >
        <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-10 w-auto opacity-80" />

        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "rgba(239,68,68,0.12)", border: "2px solid rgba(239,68,68,0.3)" }}>
          <XCircle className="w-10 h-10 text-red-400" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-white text-2xl font-bold">Pago no procesado</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Tu transacción no pudo completarse. No se realizó ningún cobro.
            Puedes intentarlo de nuevo o contactarnos si el problema persiste.
          </p>
        </div>

        <div className="w-full rounded-2xl p-4 text-left flex flex-col gap-2"
          style={{ background: "#161618", border: "1px solid rgba(239,68,68,0.2)" }}>
          <p className="text-red-400 text-xs font-semibold">Causas frecuentes</p>
          <ul className="text-gray-400 text-sm space-y-1.5">
            <li>• Fondos insuficientes</li>
            <li>• Tarjeta sin habilitar compras en línea</li>
            <li>• Datos de pago incorrectos</li>
          </ul>
        </div>

        <div className="flex flex-col w-full gap-3">
          <Link to="/#pricing"
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
            style={{ background: "#f97316" }}>
            <RefreshCw className="w-4 h-4" /> Intentar de nuevo
          </Link>
          {wppUrl && (
            <a href={wppUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
              style={{ background: "#25d366" }}>
              <MessageCircle className="w-4 h-4" /> Pedir ayuda por WhatsApp
            </a>
          )}
          <button onClick={() => navigate("/")}
            className="text-sm text-gray-600 hover:text-gray-400 transition-colors">
            Volver al inicio
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PagoRechazado;
