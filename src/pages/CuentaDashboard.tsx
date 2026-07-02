import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, MessageCircle, CheckCircle2, Clock, XCircle, RefreshCw, Zap, Shield, ChevronRight, DollarSign, Copy, Check, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSiteData } from "@/hooks/useSiteData";

type AffiliateRecord = {
  id: string;
  code: string;
  status: string;
  commission_rate: number;
  total_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
};

type Subscription = {
  id: string;
  plan_name: string;
  plan_price: number;
  status: "pending" | "active" | "expired" | "cancelled";
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
};

const STATUS_MAP = {
  active:    { label: "Activa",     color: "#10b981", bg: "rgba(16,185,129,0.1)",  icon: CheckCircle2 },
  pending:   { label: "Pendiente",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  icon: Clock },
  expired:   { label: "Vencida",    color: "#ef4444", bg: "rgba(239,68,68,0.1)",   icon: XCircle },
  cancelled: { label: "Cancelada",  color: "#6b7280", bg: "rgba(107,114,128,0.1)", icon: XCircle },
};

const daysLeft = (expires_at: string | null) => {
  if (!expires_at) return null;
  const diff = Math.ceil((new Date(expires_at).getTime() - Date.now()) / 86400000);
  return diff;
};

const fmt = (d: string | null) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
};

const CuentaDashboard = () => {
  const navigate = useNavigate();
  const { settings, plans, loading: siteLoading } = useSiteData();
  const [user, setUser] = useState<any>(null);
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loadingSub, setLoadingSub] = useState(true);
  const [aff, setAff] = useState<AffiliateRecord | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { navigate("/cuenta/login", { replace: true }); return; }
      const u = data.session.user;
      setUser(u);
      fetchSub(u.id);
      supabase.from("affiliates").select("*").eq("email", u.email).maybeSingle().then(({ data: affData }) => {
        setAff((affData as AffiliateRecord) ?? null);
      });
    });
  }, []);

  const fetchSub = async (uid: string) => {
    setLoadingSub(true);
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setSub(data ?? null);
    setLoadingSub(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const wppNumber = (settings["gracias_wpp_number"] || settings["soporte_whatsapp"] || "").replace(/\D/g, "");
  const wppMsg = encodeURIComponent(settings["gracias_wpp_message"] || "¡Hola! Necesito ayuda con mi suscripción ShadowScale.");
  const wppUrl = wppNumber ? `https://wa.me/${wppNumber}?text=${wppMsg}` : null;

  const activePlan = plans.find(p => p.name.toLowerCase() === sub?.plan_name?.toLowerCase());
  const days = sub ? daysLeft(sub.expires_at) : null;
  const statusInfo = sub ? (STATUS_MAP[sub.status] ?? STATUS_MAP.pending) : null;
  const StatusIcon = statusInfo?.icon ?? Clock;

  const isExpiringSoon = days !== null && days >= 0 && days <= 5;
  const isExpired = sub?.status === "expired" || (days !== null && days < 0);

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-xl mx-auto flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/">
            <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
          </Link>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>

        {/* Saludo */}
        <div>
          <h1 className="text-white text-xl font-bold">Mi cuenta</h1>
          <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>
        </div>

        {/* Suscripción activa */}
        {loadingSub || siteLoading ? (
          <div className="rounded-2xl p-6 flex items-center justify-center h-32" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-5 h-5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          </div>
        ) : sub ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 flex flex-col gap-4"
            style={{ background: "#161618", border: `1px solid ${statusInfo?.color}25` }}
          >
            {/* Plan + status */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-gray-500 text-xs mb-1">Plan activo</p>
                <h2 className="text-white text-2xl font-bold">{sub.plan_name}</h2>
                <p className="text-gray-400 text-sm">${sub.plan_price}/mes</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shrink-0"
                style={{ background: statusInfo?.bg, color: statusInfo?.color, border: `1px solid ${statusInfo?.color}30` }}>
                <StatusIcon className="w-3 h-3" />
                {statusInfo?.label}
              </span>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3" style={{ background: "#0d0d0d" }}>
                <p className="text-gray-600 text-[11px] mb-0.5">Inicio</p>
                <p className="text-white text-sm font-medium">{fmt(sub.starts_at)}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: "#0d0d0d" }}>
                <p className="text-gray-600 text-[11px] mb-0.5">Vencimiento</p>
                <p className="text-sm font-medium" style={{ color: isExpiringSoon || isExpired ? "#ef4444" : "white" }}>
                  {fmt(sub.expires_at)}
                </p>
              </div>
            </div>

            {/* Alerta vencimiento */}
            {isExpiringSoon && !isExpired && (
              <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl"
                style={{ background: "rgba(245,158,11,0.08)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
                <Clock className="w-3.5 h-3.5 shrink-0" />
                Vence en {days} día{days !== 1 ? "s" : ""}. Renueva para no perder el acceso.
              </div>
            )}
            {isExpired && (
              <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl"
                style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                Tu suscripción ha vencido. Renueva para recuperar el acceso.
              </div>
            )}

            {/* Botón renovar */}
            {(isExpiringSoon || isExpired) && (
              <Link to={`/checkout?plan=${sub.plan_name.toLowerCase()}`}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
                style={{ background: "#f97316" }}>
                <RefreshCw className="w-4 h-4" /> Renovar suscripción
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            <div className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "#161618", border: "1px solid rgba(249,115,22,0.15)" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(249,115,22,0.1)" }}>
                <Zap className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Sin suscripción activa</p>
                <p className="text-gray-500 text-xs">Elige un plan para empezar ahora.</p>
              </div>
            </div>

            {plans.filter(p => p.status === "active").map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl p-4 flex flex-col gap-3"
                style={{
                  background: "#161618",
                  border: p.highlight ? "1.5px solid #f97316" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{p.name}</span>
                    {p.highlight && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#f97316" }}>POPULAR</span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-white text-xl font-bold">${p.price}</span>
                    <span className="text-gray-500 text-xs">/mes</span>
                  </div>
                </div>

                {p.features?.slice(0, 4).map((f: string) => (
                  <div key={f} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <CheckCircle2 className="w-3 h-3 text-orange-500 shrink-0" />
                    {f}
                  </div>
                ))}
                {(p.features?.length ?? 0) > 4 && (
                  <p className="text-xs text-gray-600">+{p.features.length - 4} herramientas más</p>
                )}

                <Link
                  to={`/checkout?plan=${p.name.toLowerCase()}`}
                  className="block w-full text-center py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
                  style={{ background: p.highlight ? "#f97316" : "rgba(249,115,22,0.15)", color: p.highlight ? "#fff" : "#f97316" }}
                >
                  Suscribirme · ${p.price}/mes
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Herramientas del plan */}
        {sub?.status === "active" && activePlan?.features?.length ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-500" />
              <h3 className="text-white font-semibold text-sm">Herramientas incluidas</h3>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {activePlan.features
                .filter((f: string) => f && !f.toLowerCase().includes("gratis") && !f.toLowerCase().includes("trial") && f.trim() !== "")
                .map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}

        {/* Afiliado */}
        {aff && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-2xl p-5 flex flex-col gap-4"
            style={{ background: "#161618", border: "1px solid rgba(249,115,22,0.18)" }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-orange-500" />
                <h3 className="text-white font-semibold text-sm">Programa de afiliados</h3>
              </div>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: aff.status === "approved" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                  color: aff.status === "approved" ? "#10b981" : "#f59e0b",
                  border: `1px solid ${aff.status === "approved" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`,
                }}
              >
                {aff.status === "approved" ? "Activo" : aff.status === "pending" ? "Pendiente aprobación" : aff.status}
              </span>
            </div>

            {aff.status === "approved" && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Comisión", value: `${aff.commission_rate}%` },
                    { label: "Ganancias", value: `$${(aff.total_earnings ?? 0).toFixed(2)}` },
                    { label: "Pendiente", value: `$${(aff.pending_earnings ?? 0).toFixed(2)}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl p-3 text-center" style={{ background: "#0d0d0d" }}>
                      <p className="text-gray-600 text-[10px] mb-0.5">{label}</p>
                      <p className="text-white text-sm font-bold">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "#0d0d0d" }}>
                  <span className="text-xs text-gray-500 flex-1 font-mono truncate">
                    {typeof window !== "undefined" ? window.location.origin : "https://shadowscale.pro"}/?ref={aff.code}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/?ref=${aff.code}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="shrink-0 p-1.5 rounded-lg transition-colors"
                    style={{ background: copied ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.05)" }}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                  </button>
                </div>

                <Link
                  to="/afiliados/dashboard"
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }}
                >
                  Ver panel completo <ExternalLink className="w-3 h-3" />
                </Link>
              </>
            )}

            {aff.status === "pending" && (
              <p className="text-xs text-gray-500">Tu solicitud está en revisión. Te notificaremos por email cuando sea aprobada.</p>
            )}
          </motion.div>
        )}

        {/* Soporte */}
        {wppUrl && (
          <motion.a
            href={wppUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 p-4 rounded-2xl hover:opacity-90 transition-opacity"
            style={{ background: "#161618", border: "1px solid rgba(37,211,102,0.2)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(37,211,102,0.1)" }}>
              <MessageCircle className="w-5 h-5" style={{ color: "#25d366" }} />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">Soporte por WhatsApp</p>
              <p className="text-gray-500 text-xs">Respuesta rápida · Lun–Vie</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </motion.a>
        )}

        <p className="text-center text-xs text-gray-700 pb-4">
          ShadowScale · <Link to="/terminos" className="hover:text-gray-500">Términos</Link> · <Link to="/politica" className="hover:text-gray-500">Privacidad</Link>
        </p>
      </div>
    </div>
  );
};

export default CuentaDashboard;
