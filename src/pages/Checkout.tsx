import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, ExternalLink, Loader2, Mail, AlertCircle } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";
import { supabase } from "@/lib/supabase";

const PROVIDER_LABEL: Record<string, string> = {
  efipay: "Efipay",
  whop: "Whop",
  stripe: "Stripe",
  none: "",
};

const PROVIDER_COLOR: Record<string, string> = {
  efipay: "#f97316",
  whop: "#7c3aed",
  stripe: "#635bff",
};

const Checkout = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { plans, settings, loading } = useSiteData();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "redirecting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const planSlug = (params.get("plan") ?? "").toLowerCase();

  const plan = plans.find(p => p.name.toLowerCase() === planSlug)
    ?? plans.find(p => p.highlight)
    ?? plans[0];

  const provider = settings["checkout_provider"] ?? "none";
  const enabled = settings["checkout_enabled"] !== "false";

  // Verificar sesión para Efipay (requiere usuario autenticado)
  useEffect(() => {
    if (loading || provider !== "efipay") return;
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate(`/cuenta/login?redirect=/checkout${planSlug ? `?plan=${planSlug}` : ""}`, { replace: true });
      }
    });
  }, [loading, provider]);

  // Para Whop/Stripe: URL directa sin Edge Function
  const directUrl = (): string => {
    if (plan?.cta_link) return plan.cta_link;
    if (provider === "whop") return settings["checkout_whop_url"] ?? "";
    if (provider === "stripe") return settings[`checkout_stripe_url_${planSlug}`] ?? settings["checkout_stripe_url_pro"] ?? "";
    return "";
  };

  const isEfipay = provider === "efipay";
  const direct = directUrl();

  // Efipay: llama Edge Function y redirige
  const startEfipay = async () => {
    if (!plan) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const { data, error } = await supabase.functions.invoke("efipay-checkout", {
        body: {
          plan_name:    plan.name,
          plan_price:   plan.price,
          api_key:      settings["efipay_api_key"] || "",
          branch_id:    settings["efipay_branch_id"] || "",
          currency:     settings["efipay_currency"] || "COP",
          success_url:  settings["efipay_success_url"]  || `${window.location.origin}/gracias`,
          pending_url:  settings["efipay_pending_url"]  || `${window.location.origin}/pago-pendiente`,
          rejected_url: settings["efipay_rejected_url"] || `${window.location.origin}/pago-rechazado`,
          ref_code:     localStorage.getItem("ss_ref") || null,
        },
      });
      if (error || !data?.checkout_url) {
        setErrorMsg(data?.error ?? error?.message ?? "No se pudo conectar con Efipay");
        setStatus("error");
        return;
      }
      setStatus("redirecting");
      setTimeout(() => { window.location.href = data.checkout_url; }, 600);
    } catch (e: any) {
      setErrorMsg(e.message ?? "Error inesperado");
      setStatus("error");
    }
  };

  // Whop / Stripe: redirección directa
  useEffect(() => {
    if (loading || !enabled || isEfipay || !direct) return;
    setStatus("redirecting");
    const t = setTimeout(() => { window.location.href = direct; }, 800);
    return () => clearTimeout(t);
  }, [loading, enabled, isEfipay, direct]);

  // Efipay: arranca automáticamente al cargar
  useEffect(() => {
    if (loading || !enabled || !isEfipay || !plan) return;
    startEfipay();
  }, [loading, enabled, isEfipay, plan]);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#0a0a0a" }}>
      <div className="absolute top-6 left-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex flex-col gap-6"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-12 w-auto" />
        </div>

        {/* Plan card */}
        {plan && (
          <div className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-white text-lg font-bold">{plan.name}</h2>
                <p className="text-gray-500 text-sm">{plan.subtitle}</p>
              </div>
              {plan.highlight && (
                <span className="text-[9px] font-bold px-2 py-1 rounded-full text-white" style={{ background: "#f97316" }}>POPULAR</span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-white text-4xl font-bold">${plan.price}</span>
              <span className="text-gray-500 text-sm">/mes</span>
            </div>
            {plan.discount && (
              <span className="inline-flex self-start text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "#f97316" }}>
                {plan.discount}
              </span>
            )}
          </div>
        )}

        {/* Estado del checkout */}
        {enabled && (status === "loading" || status === "redirecting" || (isEfipay && status === "idle")) ? (
          <div className="rounded-2xl p-6 flex flex-col items-center gap-4 text-center" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <div>
              <p className="text-white font-semibold">
                {status === "redirecting" ? "Redirigiendo al pago..." : "Preparando tu pago..."}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Serás llevado a{" "}
                <span className="font-semibold" style={{ color: PROVIDER_COLOR[provider] ?? "#f97316" }}>
                  {PROVIDER_LABEL[provider] || "la pasarela de pago"}
                </span>
              </p>
            </div>
            {status === "redirecting" && direct && (
              <a href={direct} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                <ExternalLink className="w-4 h-4" /> Ir manualmente
              </a>
            )}
          </div>
        ) : enabled && status === "error" ? (
          <div className="rounded-2xl p-6 flex flex-col items-center gap-4 text-center" style={{ background: "#161618", border: "1px solid rgba(239,68,68,0.2)" }}>
            <AlertCircle className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-white font-semibold">Error al conectar con Efipay</p>
              <p className="text-gray-500 text-sm mt-1">{errorMsg}</p>
            </div>
            <button onClick={startEfipay}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90"
              style={{ background: "#f97316" }}>
              Reintentar
            </button>
          </div>
        ) : (
          <div className="rounded-2xl p-6 flex flex-col items-center gap-4 text-center" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(249,115,22,0.1)" }}>
              <Shield className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Checkout próximamente</h3>
              <p className="text-gray-500 text-sm mt-1">
                {settings["checkout_coming_soon_text"] ?? "Estamos configurando el sistema de pago. Sé el primero en ser notificado cuando esté listo."}
              </p>
            </div>
            {!submitted ? (
              <form onSubmit={handleNotify} className="w-full flex gap-2">
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/25" />
                <button type="submit" className="px-4 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-1.5" style={{ background: "#f97316" }}>
                  <Mail className="w-4 h-4" /> Notificarme
                </button>
              </form>
            ) : (
              <p className="text-emerald-400 text-sm font-medium">¡Listo! Te avisaremos cuando esté disponible.</p>
            )}
          </div>
        )}

        <p className="text-center text-xs text-gray-600">
          🔒 Pago seguro · SSL · Garantía de 7 días
        </p>
      </motion.div>
    </div>
  );
};

export default Checkout;
