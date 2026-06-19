import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase, Affiliate, Referral } from "@/lib/supabase";
import { sendEmail } from "@/lib/email";
import { useAuth } from "@/hooks/useAuth";
import {
  LogOut, Copy, Check, MousePointerClick, Users, DollarSign,
  Clock, ShieldCheck, RefreshCw, TrendingUp, Wallet,
} from "lucide-react";

const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

const genCode = (name: string) => {
  const slug = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "").slice(0, 6) || "aff";
  return `${slug}${Math.random().toString(36).slice(2, 6)}`;
};

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl p-5 ${className}`} style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>{children}</div>
);

const inputCls = "w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-orange-500/50 transition-colors placeholder:text-gray-600";
const labelCls = "text-[11px] text-gray-500 uppercase tracking-wide font-semibold";

const PLATFORMS = ["Instagram","TikTok","YouTube","Twitter / X","Facebook","LinkedIn","Blog / Web","Email marketing","Discord / Telegram","Otro"];
const AUDIENCE_SIZES = ["Menos de 1,000","1,000 – 5,000","5,000 – 20,000","20,000 – 100,000","Más de 100,000"];
const PAYOUT_METHODS = ["Nequi / Daviplata","Transferencia bancaria","PayPal","Cripto (USDT)","Binance Pay","Otro"];
const PLATFORM_PLACEHOLDER: Record<string,string> = {
  "Instagram":"https://instagram.com/tuusuario","TikTok":"https://tiktok.com/@tuusuario",
  "YouTube":"https://youtube.com/@tucanal","Blog / Web":"https://tusitio.com",
};

// ─── Crear perfil de afiliado ────────────────────────────────────────────────
const CreateAffiliate = ({ onCreated }: { onCreated: () => void }) => {
  const { user, profile } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [country, setCountry] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [platformUrl, setPlatformUrl] = useState("");
  const [audienceSize, setAudienceSize] = useState("");
  const [bio, setBio] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("Nequi / Daviplata");
  const [payoutDetails, setPayoutDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const create = async () => {
    if (!user) return;
    if (!payoutDetails.trim()) { setErr("Ingresa tus datos de pago"); return; }
    setBusy(true); setErr("");
    const name = profile?.full_name || user.email?.split("@")[0] || "Afiliado";
    let lastErr: any = null;
    for (let i = 0; i < 4; i++) {
      const code = genCode(name);
      const { error } = await supabase.from("affiliates").insert({
        user_id: user.id, code, name, email: user.email,
        status: "pending",
        payout_method: payoutMethod,
        payout_details: payoutDetails.trim(),
        country: country.trim() || null,
        platform,
        platform_url: platformUrl.trim() || null,
        audience_size: audienceSize || null,
        bio: bio.trim() || null,
      });
      if (!error) {
        if (user.email) sendEmail(user.email, "affiliate_welcome", { name });
        onCreated();
        return;
      }
      lastErr = error;
      if (!error.message?.includes("duplicate") && !error.message?.includes("unique")) break;
    }
    setErr(lastErr?.message ?? "No se pudo crear el perfil"); setBusy(false);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-start justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg flex flex-col gap-5">
        <div className="text-center">
          <h2 className="text-white font-bold text-2xl">Configura tu perfil de afiliado</h2>
          <p className="text-gray-500 text-sm mt-1">Completa tu información para activar tu cuenta y empezar a ganar comisiones.</p>
        </div>

        {/* Pasos */}
        <div className="flex items-center justify-center gap-2">
          {([1, 2] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className="w-10 h-px" style={{ background: step >= s ? "#f97316" : "#2a2a2a" }} />}
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: step >= s ? "#f97316" : "#1f1f22", color: step >= s ? "#fff" : "#555" }}>{s}</div>
                <span className="text-xs" style={{ color: step >= s ? "#e5e7eb" : "#555" }}>
                  {s === 1 ? "Tu perfil" : "Método de pago"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Paso 1 */}
        {step === 1 && (
          <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-white font-semibold text-sm">Cuéntanos sobre ti y tu audiencia</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>País</label>
                <input className={inputCls} placeholder="Colombia, México..." value={country} onChange={e => setCountry(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Plataforma principal</label>
                <select className={inputCls} value={platform} onChange={e => setPlatform(e.target.value)}>
                  {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>URL de tu perfil / canal</label>
              <input className={inputCls} placeholder={PLATFORM_PLACEHOLDER[platform] ?? "https://..."}
                value={platformUrl} onChange={e => setPlatformUrl(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Tamaño de audiencia</label>
              <select className={inputCls} value={audienceSize} onChange={e => setAudienceSize(e.target.value)}>
                <option value="">Selecciona un rango</option>
                {AUDIENCE_SIZES.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>¿Cómo planeas promocionarnos? <span className="text-gray-700 normal-case">(opcional)</span></label>
              <textarea className={inputCls} rows={3}
                placeholder="Ej: Hago reseñas de herramientas IA en TikTok, tengo newsletter de emprendimiento..."
                value={bio} onChange={e => setBio(e.target.value)} />
            </div>
            <button onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity mt-1"
              style={{ background: "#f97316" }}>
              Continuar →
            </button>
          </div>
        )}

        {/* Paso 2 */}
        {step === 2 && (
          <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-white font-semibold text-sm">¿Cómo quieres recibir tus comisiones?</p>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Método de pago</label>
              <select className={inputCls} value={payoutMethod} onChange={e => setPayoutMethod(e.target.value)}>
                {PAYOUT_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>
                {payoutMethod === "Nequi / Daviplata" ? "Número de celular" :
                 payoutMethod === "PayPal" ? "Correo PayPal" :
                 payoutMethod.includes("Cripto") || payoutMethod === "Binance Pay" ? "Wallet o ID Binance" :
                 payoutMethod === "Transferencia bancaria" ? "Banco, cuenta y tipo" : "Datos de pago"}
              </label>
              <input className={inputCls}
                placeholder={
                  payoutMethod === "Nequi / Daviplata" ? "+57 300 000 0000" :
                  payoutMethod === "PayPal" ? "correo@ejemplo.com" :
                  payoutMethod.includes("Cripto") ? "TXxxxxxx... (TRC20)" :
                  payoutMethod === "Binance Pay" ? "ID de Binance Pay" :
                  "Bancolombia · Ahorros · 0000000000"
                }
                value={payoutDetails} onChange={e => setPayoutDetails(e.target.value)} />
            </div>
            <div className="p-3 rounded-xl text-xs text-gray-500 flex gap-2 items-start"
              style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="shrink-0">💡</span>
              Pagos mensuales al superar el mínimo. Revisaremos tu solicitud en 24–48 horas.
            </div>
            {err && <p className="text-red-400 text-xs">{err}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl font-medium text-gray-400 text-sm hover:text-white transition-colors"
                style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)" }}>
                ← Volver
              </button>
              <button onClick={create} disabled={busy}
                className="flex-1 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                style={{ background: "#f97316" }}>
                {busy ? "Enviando..." : "Activar mi cuenta"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const AfiliadoDashboard = () => {
  const nav = useNavigate();
  const { session, loading, signOut } = useAuth();
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [fetching, setFetching] = useState(true);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    if (!session?.user) return;
    setFetching(true);
    const { data: aff } = await supabase.from("affiliates").select("*").eq("user_id", session.user.id).maybeSingle();
    setAffiliate((aff as Affiliate) ?? null);
    if (aff) {
      const { data: refs } = await supabase.from("referrals").select("*").eq("affiliate_id", (aff as Affiliate).id).order("created_at", { ascending: false });
      setReferrals((refs as Referral[]) ?? []);
    }
    setFetching(false);
  }, [session]);

  useEffect(() => {
    if (!loading && !session) nav("/afiliados/registro");
  }, [loading, session, nav]);

  useEffect(() => { if (session) load(); }, [session, load]);

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <div className="flex items-center gap-3 text-gray-400"><RefreshCw className="w-4 h-4 animate-spin" /> Cargando...</div>
    </div>
  );

  if (!affiliate) return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <DashHeader onSignOut={signOut} />
      <CreateAffiliate onCreated={load} />
    </div>
  );

  const clicks = referrals.filter(r => r.status === "click").length;
  const signups = referrals.filter(r => r.status === "signup").length;
  const converted = referrals.filter(r => r.status === "converted");
  const earnings = converted.reduce((s, r) => s + ((r.amount ?? 0) * affiliate.commission_rate / 100), 0);

  const refLink = `${window.location.origin}/?ref=${affiliate.code}`;
  const copy = () => { navigator.clipboard.writeText(refLink); setCopied(true); setTimeout(() => setCopied(false), 1800); };

  const stats = [
    { label: "Clicks", value: clicks, icon: MousePointerClick, color: "#0ea5e9" },
    { label: "Registros", value: signups, icon: Users, color: "#6366f1" },
    { label: "Conversiones", value: converted.length, icon: TrendingUp, color: "#10b981" },
    { label: "Comisión estimada", value: `$${earnings.toFixed(2)}`, icon: DollarSign, color: "#f97316" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <DashHeader onSignOut={signOut} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
          <h1 className="text-2xl font-bold text-white">Hola, {affiliate.name.split(" ")[0]} 👋</h1>
          <p className="text-gray-500 text-sm">Tu panel de afiliado</p>
        </motion.div>

        {/* Estado */}
        {affiliate.status === "pending" && (
          <Card className="border-yellow-500/30">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-400 shrink-0" />
              <div><p className="text-white font-semibold text-sm">Solicitud en revisión</p><p className="text-gray-500 text-xs">Tu cuenta está siendo revisada. Te avisaremos por correo cuando sea aprobada. Mientras tanto tu link aún no registra comisiones.</p></div>
            </div>
          </Card>
        )}
        {affiliate.status === "rejected" && (
          <Card className="border-red-500/30"><div className="flex items-center gap-3"><Clock className="w-5 h-5 text-red-400 shrink-0" /><div><p className="text-white font-semibold text-sm">Solicitud no aprobada</p><p className="text-gray-500 text-xs">Contacta a soporte para más información.</p></div></div></Card>
        )}
        {affiliate.status === "suspended" && (
          <Card className="border-gray-500/30"><div className="flex items-center gap-3"><Clock className="w-5 h-5 text-gray-400 shrink-0" /><div><p className="text-white font-semibold text-sm">Cuenta suspendida</p><p className="text-gray-500 text-xs">Contacta a soporte para reactivar tu cuenta.</p></div></div></Card>
        )}
        {affiliate.status === "approved" && (
          <Card className="border-emerald-500/30"><div className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" /><div><p className="text-white font-semibold text-sm">Cuenta activa</p><p className="text-gray-500 text-xs">Tu comisión es del {affiliate.commission_rate}% recurrente. Comparte tu link y empieza a ganar.</p></div></div></Card>
        )}

        {/* Link de referido */}
        <Card>
          <div className="flex items-center gap-2 mb-3"><Wallet className="w-4 h-4 text-orange-400" /><h2 className="text-white font-semibold text-sm">Tu link de referido</h2></div>
          <div className="flex gap-2">
            <input readOnly value={refLink} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm font-mono outline-none" />
            <button onClick={copy} className="px-4 py-2.5 rounded-lg text-sm font-bold text-white flex items-center gap-1.5 hover:opacity-90 shrink-0" style={{ background: copied ? "#10b981" : "#f97316" }}>
              {copied ? <><Check className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar</>}
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-2">Comparte este link. Cada persona que se suscriba con él te genera comisión.</p>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: s.color + "22" }}><s.icon className="w-4 h-4" style={{ color: s.color }} /></div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Referidos recientes */}
        <Card className="p-0 overflow-hidden">
          <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}><span className="text-white font-semibold text-sm">Actividad reciente</span></div>
          {referrals.length > 0 ? (
            <div>
              {referrals.slice(0, 15).map(r => (
                <div key={r.id} className="flex items-center gap-3 px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.status === "converted" ? "#10b981" : r.status === "signup" ? "#6366f1" : "#0ea5e9" }} />
                  <span className="text-white text-sm">{r.status === "converted" ? "Conversión" : r.status === "signup" ? "Registro" : "Click"}</span>
                  {r.country && <span className="text-gray-600 text-xs">{r.country}</span>}
                  <span className="text-gray-600 text-xs ml-auto">{new Date(r.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10"><MousePointerClick className="w-8 h-8 text-gray-700 mx-auto mb-2" /><p className="text-gray-500 text-sm">Aún no hay actividad</p><p className="text-gray-700 text-xs mt-1">Comparte tu link para empezar a ver clicks y referidos</p></div>
          )}
        </Card>
      </div>
    </div>
  );
};

const DashHeader = ({ onSignOut }: { onSignOut: () => void }) => (
  <div className="sticky top-0 z-40 flex items-center justify-between px-5 py-3" style={{ background: "#0d0d0f", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
    <Link to="/" className="flex items-center"><img src="/shadowscale-logo.png" alt="ShadowScale" className="h-12 w-auto" /></Link>
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 hidden sm:inline">Panel de afiliado</span>
      <button onClick={onSignOut} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors"><LogOut className="w-3.5 h-3.5" /> Salir</button>
    </div>
  </div>
);

export default AfiliadoDashboard;
