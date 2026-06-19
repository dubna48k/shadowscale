import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LineChart, Line, Area, AreaChart } from "recharts";
import { supabase, Tool, Category, Plan, ToolStatus, BadgeType, PlanStatus, Affiliate } from "@/lib/supabase";
import { useSiteData } from "@/hooks/useSiteData";
import { useAuth } from "@/hooks/useAuth";
import { sendEmail } from "@/lib/email";
import {
  Plus, Trash2, Pencil, Eye, EyeOff, LogOut, RefreshCw, ExternalLink,
  Upload, Film, ImageIcon, X, LayoutDashboard, Package, FolderOpen,
  CreditCard, Settings, FileText, Users, BarChart2, Globe, ChevronRight,
  TrendingUp, DollarSign, ShieldCheck, Check, Ban, Clock,
} from "lucide-react";

// ─── Shared styles ─────────────────────────────────────────────────────────────
const inputCls = "w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-white/20 transition-colors";
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">{label}</label>
    {children}
  </div>
);
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl p-5 ${className}`} style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
    {children}
  </div>
);
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 28 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

// ─── Login (Supabase Auth) ──────────────────────────────────────────────────────
const LoginScreen = () => {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr("");
    const { error } = await signInWithEmail(email, pw);
    if (error) setErr(error);
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-80 rounded-2xl p-8 flex flex-col gap-3"
        style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.08)" }}>
        <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-12 w-auto mx-auto mb-1" />
        <h1 className="text-white text-lg font-bold text-center">Admin CMS</h1>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} autoFocus required
          className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-white/25 transition-colors" />
        <input type="password" placeholder="Contraseña" value={pw} onChange={e => setPw(e.target.value)} required
          className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-white/25 transition-colors" />
        {err && <p className="text-red-400 text-xs text-center">{err}</p>}
        <button type="submit" disabled={busy} className="w-full py-2.5 rounded-lg font-bold text-white text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
          style={{ background: "#f97316" }}>{busy ? "Entrando..." : "Entrar"}</button>
        <p className="text-[11px] text-gray-600 text-center mt-1">Acceso restringido. Solo administradores.</p>
      </motion.form>
    </div>
  );
};

const NoAccessScreen = ({ onSignOut, email }: { onSignOut: () => void; email?: string | null }) => (
  <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#0a0a0a" }}>
    <div className="max-w-sm w-full rounded-2xl p-8 text-center" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.08)" }}>
      <Ban className="w-10 h-10 text-red-400 mx-auto mb-3" />
      <h1 className="text-white font-bold mb-2">Sin acceso de administrador</h1>
      <p className="text-gray-500 text-sm mb-1">Tu cuenta ({email}) no tiene rol admin.</p>
      <p className="text-gray-600 text-xs mb-5">Pide que te asignen el rol o corre el UPDATE de rol en Supabase.</p>
      <button onClick={onSignOut} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "#f97316" }}>Cerrar sesión</button>
    </div>
  </div>
);

// ─── Status badge ─────────────────────────────────────────────────────────────
const statusColors: Record<string, string> = { active: "#10b981", inactive: "#6b7280", sold_out: "#ef4444", coming_soon: "#f59e0b" };
const statusLabels: Record<string, string> = { active: "Activo", inactive: "Inactivo", sold_out: "Agotado", coming_soon: "Próximo" };
const StatusBadge = ({ status }: { status: string }) => (
  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
    style={{ background: statusColors[status] + "22", color: statusColors[status] }}>
    {statusLabels[status] ?? status}
  </span>
);

// ─── Tool Logo Uploader ───────────────────────────────────────────────────────
const ToolLogoUploader = ({ currentLogoUrl, domain, initial, color, onUploaded }:
  { currentLogoUrl: string | null; domain: string | null; initial: string; color: string; onUploaded: (url: string) => void }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [srcIdx, setSrcIdx] = useState(0);
  const sources = [currentLogoUrl, domain ? `https://logo.clearbit.com/${domain}` : null, domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null].filter(Boolean) as string[];
  useEffect(() => { setSrcIdx(0); }, [currentLogoUrl, domain]);
  const upload = async (file: File) => {
    setUploading(true); setErr("");
    const ext = file.name.split(".").pop() ?? "png";
    const path = `tool-logo-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("media").upload(path, file, { upsert: true });
    if (upErr) { setErr(upErr.message); setUploading(false); return; }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    onUploaded(data.publicUrl); setUploading(false);
  };
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08]">
      <div className="shrink-0">
        {srcIdx < sources.length
          ? <img src={sources[srcIdx]} alt="logo" className="w-14 h-14 rounded-2xl object-contain bg-white p-1.5" onError={() => setSrcIdx(i => i + 1)} />
          : <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white" style={{ background: color }}>{initial}</div>}
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">Logo personalizado</p>
        <div className="flex gap-2">
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white hover:opacity-80 disabled:opacity-50"
            style={{ background: "#f97316" }}>
            <Upload className="w-3 h-3" />{uploading ? "Subiendo..." : "Subir PNG/WebP"}
          </button>
          {currentLogoUrl && <button onClick={() => onUploaded("")} className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white border border-white/10">Quitar</button>}
        </div>
        {err && <p className="text-red-400 text-[10px]">{err}</p>}
        <p className="text-[10px] text-gray-600">{currentLogoUrl ? "Logo personalizado activo" : domain ? `Auto: ${domain}` : "Sin dominio — mostrando inicial"}</p>
      </div>
      <input ref={fileRef} type="file" accept="image/png,image/webp,image/jpeg" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); }} />
    </div>
  );
};

// ─── Tool Row Logo ────────────────────────────────────────────────────────────
const ToolRowLogo = ({ tool }: { tool: Tool }) => {
  const sources = [(tool as any).logo_url, tool.domain ? `https://logo.clearbit.com/${tool.domain}` : null, tool.domain ? `https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64` : null].filter(Boolean) as string[];
  const [idx, setIdx] = useState(0);
  if (idx < sources.length) return <img src={sources[idx]} className="w-7 h-7 rounded-lg bg-white object-contain p-0.5 shrink-0" onError={() => setIdx(i => i + 1)} />;
  return <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: tool.color }}>{tool.initial}</div>;
};

// ─── Overview / Command Center Dashboard ────────────────────────────────────
const OverviewSection = ({ tools, categories, plans, settings }:
  { tools: Tool[]; categories: Category[]; plans: Plan[]; settings: Record<string, string> }) => {

  const [range, setRange] = useState<"today" | "week" | "month">("week");
  const [visits, setVisits] = useState<any[]>([]);
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(true);
  const [loadingAff, setLoadingAff] = useState(true);

  const loadData = async () => {
    setLoadingVisits(true);
    setLoadingAff(true);
    const now = new Date();
    let since: string | null = null;
    if (range === "today") { const d = new Date(now); d.setHours(0,0,0,0); since = d.toISOString(); }
    else if (range === "week") { const d = new Date(now); d.setDate(d.getDate() - 7); since = d.toISOString(); }
    else { const d = new Date(now); d.setDate(d.getDate() - 30); since = d.toISOString(); }

    let qv = supabase.from("analytics_visits").select("*").order("created_at", { ascending: false }).limit(500);
    if (since) qv = qv.gte("created_at", since);

    const [{ data: v }, { data: aff }] = await Promise.all([
      qv,
      supabase.from("affiliates").select("*").order("total_earned", { ascending: false }),
    ]);
    setVisits(v ?? []);
    setAffiliates(aff ?? []);
    setLoadingVisits(false);
    setLoadingAff(false);
  };

  useEffect(() => { loadData(); }, [range]);

  // CMS stats
  const activeTools = tools.filter(t => t.status === "active").length;
  const totalValue = tools.reduce((s, t) => s + (t.individual_price || 0), 0);
  const activePlans = plans.filter(p => p.status === "active").length;
  const highlightedPlan = plans.find(p => (p as any).highlight) ?? plans.find(p => p.status === "active");

  // Affiliate stats
  const approvedAff = affiliates.filter(a => a.status === "approved").length;
  const pendingAff = affiliates.filter(a => a.status === "pending").length;
  const totalCommissions = affiliates.reduce((s, a) => s + (a.total_earned ?? 0), 0);
  const totalClicks = affiliates.reduce((s, a) => s + (a.clicks ?? 0), 0);
  const topAffiliates = affiliates.filter(a => a.status === "approved").slice(0, 5);

  // Analytics computed
  const mobile = visits.filter(v => v.device === "Móvil").length;
  const countriesRaw = visits.reduce((acc: Record<string, { count: number; code: string }>, v) => {
    if (v.country) { if (!acc[v.country]) acc[v.country] = { count: 0, code: v.country_code ?? "" }; acc[v.country].count++; }
    return acc;
  }, {});
  const countries = Object.entries(countriesRaw).sort((a, b) => b[1].count - a[1].count);
  const maxCountry = countries[0]?.[1].count ?? 1;

  const chartData = (() => {
    const n = range === "today" ? 24 : range === "week" ? 7 : 30;
    if (range === "today") {
      const hours: Record<string, number> = {};
      for (let h = 0; h < 24; h++) hours[`${h.toString().padStart(2,"0")}h`] = 0;
      visits.forEach(v => { const h = new Date(v.created_at).getHours(); hours[`${h.toString().padStart(2,"0")}h`]++; });
      return Object.entries(hours).map(([label, count]) => ({ label, count }));
    }
    const days: Record<string, number> = {};
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("es-CO", { month: "short", day: "numeric" });
      days[key] = 0;
    }
    visits.forEach(v => {
      const key = new Date(v.created_at).toLocaleDateString("es-CO", { month: "short", day: "numeric" });
      if (key in days) days[key]++;
    });
    return Object.entries(days).map(([label, count]) => ({ label, count }));
  })();

  const rangeLabel = range === "today" ? "HOY" : range === "week" ? "7D" : "30D";
  const loading = loadingVisits || loadingAff;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm">shadowscale.pro · Centro de mando</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#0e0e10", border: "1px solid rgba(255,255,255,0.07)" }}>
            {(["today", "week", "month"] as const).map(r => (
              <button key={r} onClick={() => setRange(r)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={range === r ? { background: "#f97316", color: "#fff" } : { color: "#6b7280" }}>
                {r === "today" ? "Hoy" : r === "week" ? "7 días" : "30 días"}
              </button>
            ))}
          </div>
          <button onClick={loadData} className="p-2 rounded-xl border border-white/[0.08] text-gray-500 hover:text-white transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI Row 1 — Tráfico */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Visitas", value: loadingVisits ? "…" : visits.length, sub: rangeLabel, color: "#f97316", icon: TrendingUp },
          { label: "Países únicos", value: loadingVisits ? "…" : countries.length, sub: "geo", color: "#0ea5e9", icon: Globe },
          { label: "Tráfico móvil", value: loadingVisits ? "…" : (visits.length ? `${Math.round(mobile / visits.length * 100)}%` : "0%"), sub: "del total", color: "#10b981", icon: BarChart2 },
          { label: "Herramientas", value: `${activeTools}/${tools.length}`, sub: `$${totalValue.toLocaleString()} valor`, color: "#8b5cf6", icon: Package },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "#0e0e10", border: `1px solid ${s.color}22` }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at top left, ${s.color}14, transparent 65%)` }} />
              <div className="relative flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}20` }}>
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: `${s.color}15`, color: s.color }}>{s.sub}</span>
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* KPI Row 2 — Afiliados */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Afiliados activos", value: loadingAff ? "…" : approvedAff, sub: pendingAff > 0 ? `${pendingAff} pendientes` : "aprobados", color: "#f59e0b", icon: Users, alert: pendingAff > 0 },
          { label: "Comisiones totales", value: loadingAff ? "…" : `$${totalCommissions.toFixed(2)}`, sub: "pagado a afiliados", color: "#10b981", icon: DollarSign },
          { label: "Clicks de referido", value: loadingAff ? "…" : totalClicks, sub: "total histórico", color: "#6366f1", icon: TrendingUp },
          { label: "Planes activos", value: activePlans, sub: highlightedPlan ? `Popular: ${highlightedPlan.name}` : `de ${plans.length} totales`, color: "#ec4899", icon: CreditCard },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
            <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "#0e0e10", border: `1px solid ${s.color}22` }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at top left, ${s.color}14, transparent 65%)` }} />
              <div className="relative flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}20` }}>
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: `${s.color}15`, color: s.color }}>
                    {(s as any).alert ? <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />{s.sub}</span> : s.sub}
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Traffic chart + Geo */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        <motion.div className="lg:col-span-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="rounded-2xl p-5" style={{ background: "#0e0e10", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span className="text-white font-semibold text-sm">Tráfico en el tiempo</span>
              <span className="ml-auto text-[11px] text-gray-600 font-mono">{range === "today" ? "Por hora" : range === "week" ? "7 días" : "30 días"}</span>
            </div>
            <div style={{ height: 170 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                  <defs>
                    <linearGradient id="ovGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} interval={range === "today" ? 3 : 0} />
                  <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "#1a1a1f", border: "1px solid rgba(249,115,22,0.25)", borderRadius: 10, color: "#fff", fontSize: 12, padding: "8px 12px" }}
                    cursor={{ stroke: "rgba(249,115,22,0.15)", strokeWidth: 1 }} formatter={(v: any) => [`${v} visitas`, ""]} />
                  <Area type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2.5} fill="url(#ovGrad)" dot={false}
                    activeDot={{ r: 5, fill: "#f97316", stroke: "#0e0e10", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="rounded-2xl p-5 h-full" style={{ background: "#0e0e10", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-semibold text-sm">Geolocalización</span>
              {countries.length > 0 && <span className="ml-auto text-[11px] text-cyan-400 font-mono bg-cyan-400/10 px-2 py-0.5 rounded-full">{countries.length} países</span>}
            </div>
            {loadingVisits ? (
              <div className="flex items-center justify-center py-8"><RefreshCw className="w-4 h-4 text-gray-600 animate-spin" /></div>
            ) : countries.length === 0 ? (
              <div className="py-8 text-center"><p className="text-gray-700 text-xs">Sin datos de geo aún</p><p className="text-gray-800 text-[10px] mt-1">Se registran al visitar el sitio</p></div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {countries.slice(0, 6).map(([name, { count, code }], i) => {
                  const pct = Math.round(count / visits.length * 100);
                  const colors = ["#f97316","#0ea5e9","#10b981","#8b5cf6","#ec4899","#f59e0b"];
                  return (
                    <motion.div key={name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-2.5">
                      <span className="text-xl shrink-0">{flagEmoji(code)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-xs font-medium truncate">{name}</span>
                          <span className="text-xs font-bold ml-1 shrink-0" style={{ color: colors[i % colors.length] }}>{pct}%</span>
                        </div>
                        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                          <motion.div className="h-full rounded-full"
                            initial={{ width: 0 }} animate={{ width: `${(count / maxCountry) * 100}%` }}
                            transition={{ delay: i * 0.05 + 0.15, type: "spring", stiffness: 80, damping: 18 }}
                            style={{ background: colors[i % colors.length], boxShadow: `0 0 6px ${colors[i % colors.length]}60` }} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Affiliates top + Plans + Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* Top Affiliates */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
          <div className="rounded-2xl overflow-hidden h-full" style={{ background: "#0e0e10", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold text-sm">Top afiliados</span>
              </div>
              {pendingAff > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-400/15 text-yellow-400">{pendingAff} pendientes</span>
              )}
            </div>
            {loadingAff ? (
              <div className="flex items-center justify-center py-8"><RefreshCw className="w-4 h-4 text-gray-600 animate-spin" /></div>
            ) : topAffiliates.length === 0 ? (
              <div className="py-8 text-center"><p className="text-gray-700 text-xs">Sin afiliados aprobados aún</p></div>
            ) : (
              <div>
                {topAffiliates.map((a, idx) => (
                  <div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors"
                    style={{ borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: `hsl(${idx * 55 + 30}, 70%, 50%)22`, color: `hsl(${idx * 55 + 30}, 70%, 65%)` }}>
                      {(a.name ?? a.email ?? "?")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs font-medium truncate">{a.name ?? a.email}</div>
                      <div className="text-gray-600 text-[10px] font-mono">{a.clicks ?? 0} clicks · {a.conversions ?? 0} conv.</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-green-400 text-xs font-bold font-mono">${(a.total_earned ?? 0).toFixed(2)}</div>
                      <div className="text-[10px] text-gray-600">{(a.commission_rate ?? 0) * 100}% comis.</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Plans */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
          <div className="rounded-2xl overflow-hidden h-full" style={{ background: "#0e0e10", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <CreditCard className="w-4 h-4 text-pink-400" />
              <span className="text-white font-semibold text-sm">Planes</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {plans.length === 0 ? (
                <p className="text-gray-700 text-xs text-center py-4">Sin planes configurados</p>
              ) : plans.map((p, i) => {
                const isHighlight = (p as any).highlight;
                const price = (p as any).price ?? (p as any).price_monthly ?? 0;
                const priceAnnual = (p as any).price_annual;
                return (
                  <div key={p.id} className="rounded-xl p-3.5"
                    style={{ background: isHighlight ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.03)", border: isHighlight ? "1px solid rgba(249,115,22,0.25)" : "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-xs font-bold">{p.name}</span>
                          {isHighlight && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500 text-white shrink-0">Popular</span>}
                        </div>
                        <div className="text-gray-500 text-[10px] mt-0.5 line-clamp-1">{(p as any).description ?? "—"}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-orange-400 font-bold text-sm">${price}<span className="text-gray-600 text-[10px] font-normal">/mes</span></div>
                        {priceAnnual && <div className="text-gray-600 text-[10px]">${priceAnnual}/año</div>}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: p.status === "active" ? "rgba(16,185,129,0.15)" : "rgba(107,114,128,0.15)", color: p.status === "active" ? "#10b981" : "#6b7280" }}>
                        {p.status === "active" ? "Activo" : "Inactivo"}
                      </span>
                      {p.badge && <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-400/15 text-blue-400">{p.badge}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Recent sessions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="rounded-2xl overflow-hidden h-full" style={{ background: "#0e0e10", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-white font-semibold text-sm">Sesiones recientes</span>
              <span className="text-[11px] text-gray-600 font-mono">{visits.length}</span>
            </div>
            {loadingVisits ? (
              <div className="flex items-center justify-center py-8"><RefreshCw className="w-4 h-4 text-gray-600 animate-spin" /></div>
            ) : visits.length === 0 ? (
              <div className="py-8 text-center"><BarChart2 className="w-7 h-7 text-gray-800 mx-auto mb-2" /><p className="text-gray-700 text-xs">Sin visitas</p></div>
            ) : (
              <div>
                {visits.slice(0, 7).map((v, idx) => (
                  <div key={v.id} className="flex items-center gap-2.5 px-5 py-2.5 hover:bg-white/[0.02] transition-colors"
                    style={{ borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                    <span className="text-lg shrink-0">{flagEmoji(v.country_code)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs font-medium truncate">{[v.city, v.country].filter(Boolean).join(", ") || "Desconocido"}</div>
                      <div className="text-gray-600 text-[10px]">{v.device ?? "Desktop"}</div>
                    </div>
                    <div className="text-right shrink-0">
                      {v.ip && <div className="font-mono text-[10px] text-orange-300/70 bg-orange-400/10 px-1.5 py-0.5 rounded mb-0.5">{v.ip}</div>}
                      <div className="text-gray-700 text-[10px]">{new Date(v.created_at).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <a href="/" target="_blank" className="flex items-center gap-2 justify-center text-xs text-gray-600 hover:text-gray-300 transition-colors">
                <ExternalLink className="w-3 h-3" /> Ver sitio público
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ─── Tools Section ────────────────────────────────────────────────────────────
const ToolsSection = ({ tools, categories, onRefresh }: { tools: Tool[]; categories: Category[]; onRefresh: () => void }) => {
  const [editing, setEditing] = useState<Partial<Tool> | null>(null);
  const [saving, setSaving] = useState(false);
  const blank: Partial<Tool> = { name: "", category_id: categories[0]?.id ?? "", color: "#6366f1", initial: "", domain: "", badge: null, note: "", individual_price: 0, status: "active", sort_order: 99 };
  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = { ...editing };
    if (!payload.domain) payload.domain = null;
    if (!payload.note) payload.note = null;
    if (!(payload as any).logo_url) (payload as any).logo_url = null;
    if (payload.id) await supabase.from("tools").update(payload).eq("id", payload.id);
    else await supabase.from("tools").insert(payload);
    setSaving(false); setEditing(null); onRefresh();
  };
  const remove = async (id: string) => { if (!confirm("¿Eliminar esta herramienta?")) return; await supabase.from("tools").delete().eq("id", id); onRefresh(); };
  const toggleStatus = async (tool: Tool) => { const next: ToolStatus = tool.status === "active" ? "inactive" : "active"; await supabase.from("tools").update({ status: next }).eq("id", tool.id); onRefresh(); };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Herramientas</h1><p className="text-gray-500 text-sm">{tools.length} herramientas configuradas</p></div>
        <button onClick={() => setEditing(blank)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ background: "#f97316" }}>
          <Plus className="w-4 h-4" /> Nueva herramienta
        </button>
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
            style={{ background: "#1a1a1c", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h3 className="text-white font-bold text-lg">{editing.id ? "Editar herramienta" : "Nueva herramienta"}</h3>
            <ToolLogoUploader currentLogoUrl={(editing as any).logo_url ?? null} domain={editing.domain ?? null} initial={editing.initial ?? "?"} color={editing.color ?? "#6366f1"} onUploaded={url => setEditing(v => ({ ...v, logo_url: url } as any))} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre"><input className={inputCls} value={editing.name ?? ""} onChange={e => setEditing(v => ({ ...v, name: e.target.value }))} /></Field>
              <Field label="Inicial (fallback logo)"><input className={inputCls} maxLength={2} value={editing.initial ?? ""} onChange={e => setEditing(v => ({ ...v, initial: e.target.value.toUpperCase() }))} /></Field>
              <Field label="Dominio (para logo automático)"><input className={inputCls} placeholder="openai.com" value={editing.domain ?? ""} onChange={e => setEditing(v => ({ ...v, domain: e.target.value }))} /></Field>
              <Field label="Color">
                <div className="flex gap-2">
                  <input type="color" value={editing.color ?? "#6366f1"} onChange={e => setEditing(v => ({ ...v, color: e.target.value }))} className="w-10 h-9 rounded cursor-pointer border-0 bg-transparent" />
                  <input className={inputCls} value={editing.color ?? ""} onChange={e => setEditing(v => ({ ...v, color: e.target.value }))} />
                </div>
              </Field>
              <Field label="Categoría">
                <select className={inputCls} value={editing.category_id ?? ""} onChange={e => setEditing(v => ({ ...v, category_id: e.target.value }))}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </Field>
              <Field label="Estado">
                <select className={inputCls} value={editing.status ?? "active"} onChange={e => setEditing(v => ({ ...v, status: e.target.value as ToolStatus }))}>
                  <option value="active">Activo</option><option value="inactive">Inactivo</option><option value="sold_out">Agotado</option><option value="coming_soon">Próximamente</option>
                </select>
              </Field>
              <Field label="Precio individual ($)"><input type="number" className={inputCls} value={editing.individual_price ?? 0} onChange={e => setEditing(v => ({ ...v, individual_price: Number(e.target.value) }))} /></Field>
              <Field label="Badge">
                <select className={inputCls} value={editing.badge ?? ""} onChange={e => setEditing(v => ({ ...v, badge: (e.target.value || null) as BadgeType }))}>
                  <option value="">Sin badge</option><option value="nuevo">Nuevo</option><option value="prueba">Prueba</option>
                </select>
              </Field>
            </div>
            <Field label="Nota de acceso (ticker en card)"><input className={inputCls} placeholder="Solo modelos ILIMITADOS · Sin límites" value={editing.note ?? ""} onChange={e => setEditing(v => ({ ...v, note: e.target.value }))} /></Field>
            <Field label="Orden (número menor = primero)"><input type="number" className={inputCls} value={editing.sort_order ?? 99} onChange={e => setEditing(v => ({ ...v, sort_order: Number(e.target.value) }))} /></Field>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white">Cancelar</button>
              <button onClick={save} disabled={saving} className="px-5 py-2 rounded-lg text-sm font-bold text-white hover:opacity-90 disabled:opacity-50" style={{ background: "#f97316" }}>{saving ? "Guardando..." : "Guardar"}</button>
            </div>
          </motion.div>
        </div>
      )}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-[11px] uppercase" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <th className="px-5 py-3">Herramienta</th><th className="px-3 py-3">Categoría</th><th className="px-3 py-3">Precio</th><th className="px-3 py-3">Estado</th><th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {tools.map(t => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <ToolRowLogo tool={t} />
                      <span className="text-white font-medium">{t.name}</span>
                      {t.badge && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: t.badge === "nuevo" ? "#f97316" : "#7c3aed", color: "#fff" }}>{t.badge.toUpperCase()}</span>}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-400">{categories.find(c => c.id === t.category_id)?.label ?? "—"}</td>
                  <td className="px-3 py-3 text-white font-mono">${t.individual_price}</td>
                  <td className="px-3 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button onClick={() => toggleStatus(t)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.05] transition-colors">{t.status === "active" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                      <button onClick={() => setEditing(t)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.05] transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => remove(t.id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/[0.05] transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ─── Categories Section ───────────────────────────────────────────────────────
const CategoriesSection = ({ categories, onRefresh }: { categories: Category[]; onRefresh: () => void }) => {
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const add = async () => { if (!label.trim()) return; const id = label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""); await supabase.from("categories").insert({ id, label: label.trim(), sort_order: categories.length + 1 }); setLabel(""); setAdding(false); onRefresh(); };
  const rename = async (cat: Category, newLabel: string) => { await supabase.from("categories").update({ label: newLabel }).eq("id", cat.id); onRefresh(); };
  const remove = async (id: string) => { if (!confirm("¿Eliminar categoría?")) return; await supabase.from("categories").delete().eq("id", id); onRefresh(); };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Categorías</h1><p className="text-gray-500 text-sm">{categories.length} categorías</p></div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ background: "#f97316" }}><Plus className="w-4 h-4" /> Nueva</button>
      </div>
      <Card>
        <div className="flex flex-col gap-2">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-3 group">
              <span className="text-[11px] text-gray-600 font-mono w-6 text-right">{cat.sort_order}</span>
              <input defaultValue={cat.label} onBlur={e => { if (e.target.value !== cat.label) rename(cat, e.target.value); }} className="flex-1 bg-transparent border border-transparent focus:border-white/10 rounded-lg px-3 py-1.5 text-white text-sm outline-none transition-colors" />
              <button onClick={() => remove(cat.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
          {adding && (
            <div className="flex gap-2 mt-1">
              <input autoFocus className={inputCls} placeholder="Nombre de categoría" value={label} onChange={e => setLabel(e.target.value)} onKeyDown={e => { if (e.key === "Enter") add(); if (e.key === "Escape") setAdding(false); }} />
              <button onClick={add} className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: "#f97316" }}>Agregar</button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// ─── Plans Section ────────────────────────────────────────────────────────────
const PlansSection = ({ plans, onRefresh }: { plans: Plan[]; onRefresh: () => void }) => {
  const [editing, setEditing] = useState<Partial<Plan> | null>(null);
  const [saving, setSaving] = useState(false);
  const blank: Partial<Plan> = { name: "", price: 0, status: "active", features: [""], highlight: false, cta_text: "Comenzar ahora", cta_link: "https://app.shadowscale.pro/register", sort_order: 99 };
  const save = async () => { if (!editing) return; setSaving(true); if (editing.id) await supabase.from("plans").update(editing).eq("id", editing.id); else await supabase.from("plans").insert(editing); setSaving(false); setEditing(null); onRefresh(); };
  const remove = async (id: string) => { if (!confirm("¿Eliminar plan?")) return; await supabase.from("plans").delete().eq("id", id); onRefresh(); };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Planes y Precios</h1><p className="text-gray-500 text-sm">{plans.length} planes configurados</p></div>
        <button onClick={() => setEditing(blank)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ background: "#f97316" }}><Plus className="w-4 h-4" /> Nuevo plan</button>
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto" style={{ background: "#1a1a1c", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h3 className="text-white font-bold text-lg">{editing.id ? "Editar plan" : "Nuevo plan"}</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre"><input className={inputCls} value={editing.name ?? ""} onChange={e => setEditing(v => ({ ...v, name: e.target.value }))} /></Field>
              <Field label="Precio ($/mes)"><input type="number" className={inputCls} value={editing.price ?? 0} onChange={e => setEditing(v => ({ ...v, price: Number(e.target.value) }))} /></Field>
              <Field label="Estado"><select className={inputCls} value={editing.status ?? "active"} onChange={e => setEditing(v => ({ ...v, status: e.target.value as PlanStatus }))}><option value="active">Activo</option><option value="inactive">Inactivo</option><option value="sold_out">Agotado</option></select></Field>
              <Field label="Destacado"><select className={inputCls} value={editing.highlight ? "1" : "0"} onChange={e => setEditing(v => ({ ...v, highlight: e.target.value === "1" }))}><option value="0">No</option><option value="1">Sí</option></select></Field>
              <Field label="Texto del botón"><input className={inputCls} value={editing.cta_text ?? ""} onChange={e => setEditing(v => ({ ...v, cta_text: e.target.value }))} /></Field>
              <Field label="Link del botón"><input className={inputCls} value={editing.cta_link ?? ""} onChange={e => setEditing(v => ({ ...v, cta_link: e.target.value }))} /></Field>
            </div>
            <Field label="Features (una por línea)"><textarea rows={5} className={inputCls} value={(editing.features ?? []).join("\n")} onChange={e => setEditing(v => ({ ...v, features: e.target.value.split("\n") }))} /></Field>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white">Cancelar</button>
              <button onClick={save} disabled={saving} className="px-5 py-2 rounded-lg text-sm font-bold text-white hover:opacity-90 disabled:opacity-50" style={{ background: "#f97316" }}>{saving ? "Guardando..." : "Guardar"}</button>
            </div>
          </motion.div>
        </div>
      )}
      <div className="grid sm:grid-cols-3 gap-3">
        {plans.map(p => (
          <Card key={p.id} className={p.highlight ? "border-orange-500/30" : ""}>
            <div className="flex items-start justify-between mb-3"><div><h3 className="text-white font-bold">{p.name}</h3><span className="text-2xl font-bold text-white">${p.price}<span className="text-sm font-normal text-gray-400">/mes</span></span></div><StatusBadge status={p.status} /></div>
            <ul className="text-xs text-gray-400 flex flex-col gap-1 mb-4">{p.features.map((f, i) => <li key={i}>• {f}</li>)}</ul>
            <div className="flex gap-1.5 pt-3 border-t border-white/[0.05]">
              <button onClick={() => setEditing(p)} className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white hover:opacity-80" style={{ background: "#f97316" }}>Editar</button>
              <button onClick={() => remove(p.id)} className="py-1.5 px-3 rounded-lg text-xs text-gray-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── Media Section ────────────────────────────────────────────────────────────
type MediaKey = "browser_video_url" | "browser_image_url";
const MediaUploader = ({ label, icon: Icon, settingKey, accept, currentUrl, onUploaded }:
  { label: string; icon: React.ElementType; settingKey: MediaKey; accept: string; currentUrl: string; onUploaded: (url: string) => void }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const upload = async (file: File) => { setUploading(true); setError(""); const ext = file.name.split(".").pop(); const path = `${settingKey}-${Date.now()}.${ext}`; const { error: upErr } = await supabase.storage.from("media").upload(path, file, { upsert: true }); if (upErr) { setError(upErr.message); setUploading(false); return; } const { data } = supabase.storage.from("media").getPublicUrl(path); await supabase.from("site_settings").upsert({ key: settingKey, value: data.publicUrl }, { onConflict: "key" }); onUploaded(data.publicUrl); setUploading(false); };
  const remove = async () => { await supabase.from("site_settings").upsert({ key: settingKey, value: "" }, { onConflict: "key" }); onUploaded(""); };
  const isVideo = accept.includes("video");
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] text-gray-500 font-medium uppercase tracking-wide flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" /> {label}</label>
      {currentUrl ? (
        <div className="relative rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/[0.08]">
          {isVideo ? <video src={currentUrl} controls muted className="w-full max-h-40 object-contain" /> : <img src={currentUrl} alt={label} className="w-full max-h-40 object-contain" />}
          <button onClick={remove} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-red-400"><X className="w-3.5 h-3.5" /></button>
          <div className="px-3 py-1.5 text-[10px] text-gray-500 truncate">{currentUrl}</div>
        </div>
      ) : (
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed disabled:opacity-50" style={{ borderColor: "rgba(255,255,255,0.1)", background: "#0a0a0a" }}>
          {uploading ? <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" /> : <Upload className="w-5 h-5 text-gray-500" />}
          <span className="text-[12px] text-gray-500">{uploading ? "Subiendo..." : `Seleccionar ${isVideo ? "video" : "imagen"}`}</span>
        </button>
      )}
      {error && <p className="text-red-400 text-[11px]">{error}</p>}
      <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); }} />
    </div>
  );
};
const MediaSection = ({ settings, onRefresh }: { settings: Record<string, string>; onRefresh: () => void }) => {
  const [videoUrl, setVideoUrl] = useState(settings["browser_video_url"] ?? "");
  const [imageUrl, setImageUrl] = useState(settings["browser_image_url"] ?? "");
  useEffect(() => { setVideoUrl(settings["browser_video_url"] ?? ""); setImageUrl(settings["browser_image_url"] ?? ""); }, [settings]);
  const handleUploaded = (key: MediaKey, url: string) => { if (key === "browser_video_url") setVideoUrl(url); else setImageUrl(url); onRefresh(); };
  return (
    <div className="flex flex-col gap-5">
      <div><h1 className="text-xl font-bold text-white">Media</h1><p className="text-gray-500 text-sm">Video e imagen para la sección del browser</p></div>
      <Card>
        <div className="grid sm:grid-cols-2 gap-5">
          <MediaUploader label="Video del Browser (MP4/WebM)" icon={Film} settingKey="browser_video_url" accept="video/mp4,video/webm" currentUrl={videoUrl} onUploaded={url => handleUploaded("browser_video_url", url)} />
          <MediaUploader label="Imagen del Browser (JPG/PNG/WebP)" icon={ImageIcon} settingKey="browser_image_url" accept="image/jpeg,image/png,image/webp,image/gif" currentUrl={imageUrl} onUploaded={url => handleUploaded("browser_image_url", url)} />
        </div>
        <p className="text-[11px] text-gray-600 mt-4">El video tiene prioridad sobre la imagen. Tamaño máximo: 50MB.</p>
      </Card>
    </div>
  );
};

// ─── Settings Section ─────────────────────────────────────────────────────────
const SettingsSection = ({ settings, onRefresh }: { settings: Record<string, string>; onRefresh: () => void }) => {
  const [vals, setVals] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState(false);
  useEffect(() => { setVals(settings); }, [settings]);
  const save = async () => { setSaving(true); await Promise.all(Object.entries(vals).map(([key, value]) => supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" }))); setSaving(false); onRefresh(); };
  const s = (key: string) => ({ value: vals[key] ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setVals(v => ({ ...v, [key]: e.target.value })) });
  return (
    <div className="flex flex-col gap-5">
      <div><h1 className="text-xl font-bold text-white">Configuración del Sitio</h1><p className="text-gray-500 text-sm">Textos, links y opciones globales</p></div>
      <Card><h2 className="text-white font-semibold text-sm mb-4">Banner superior</h2><div className="grid sm:grid-cols-2 gap-4"><Field label="Texto"><input className={inputCls} {...s("banner_text")} /></Field><Field label="Link"><input className={inputCls} {...s("banner_link")} /></Field><Field label="Visible"><select className={inputCls} {...s("banner_visible")}><option value="true">Sí</option><option value="false">No</option></select></Field></div></Card>
      <Card><h2 className="text-white font-semibold text-sm mb-4">CTA Principal</h2><div className="grid sm:grid-cols-2 gap-4"><Field label="Texto"><input className={inputCls} {...s("cta_text")} /></Field><Field label="Link"><input className={inputCls} {...s("cta_link")} /></Field></div></Card>
      <Card>
        <h2 className="text-white font-semibold text-sm mb-4">Menú de navegación</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Enlace 1 — Texto"><input className={inputCls} {...s("nav_1_label")} placeholder="Herramientas" /></Field>
          <Field label="Enlace 1 — URL"><input className={inputCls} {...s("nav_1_href")} placeholder="#herramientas" /></Field>
          <Field label="Enlace 2 — Texto"><input className={inputCls} {...s("nav_2_label")} placeholder="Afiliados" /></Field>
          <Field label="Enlace 2 — URL"><input className={inputCls} {...s("nav_2_href")} placeholder="/afiliados" /></Field>
          <Field label="Enlace 3 — Texto"><input className={inputCls} {...s("nav_3_label")} placeholder="Precios" /></Field>
          <Field label="Enlace 3 — URL"><input className={inputCls} {...s("nav_3_href")} placeholder="#pricing" /></Field>
        </div>
      </Card>
      <Card>
        <h2 className="text-white font-semibold text-sm mb-4">Footer</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Link 1 — Texto"><input className={inputCls} {...s("footer_link_1_label")} placeholder="Términos y Condiciones" /></Field>
          <Field label="Link 1 — URL"><input className={inputCls} {...s("footer_link_1_href")} placeholder="/terminos" /></Field>
          <Field label="Link 2 — Texto"><input className={inputCls} {...s("footer_link_2_label")} placeholder="Política de Privacidad" /></Field>
          <Field label="Link 2 — URL"><input className={inputCls} {...s("footer_link_2_href")} placeholder="/politica" /></Field>
          <Field label="Link 3 — Texto"><input className={inputCls} {...s("footer_link_3_label")} placeholder="Soporte" /></Field>
          <Field label="Link 3 — URL"><input className={inputCls} {...s("footer_link_3_href")} placeholder="/soporte" /></Field>
          <Field label="Link 4 — Texto"><input className={inputCls} {...s("footer_link_4_label")} placeholder="Afiliados" /></Field>
          <Field label="Link 4 — URL"><input className={inputCls} {...s("footer_link_4_href")} placeholder="/afiliados" /></Field>
          <Field label="Copyright"><input className={inputCls} {...s("footer_copyright")} /></Field>
        </div>
      </Card>
      <Card><h2 className="text-white font-semibold text-sm mb-4">Sección Herramientas</h2><div className="grid sm:grid-cols-2 gap-4"><Field label="Título"><input className={inputCls} {...s("tools_title")} /></Field><Field label="Subtítulo"><input className={inputCls} {...s("tools_subtitle")} /></Field></div></Card>
      <Card><h2 className="text-white font-semibold text-sm mb-4">Sección Browser</h2><div className="grid sm:grid-cols-2 gap-4"><Field label="Título"><input className={inputCls} {...s("browser_title")} /></Field><Field label="Descripción"><textarea className={inputCls} {...s("browser_desc")} rows={2} /></Field><Field label="Texto botón"><input className={inputCls} {...s("browser_download_text")} /></Field><Field label="Link descarga"><input className={inputCls} {...s("browser_download_link")} /></Field></div></Card>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-sm">Ventas / Checkout</h2>
          <a href="/checkout" target="_blank" className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"><ExternalLink className="w-3 h-3" /> Ver /checkout</a>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Checkout activo">
            <select className={inputCls} {...s("checkout_enabled")}>
              <option value="true">Activado</option>
              <option value="false">Desactivado (próximamente)</option>
            </select>
          </Field>
          <Field label="Pasarela de pago">
            <select className={inputCls} {...s("checkout_provider")}>
              <option value="none">Sin pasarela</option>
              <option value="efipay">Efipay 🇨🇴</option>
              <option value="whop">Whop</option>
              <option value="stripe">Stripe (links por plan)</option>
            </select>
          </Field>
          <Field label="URL de Whop (global)"><input className={inputCls} placeholder="https://whop.com/shadowscale" {...s("checkout_whop_url")} /></Field>
          <Field label="Stripe — URL plan Starter"><input className={inputCls} placeholder="https://buy.stripe.com/..." {...s("checkout_stripe_url_starter")} /></Field>
          <Field label="Stripe — URL plan Pro"><input className={inputCls} placeholder="https://buy.stripe.com/..." {...s("checkout_stripe_url_pro")} /></Field>
          <Field label="Stripe — URL plan Elite"><input className={inputCls} placeholder="https://buy.stripe.com/..." {...s("checkout_stripe_url_elite")} /></Field>
          <Field label="Efipay — API Key"><input className={inputCls} placeholder="965|xxxxxxxx... (test o producción)" {...s("efipay_api_key")} /></Field>
          <Field label="Efipay — Branch ID (sucursal)"><input className={inputCls} placeholder="Ej: 12 — Panel Efipay → Sucursales → ID" {...s("efipay_branch_id")} /></Field>
          <Field label="Efipay — Moneda"><input className={inputCls} placeholder="COP" {...s("efipay_currency")} /></Field>
          <Field label="Efipay — URL éxito"><input className={inputCls} placeholder="https://shadowscale.pro/gracias" {...s("efipay_success_url")} /></Field>
          <Field label="Efipay — URL pendiente"><input className={inputCls} placeholder="https://shadowscale.pro/pago-pendiente" {...s("efipay_pending_url")} /></Field>
          <Field label="Efipay — URL rechazado"><input className={inputCls} placeholder="https://shadowscale.pro/pago-rechazado" {...s("efipay_rejected_url")} /></Field>
          <Field label="Texto &quot;próximamente&quot;"><input className={inputCls} placeholder="Estamos configurando el sistema de pago..." {...s("checkout_coming_soon_text")} /></Field>
        </div>

        <h3 className="text-white text-sm font-semibold mt-4 mb-1">Página de Gracias</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="WhatsApp — Número (solo dígitos, con código de país)"><input className={inputCls} placeholder="573001234567" {...s("gracias_wpp_number")} /></Field>
          <Field label="WhatsApp — Mensaje pre-escrito"><input className={inputCls} placeholder="¡Hola! Acabo de suscribirme a ShadowScale..." {...s("gracias_wpp_message")} /></Field>
        </div>

        <div className="mt-4 p-3 rounded-xl text-xs text-gray-500 flex gap-2" style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.05)" }}>
          <span className="text-orange-500 shrink-0">🔑</span>
          <span>Los secrets de Efipay (<code className="text-gray-400">EFIPAY_API_KEY</code>, <code className="text-gray-400">EFIPAY_BRANCH_ID</code>) van en Supabase → Edge Functions → Secrets — nunca en el CMS.</span>
        </div>
        <p className="text-xs text-gray-600 mt-2">Los planes con &quot;Enlace CTA&quot; propio (en la sección Planes) tienen prioridad sobre la pasarela configurada.</p>
      </Card>
      {/* Pricing social proof */}
      <Card>
        <h2 className="text-white font-semibold text-sm mb-4">Sección Precios — Prueba Social</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Miembros activos (ej: '500+')"><input className={inputCls} {...s("pricing_members_count")} placeholder="500+" /></Field>
          <Field label="Ahorro mensual (ej: '$200')"><input className={inputCls} {...s("pricing_savings")} placeholder="$200" /></Field>
          <Field label="Valor total herramientas (ej: '$2,000')"><input className={inputCls} {...s("pricing_tools_value")} placeholder="$2,000" /></Field>
          <Field label="Mostrar banner"><select className={inputCls} {...s("pricing_show_social_proof")}><option value="true">Sí</option><option value="false">No</option></select></Field>
        </div>
      </Card>

      {/* Pricing FAQ */}
      <Card>
        <h2 className="text-white font-semibold text-sm mb-4">Preguntas frecuentes — Precios</h2>
        <div className="flex flex-col gap-5">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className="flex flex-col gap-2">
              <Field label={`Pregunta ${n}`}><input className={inputCls} {...s(`pricing_faq${n}_q`)} /></Field>
              <Field label={`Respuesta ${n}`}><textarea className={inputCls} rows={2} {...s(`pricing_faq${n}_a`)} /></Field>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="px-8 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-50" style={{ background: "#f97316" }}>{saving ? "Guardando..." : "Guardar todo"}</button>
      </div>
    </div>
  );
};

// ─── Pages Section ────────────────────────────────────────────────────────────
const PagesSection = ({ settings, onRefresh }: { settings: Record<string, string>; onRefresh: () => void }) => {
  const [vals, setVals] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"terminos" | "politica" | "soporte">("terminos");
  useEffect(() => { setVals(settings); }, [settings]);
  const save = async () => {
    setSaving(true);
    const keys = ["page_terminos_content", "page_politica_content", "soporte_email", "soporte_whatsapp", "soporte_discord", "soporte_horario"];
    await Promise.all(keys.map(key => supabase.from("site_settings").upsert({ key, value: vals[key] ?? "" }, { onConflict: "key" })));
    setSaving(false); onRefresh();
  };
  const s = (key: string) => ({ value: vals[key] ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setVals(v => ({ ...v, [key]: e.target.value })) });
  const tabs = [{ id: "terminos", label: "Términos", href: "/terminos" }, { id: "politica", label: "Privacidad", href: "/politica" }, { id: "soporte", label: "Soporte", href: "/soporte" }] as const;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Páginas</h1><p className="text-gray-500 text-sm">Edita el contenido de las páginas estáticas</p></div>
        <a href={tabs.find(t => t.id === tab)?.href} target="_blank" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white border border-white/[0.08]"><ExternalLink className="w-3.5 h-3.5" /> Ver</a>
      </div>
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
        {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} className="px-5 py-2 rounded-lg text-sm font-medium transition-all" style={tab === t.id ? { background: "#f97316", color: "#fff" } : { color: "#9ca3af" }}>{t.label}</button>)}
      </div>
      <Card>
        {tab === "terminos" && <Field label="Contenido (## para títulos, párrafos separados por línea en blanco)"><textarea className={inputCls} rows={16} {...s("page_terminos_content")} /></Field>}
        {tab === "politica" && <Field label="Contenido (## para títulos, párrafos separados por línea en blanco)"><textarea className={inputCls} rows={16} {...s("page_politica_content")} /></Field>}
        {tab === "soporte" && <div className="grid sm:grid-cols-2 gap-4"><Field label="Invitación de Discord (URL)"><input className={inputCls} {...s("soporte_discord")} placeholder="https://discord.gg/tucanal" /></Field><Field label="Email de soporte"><input className={inputCls} {...s("soporte_email")} placeholder="soporte@shadowscale.pro" /></Field><Field label="WhatsApp"><input className={inputCls} {...s("soporte_whatsapp")} placeholder="+57 300 000 0000" /></Field><Field label="Horario"><input className={inputCls} {...s("soporte_horario")} placeholder="Lunes a Viernes · 9am – 8pm" /></Field></div>}
      </Card>
      <div className="flex justify-end"><button onClick={save} disabled={saving} className="px-8 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-50" style={{ background: "#f97316" }}>{saving ? "Guardando..." : "Guardar"}</button></div>
    </div>
  );
};

// ─── Affiliates Section ───────────────────────────────────────────────────────
const affStatusMeta: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "#f59e0b" },
  approved: { label: "Aprobado", color: "#10b981" },
  rejected: { label: "Rechazado", color: "#ef4444" },
  suspended: { label: "Suspendido", color: "#6b7280" },
};

const AffiliatesSection = ({ settings, onRefresh }: { settings: Record<string, string>; onRefresh: () => void }) => {
  const [vals, setVals] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState(false);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [refCounts, setRefCounts] = useState<Record<string, { clicks: number; conv: number }>>({});
  const [tab, setTab] = useState<"list" | "config">("list");
  useEffect(() => { setVals(settings); }, [settings]);

  const loadAffiliates = async () => {
    const { data } = await supabase.from("affiliates").select("*").order("created_at", { ascending: false });
    setAffiliates((data as Affiliate[]) ?? []);
    const { data: refs } = await supabase.from("referrals").select("affiliate_id, status");
    const counts: Record<string, { clicks: number; conv: number }> = {};
    (refs ?? []).forEach((r: any) => {
      if (!counts[r.affiliate_id]) counts[r.affiliate_id] = { clicks: 0, conv: 0 };
      if (r.status === "click") counts[r.affiliate_id].clicks++;
      if (r.status === "converted") counts[r.affiliate_id].conv++;
    });
    setRefCounts(counts);
  };
  useEffect(() => { loadAffiliates(); }, []);

  const setStatus = async (id: string, status: Affiliate["status"]) => {
    await supabase.from("affiliates").update({ status }).eq("id", id);
    if (status === "approved") {
      const aff = affiliates.find(a => a.id === id);
      if (aff?.email) {
        sendEmail(aff.email, "affiliate_approved", {
          name: aff.name, rate: String(aff.commission_rate),
          link: `${window.location.origin}/?ref=${aff.code}`,
        });
      }
    }
    loadAffiliates();
  };

  const save = async () => {
    setSaving(true);
    const keys = [
      "affiliate_commission", "affiliate_min_payout", "affiliate_ref_base", "affiliate_apply_link", "affiliate_intro",
      "affiliate_social_count",
      "aff_tier1_name", "aff_tier1_refs", "aff_tier1_commission", "aff_tier1_perks",
      "aff_tier2_name", "aff_tier2_refs", "aff_tier2_commission", "aff_tier2_perks",
      "aff_tier3_name", "aff_tier3_refs", "aff_tier3_commission", "aff_tier3_perks",
      ...Array.from({ length: 5 }, (_, i) => [`aff_faq${i+1}_q`, `aff_faq${i+1}_a`]).flat(),
      ...Array.from({ length: 4 }, (_, i) => [`aff_test${i+1}_name`, `aff_test${i+1}_role`, `aff_test${i+1}_text`, `aff_test${i+1}_rating`]).flat(),
      ...Array.from({ length: 4 }, (_, i) => [`aff_res${i+1}_title`, `aff_res${i+1}_desc`]).flat(),
    ];
    await Promise.all(keys.map(key => supabase.from("site_settings").upsert({ key, value: vals[key] ?? "" }, { onConflict: "key" })));
    setSaving(false); onRefresh();
  };
  const s = (key: string) => ({ value: vals[key] ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setVals(v => ({ ...v, [key]: e.target.value })) });

  const pending = affiliates.filter(a => a.status === "pending").length;
  const approved = affiliates.filter(a => a.status === "approved").length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Programa de Afiliados</h1><p className="text-gray-500 text-sm">Gestiona afiliados y configura el programa</p></div>
        <a href="/afiliados" target="_blank" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white border border-white/[0.08]"><ExternalLink className="w-3.5 h-3.5" /> Ver página</a>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total afiliados", value: affiliates.length, icon: Users, color: "#6366f1" },
          { label: "Pendientes", value: pending, icon: Clock, color: "#f59e0b" },
          { label: "Aprobados", value: approved, icon: ShieldCheck, color: "#10b981" },
        ].map((st, i) => (
          <Card key={i}><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: st.color + "22" }}><st.icon className="w-4 h-4" style={{ color: st.color }} /></div><div><div className="text-white font-bold text-lg leading-tight">{st.value}</div><div className="text-gray-500 text-xs">{st.label}</div></div></div></Card>
        ))}
      </div>

      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
        {[{ id: "list", label: "Afiliados" }, { id: "config", label: "Configuración" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)} className="px-5 py-2 rounded-lg text-sm font-medium transition-all" style={tab === t.id ? { background: "#f97316", color: "#fff" } : { color: "#9ca3af" }}>{t.label}</button>
        ))}
      </div>

      {tab === "list" ? (
        affiliates.length > 0 ? (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-gray-500 text-[11px] uppercase" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <th className="px-5 py-3">Afiliado</th><th className="px-3 py-3">Código</th><th className="px-3 py-3">Clicks</th><th className="px-3 py-3">Conv.</th><th className="px-3 py-3">Estado</th><th className="px-3 py-3"></th>
                </tr></thead>
                <tbody>
                  {affiliates.map(a => {
                    const c = refCounts[a.id] ?? { clicks: 0, conv: 0 };
                    const meta = affStatusMeta[a.status];
                    return (
                      <tr key={a.id} className="hover:bg-white/[0.02]" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                        <td className="px-5 py-3"><div className="text-white font-medium">{a.name}</div><div className="text-gray-600 text-xs">{a.email}</div></td>
                        <td className="px-3 py-3"><span className="font-mono text-xs text-gray-300 bg-white/[0.05] px-2 py-0.5 rounded">{a.code}</span></td>
                        <td className="px-3 py-3 text-white font-mono">{c.clicks}</td>
                        <td className="px-3 py-3 text-white font-mono">{c.conv}</td>
                        <td className="px-3 py-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: meta.color + "22", color: meta.color }}>{meta.label}</span></td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            {a.status !== "approved" && <button onClick={() => setStatus(a.id, "approved")} title="Aprobar" className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-white/[0.05]"><Check className="w-3.5 h-3.5" /></button>}
                            {a.status !== "suspended" && <button onClick={() => setStatus(a.id, "suspended")} title="Suspender" className="p-1.5 rounded-lg text-gray-500 hover:text-yellow-400 hover:bg-white/[0.05]"><Ban className="w-3.5 h-3.5" /></button>}
                            {a.status !== "rejected" && <button onClick={() => setStatus(a.id, "rejected")} title="Rechazar" className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/[0.05]"><X className="w-3.5 h-3.5" /></button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card><div className="text-center py-10"><Users className="w-10 h-10 text-gray-700 mx-auto mb-3" /><p className="text-gray-500 text-sm">Aún no hay afiliados registrados</p><p className="text-gray-700 text-xs mt-1">Aparecerán aquí cuando se registren en /afiliados/registro</p></div></Card>
        )
      ) : (
        <>
          <Card>
            <h2 className="text-white font-semibold text-sm mb-4">Parámetros del programa</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Comisión base (%)"><input className={inputCls} {...s("affiliate_commission")} placeholder="30" /></Field>
              <Field label="Mínimo de retiro"><input className={inputCls} {...s("affiliate_min_payout")} placeholder="$50" /></Field>
              <Field label="Link para aplicar"><input className={inputCls} {...s("affiliate_apply_link")} placeholder="/afiliados/registro" /></Field>
              <Field label="Prueba social (ej: '200+ afiliados activos')"><input className={inputCls} {...s("affiliate_social_count")} placeholder="200+ afiliados activos" /></Field>
            </div>
            <div className="mt-4"><Field label="Descripción del programa"><textarea className={inputCls} rows={3} {...s("affiliate_intro")} /></Field></div>
          </Card>

          {/* Tiers */}
          {[1, 2, 3].map(n => (
            <Card key={n}>
              <h2 className="text-white font-semibold text-sm mb-4">Nivel {n} — Tier</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nombre"><input className={inputCls} {...s(`aff_tier${n}_name`)} placeholder={["Básico","Pro","Elite"][n-1]} /></Field>
                <Field label="Rango de referidos"><input className={inputCls} {...s(`aff_tier${n}_refs`)} placeholder={["1 – 20 referidos","21 – 100 referidos","101+ referidos"][n-1]} /></Field>
                <Field label="Comisión (ej: 30%)"><input className={inputCls} {...s(`aff_tier${n}_commission`)} placeholder="30%" /></Field>
              </div>
              <div className="mt-3"><Field label="Beneficios (uno por línea)"><textarea className={inputCls} rows={4} {...s(`aff_tier${n}_perks`)} placeholder={"Comisión recurrente\nLink personalizado\nPanel de estadísticas"} /></Field></div>
            </Card>
          ))}

          {/* FAQs */}
          <Card>
            <h2 className="text-white font-semibold text-sm mb-4">Preguntas frecuentes — Afiliados</h2>
            <div className="flex flex-col gap-5">
              {[1,2,3,4,5].map(n => (
                <div key={n} className="flex flex-col gap-2">
                  <Field label={`Pregunta ${n}`}><input className={inputCls} {...s(`aff_faq${n}_q`)} /></Field>
                  <Field label={`Respuesta ${n}`}><textarea className={inputCls} rows={2} {...s(`aff_faq${n}_a`)} /></Field>
                </div>
              ))}
            </div>
          </Card>

          {/* Testimonials */}
          <Card>
            <h2 className="text-white font-semibold text-sm mb-4">Testimonios (carrusel)</h2>
            <div className="flex flex-col gap-5">
              {[1,2,3,4].map(n => (
                <div key={n} className="flex flex-col gap-2">
                  <div className="grid sm:grid-cols-3 gap-3">
                    <Field label={`Nombre ${n}`}><input className={inputCls} {...s(`aff_test${n}_name`)} placeholder="Carlos M." /></Field>
                    <Field label={`Rol ${n}`}><input className={inputCls} {...s(`aff_test${n}_role`)} placeholder="Content Creator" /></Field>
                    <Field label={`Estrellas ${n}`}><input className={inputCls} type="number" min="1" max="5" {...s(`aff_test${n}_rating`)} placeholder="5" /></Field>
                  </div>
                  <Field label={`Testimonio ${n}`}><textarea className={inputCls} rows={2} {...s(`aff_test${n}_text`)} /></Field>
                </div>
              ))}
            </div>
          </Card>

          {/* Resources */}
          <Card>
            <h2 className="text-white font-semibold text-sm mb-4">Recursos (sección "Crea tu contenido")</h2>
            <div className="flex flex-col gap-4">
              {[1,2,3,4].map(n => (
                <div key={n} className="grid sm:grid-cols-2 gap-3">
                  <Field label={`Título ${n}`}><input className={inputCls} {...s(`aff_res${n}_title`)} placeholder={["Plantillas listas","Scripts de ventas","Imágenes y assets","Guía de estrategia"][n-1]} /></Field>
                  <Field label={`Descripción ${n}`}><input className={inputCls} {...s(`aff_res${n}_desc`)} /></Field>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end"><button onClick={save} disabled={saving} className="px-8 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-50" style={{ background: "#f97316" }}>{saving ? "Guardando..." : "Guardar programa"}</button></div>
        </>
      )}
    </div>
  );
};

// ─── Analytics Section ────────────────────────────────────────────────────────
const flagEmoji = (code?: string | null): string => {
  if (!code || code.length !== 2) return "🌐";
  return code.toUpperCase().replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));
};

const EVENT_COLOR: Record<string, string> = {
  inicio: "#6366f1", scroll: "#10b981", pestaña: "#f59e0b",
  cta_click: "#f97316", lightbox_abrir: "#0ea5e9", video_click: "#ec4899", lightbox_tiempo: "#8b5cf6",
};

const COUNTRY_GRADIENTS = [
  "linear-gradient(90deg, #f97316, #fb923c)",
  "linear-gradient(90deg, #0ea5e9, #38bdf8)",
  "linear-gradient(90deg, #10b981, #34d399)",
  "linear-gradient(90deg, #8b5cf6, #a78bfa)",
  "linear-gradient(90deg, #ec4899, #f472b6)",
];

const BROWSER_COLORS: Record<string, string> = {
  Chrome: "#f97316", Firefox: "#e05c15", Safari: "#0ea5e9", Edge: "#3b82f6", Otro: "#6b7280",
};

const AnalyticsStat = ({ label, value, icon: Icon, color, delay = 0 }: {
  label: string; value: string | number; icon: React.ElementType; color: string; delay?: number;
}) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
    <div className="rounded-2xl p-5 relative overflow-hidden h-full" style={{ background: "#0e0e10", border: `1px solid ${color}28` }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at top left, ${color}18, transparent 65%)` }} />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold tracking-tight" style={{ color }}>{value}</div>
          <div className="text-gray-500 text-xs mt-0.5">{label}</div>
        </div>
      </div>
    </div>
  </motion.div>
);

const AnalyticsSection = () => {
  const [range, setRange] = useState<"today" | "week" | "month" | "all">("week");
  const [visits, setVisits] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [fDevice, setFDevice] = useState<string>("");
  const [fCountry, setFCountry] = useState<string>("");
  const [fBrowser, setFBrowser] = useState<string>("");

  const load = async () => {
    setLoading(true);
    const now = new Date();
    let since: string | null = null;
    if (range === "today") { const d = new Date(now); d.setHours(0, 0, 0, 0); since = d.toISOString(); }
    else if (range === "week") { const d = new Date(now); d.setDate(d.getDate() - 7); since = d.toISOString(); }
    else if (range === "month") { const d = new Date(now); d.setDate(d.getDate() - 30); since = d.toISOString(); }
    let q = supabase.from("analytics_visits").select("*").order("created_at", { ascending: false }).limit(2000);
    if (since) q = q.gte("created_at", since);
    let eq = supabase.from("analytics_events").select("*").order("ts", { ascending: true }).limit(5000);
    if (since) eq = eq.gte("ts", since);
    const [{ data: v }, { data: e }] = await Promise.all([q, eq]);
    setVisits(v ?? []); setEvents(e ?? []);
    setFDevice(""); setFCountry(""); setFBrowser("");
    setLoading(false);
  };

  useEffect(() => { load(); }, [range]);

  // Filtered visits (client-side)
  const fVisits = visits.filter(v =>
    (!fDevice  || (v.device ?? "Desktop") === fDevice) &&
    (!fCountry || v.country === fCountry) &&
    (!fBrowser || (v.browser ?? "Otro") === fBrowser)
  );
  const activeFilters = [fDevice, fCountry, fBrowser].filter(Boolean).length;

  // Available options from full dataset
  const allDevices   = [...new Set(visits.map(v => v.device ?? "Desktop"))].sort();
  const allCountries = [...new Set(visits.map(v => v.country).filter(Boolean))].sort();
  const allBrowsers  = [...new Set(visits.map(v => v.browser ?? "Otro"))].sort();

  const mobile  = fVisits.filter(v => v.device === "Móvil").length;
  const desktop = fVisits.filter(v => v.device === "Desktop").length;
  const tablet  = fVisits.filter(v => v.device === "Tablet").length;

  const countriesRaw = fVisits.reduce((acc: Record<string, { count: number; code: string }>, v) => {
    if (v.country) { if (!acc[v.country]) acc[v.country] = { count: 0, code: v.country_code ?? "" }; acc[v.country].count++; }
    return acc;
  }, {});
  const countries = Object.entries(countriesRaw).sort((a, b) => b[1].count - a[1].count);
  const maxCountry = countries[0]?.[1].count ?? 1;

  const browsersRaw = fVisits.reduce((acc: Record<string, number>, v) => {
    const b = v.browser ?? "Otro"; acc[b] = (acc[b] ?? 0) + 1; return acc;
  }, {});
  const browsers = Object.entries(browsersRaw).sort((a, b) => b[1] - a[1]);

  const chartData = (() => {
    if (range === "today") {
      const hours: Record<string, number> = {};
      for (let h = 0; h < 24; h++) hours[`${h.toString().padStart(2, "0")}h`] = 0;
      fVisits.forEach(v => { const h = new Date(v.created_at).getHours(); hours[`${h.toString().padStart(2, "0")}h`]++; });
      return Object.entries(hours).map(([label, count]) => ({ label, count }));
    }
    const n = range === "week" ? 7 : 30;
    const days: Record<string, number> = {};
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("es-CO", { month: "short", day: "numeric" });
      days[key] = 0;
    }
    fVisits.forEach(v => {
      const key = new Date(v.created_at).toLocaleDateString("es-CO", { month: "short", day: "numeric" });
      if (key in days) days[key]++;
    });
    return Object.entries(days).map(([label, count]) => ({ label, count }));
  })();

  const evsByVisit = events.reduce((acc: Record<string, any[]>, e) => {
    if (!acc[e.visit_id]) acc[e.visit_id] = []; acc[e.visit_id].push(e); return acc;
  }, {});

  const avgEvents = fVisits.length ? (events.filter(e => fVisits.some(v => v.id === e.visit_id)).length / fVisits.length).toFixed(1) : "0";
  const deviceData = [
    { name: "Desktop", value: desktop, color: "#6366f1" },
    { name: "Móvil",   value: mobile,  color: "#f97316" },
    { name: "Tablet",  value: tablet,  color: "#10b981" },
  ].filter(d => d.value > 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <p className="text-gray-500 text-sm">Comportamiento real de usuarios · shadowscale.pro</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white border border-white/[0.08] transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Actualizar
        </button>
      </div>

      {/* Controles: período + filtros */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Período */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#0e0e10", border: "1px solid rgba(255,255,255,0.07)" }}>
          {([["today","Hoy"],["week","7 días"],["month","30 días"],["all","Todo"]] as const).map(([r, label]) => (
            <button key={r} onClick={() => setRange(r)} className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={range === r ? { background: "#f97316", color: "#fff" } : { color: "#9ca3af" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Filtros */}
        {!loading && visits.length > 0 && (<>
          <select value={fDevice} onChange={e => setFDevice(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium outline-none transition-colors"
            style={{ background: fDevice ? "rgba(249,115,22,0.15)" : "#0e0e10", color: fDevice ? "#f97316" : "#9ca3af", border: `1px solid ${fDevice ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.07)"}` }}>
            <option value="">Dispositivo</option>
            {allDevices.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select value={fCountry} onChange={e => setFCountry(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium outline-none transition-colors max-w-[140px]"
            style={{ background: fCountry ? "rgba(14,165,233,0.15)" : "#0e0e10", color: fCountry ? "#38bdf8" : "#9ca3af", border: `1px solid ${fCountry ? "rgba(14,165,233,0.4)" : "rgba(255,255,255,0.07)"}` }}>
            <option value="">País</option>
            {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={fBrowser} onChange={e => setFBrowser(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium outline-none transition-colors"
            style={{ background: fBrowser ? "rgba(139,92,246,0.15)" : "#0e0e10", color: fBrowser ? "#a78bfa" : "#9ca3af", border: `1px solid ${fBrowser ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.07)"}` }}>
            <option value="">Navegador</option>
            {allBrowsers.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          {activeFilters > 0 && (
            <button onClick={() => { setFDevice(""); setFCountry(""); setFBrowser(""); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
              style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
              <X className="w-3 h-3" /> Limpiar ({activeFilters})
            </button>
          )}

          {activeFilters > 0 && (
            <span className="text-xs text-gray-500">
              <span className="text-white font-semibold">{fVisits.length}</span> de {visits.length} visitas
            </span>
          )}
        </>)}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-24 justify-center">
          <RefreshCw className="w-4 h-4 animate-spin" /> Cargando datos...
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <AnalyticsStat label="Visitas totales" value={fVisits.length} icon={TrendingUp} color="#f97316" delay={0} />
            <AnalyticsStat label="Países únicos" value={countries.length} icon={Globe} color="#0ea5e9" delay={0.07} />
            <AnalyticsStat label="% Móvil" value={fVisits.length ? `${Math.round(mobile / fVisits.length * 100)}%` : "0%"} icon={BarChart2} color="#10b981" delay={0.14} />
            <AnalyticsStat label="Eventos / visita" value={avgEvents} icon={ShieldCheck} color="#8b5cf6" delay={0.21} />
          </div>

          {/* Chart + Device */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="rounded-2xl p-5" style={{ background: "#0e0e10", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                  <h2 className="text-white font-semibold text-sm">Visitas en el tiempo</h2>
                  <span className="ml-auto text-[11px] text-gray-600 font-mono">{range === "today" ? "Por hora" : range === "week" ? "Últimos 7 días" : range === "month" ? "Últimos 30 días" : "Todo"}{activeFilters > 0 ? ` · ${fVisits.length} filtradas` : ""}</span>
                </div>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis dataKey="label" tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false}
                        interval={range === "today" ? 3 : 0} />
                      <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ background: "#1a1a1f", border: "1px solid rgba(249,115,22,0.25)", borderRadius: 10, color: "#fff", fontSize: 12, padding: "8px 12px" }}
                        cursor={{ stroke: "rgba(249,115,22,0.2)", strokeWidth: 1 }}
                        formatter={(v: any) => [`${v} visitas`, ""]}
                      />
                      <Area type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2} fill="url(#areaGrad)" dot={false} activeDot={{ r: 4, fill: "#f97316", stroke: "#0e0e10", strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
              <div className="rounded-2xl p-5 h-full flex flex-col gap-5" style={{ background: "#0e0e10", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart2 className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-white font-semibold text-sm">Dispositivos</h2>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {deviceData.length > 0 ? deviceData.map(d => (
                      <div key={d.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">{d.name}</span>
                          <span className="text-xs font-bold font-mono" style={{ color: d.color }}>
                            {visits.length ? Math.round(d.value / visits.length * 100) : 0}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                          <motion.div className="h-full rounded-full"
                            initial={{ width: 0 }} animate={{ width: `${visits.length ? (d.value / visits.length) * 100 : 0}%` }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 18 }}
                            style={{ background: d.color, boxShadow: `0 0 6px ${d.color}60` }} />
                        </div>
                      </div>
                    )) : <p className="text-gray-600 text-xs">Sin datos de dispositivo</p>}
                  </div>
                </div>

                {browsers.length > 0 && (
                  <div>
                    <div className="text-white font-semibold text-sm mb-3">Navegadores</div>
                    <div className="flex flex-col gap-2">
                      {browsers.slice(0, 5).map(([b, count]) => (
                        <div key={b} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: BROWSER_COLORS[b] ?? "#6b7280" }} />
                          <span className="text-xs text-gray-400 flex-1">{b}</span>
                          <span className="text-xs font-mono" style={{ color: BROWSER_COLORS[b] ?? "#6b7280" }}>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Country ranking */}
          {countries.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="rounded-2xl p-5" style={{ background: "#0e0e10", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 mb-5">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-white font-semibold text-sm">Distribución geográfica</h2>
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-cyan-400 font-mono bg-cyan-400/10 px-2 py-0.5 rounded-full">
                    {countries.length} países
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {countries.slice(0, 12).map(([name, { count, code }], i) => {
                    const pct = Math.round(count / visits.length * 100);
                    const grad = COUNTRY_GRADIENTS[i % COUNTRY_GRADIENTS.length];
                    return (
                      <motion.div key={name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }} className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-gray-700 w-4 text-right shrink-0">#{i + 1}</span>
                        <span className="text-2xl shrink-0">{flagEmoji(code)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-white text-xs font-semibold truncate">{name}</span>
                            <span className="text-gray-500 text-[11px] ml-2 shrink-0">
                              <span className="font-mono">{count}</span>
                              <span className="text-orange-400 font-bold ml-1">{pct}%</span>
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                            <motion.div className="h-full rounded-full"
                              initial={{ width: 0 }} animate={{ width: `${(count / maxCountry) * 100}%` }}
                              transition={{ delay: i * 0.04 + 0.15, type: "spring", stiffness: 80, damping: 18 }}
                              style={{ background: grad, boxShadow: i === 0 ? "0 0 8px rgba(249,115,22,0.5)" : undefined }} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Sessions table */}
          {fVisits.length > 0 ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
              <div className="rounded-2xl overflow-hidden" style={{ background: "#0e0e10", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span className="text-white font-semibold text-sm">Sesiones recientes</span>
                  <span className="text-[11px] text-gray-600 font-mono bg-white/[0.04] px-2 py-0.5 rounded-full">{fVisits.length}{activeFilters > 0 ? `/${visits.length}` : ""} registros</span>
                </div>
                {/* Table header */}
                <div className="hidden sm:grid px-5 py-2 text-[10px] font-medium uppercase tracking-wider text-gray-700"
                  style={{ gridTemplateColumns: "2rem 1fr 8rem 10rem 7rem", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span />
                  <span>Ubicación</span>
                  <span>IP</span>
                  <span>Dispositivo</span>
                  <span className="text-right">Hora</span>
                </div>
                <div>
                  {fVisits.slice(0, 50).map((v, idx) => {
                    const vEvents = evsByVisit[v.id] ?? [];
                    const isOpen = expanded === v.id;
                    return (
                      <div key={v.id}>
                        <button onClick={() => setExpanded(isOpen ? null : v.id)}
                          className="w-full px-5 py-3 hover:bg-white/[0.02] transition-colors text-left"
                          style={{ borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                          <div className="hidden sm:grid items-center gap-3" style={{ gridTemplateColumns: "2rem 1fr 8rem 10rem 7rem" }}>
                            <span className="text-xl">{flagEmoji(v.country_code)}</span>
                            <div className="min-w-0">
                              <div className="text-white text-xs font-medium truncate">
                                {[v.city, v.region, v.country].filter(Boolean).join(", ") || "Desconocido"}
                              </div>
                              {v.referrer && <div className="text-gray-600 text-[10px] truncate mt-0.5">← {v.referrer}</div>}
                            </div>
                            <div>
                              {v.ip
                                ? <span className="font-mono text-[11px] text-orange-300/80 bg-orange-400/10 px-2 py-0.5 rounded-md">{v.ip}</span>
                                : <span className="text-gray-700 text-[11px]">—</span>}
                            </div>
                            <div className="text-xs text-gray-500 truncate">{v.device ?? "Desktop"} · {v.browser ?? "—"}</div>
                            <div className="text-right">
                              <div className="text-gray-500 text-[11px]">
                                {new Date(v.created_at).toLocaleString("es-CO", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </div>
                              {vEvents.length > 0 && <div className="text-gray-700 text-[10px]">{vEvents.length} ev.</div>}
                            </div>
                          </div>
                          {/* Mobile layout */}
                          <div className="flex sm:hidden items-center gap-3">
                            <span className="text-2xl shrink-0">{flagEmoji(v.country_code)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-xs font-medium truncate">
                                {[v.city, v.country].filter(Boolean).join(", ") || "Desconocido"}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] mt-0.5 flex-wrap">
                                <span className="text-gray-500">{v.device ?? "Desktop"}</span>
                                {v.ip && <span className="font-mono text-orange-300/80 bg-orange-400/10 px-1.5 py-0.5 rounded">{v.ip}</span>}
                              </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform shrink-0 ${isOpen ? "rotate-90" : ""}`} />
                          </div>
                        </button>
                        {isOpen && vEvents.length > 0 && (
                          <div className="px-5 pb-3 pt-1 ml-10 flex flex-col gap-1.5"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.03)", background: "rgba(255,255,255,0.01)" }}>
                            {vEvents.map((e: any, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: EVENT_COLOR[e.event] ?? "#6b7280" }} />
                                <span className="font-medium" style={{ color: EVENT_COLOR[e.event] ?? "#9ca3af" }}>{e.event}</span>
                                {e.value && <span className="text-gray-500">{e.value}</span>}
                                <span className="text-gray-700 ml-auto font-mono">{new Date(e.ts).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-2xl p-12 text-center" style={{ background: "#0e0e10", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(249,115,22,0.1)" }}>
                <BarChart2 className="w-7 h-7 text-orange-400" />
              </div>
              <p className="text-gray-300 text-sm font-semibold">Sin visitas en este período</p>
              <p className="text-gray-600 text-xs mt-1.5">Los datos aparecen cuando hay tráfico real en el sitio</p>
              <button onClick={() => setRange("all")}
                className="mt-5 px-4 py-1.5 rounded-lg text-xs text-orange-400 border border-orange-400/30 hover:bg-orange-400/10 transition-colors">
                Ver todo el historial
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Subscriptions Section ────────────────────────────────────────────────────
type SubRecord = {
  id: string; user_id: string; user_email: string | null;
  plan_name: string; plan_price: number;
  status: "pending" | "active" | "expired" | "cancelled";
  efipay_reference: string | null; starts_at: string | null; expires_at: string | null; created_at: string;
};
const SUB_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  active:    { label: "Activa",    color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  pending:   { label: "Pendiente", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  expired:   { label: "Vencida",   color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  cancelled: { label: "Cancelada", color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
};

const SubscriptionsSection = () => {
  const [subs, setSubs] = useState<SubRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "active" | "expired" | "cancelled">("all");
  const [busy, setBusy] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false });
    setSubs((data as SubRecord[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const activate = async (sub: SubRecord) => {
    setBusy(sub.id);
    const now = new Date();
    const expires = new Date(now.getTime() + 30 * 86400000);
    await supabase.from("subscriptions").update({
      status: "active",
      starts_at: now.toISOString(),
      expires_at: expires.toISOString(),
    }).eq("id", sub.id);
    await fetch();
    setBusy(null);
  };

  const cancel = async (sub: SubRecord) => {
    if (!confirm(`¿Cancelar suscripción de ${sub.user_email ?? sub.user_id}?`)) return;
    setBusy(sub.id);
    await supabase.from("subscriptions").update({ status: "cancelled" }).eq("id", sub.id);
    await fetch();
    setBusy(null);
  };

  const filtered = filter === "all" ? subs : subs.filter(s => s.status === filter);
  const counts = { all: subs.length, pending: subs.filter(s=>s.status==="pending").length, active: subs.filter(s=>s.status==="active").length, expired: subs.filter(s=>s.status==="expired").length, cancelled: subs.filter(s=>s.status==="cancelled").length };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Suscripciones</h1><p className="text-gray-500 text-sm">Gestión y aprobación manual de pagos</p></div>
        <button onClick={fetch} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white border border-white/[0.08] transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Actualizar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: counts.all, color: "#9ca3af" },
          { label: "Pendientes", value: counts.pending, color: "#f59e0b" },
          { label: "Activas", value: counts.active, color: "#10b981" },
          { label: "Vencidas/Canceladas", value: counts.expired + counts.cancelled, color: "#ef4444" },
        ].map(k => (
          <Card key={k.label}>
            <p className="text-gray-500 text-xs mb-1">{k.label}</p>
            <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
        {(["all","pending","active","expired","cancelled"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
            style={filter === f ? { background: "#f97316", color: "#fff" } : { color: "#9ca3af" }}>
            {f === "all" ? "Todas" : SUB_STATUS[f]?.label ?? f}{f !== "all" && counts[f] > 0 ? ` (${counts[f]})` : ""}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <Card className="overflow-x-auto p-0">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-gray-500 text-sm gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Cargando...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-600 text-sm">Sin suscripciones</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Cliente", "Plan", "Estado", "Referencia Efipay", "Creada", "Vence", "Acciones"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub, i) => {
                const st = SUB_STATUS[sub.status] ?? SUB_STATUS.cancelled;
                const isBusy = busy === sub.id;
                return (
                  <tr key={sub.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                    className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white text-xs font-medium">{sub.user_email ?? "—"}</p>
                      <p className="text-gray-600 text-[10px] font-mono">{sub.user_id.slice(0,8)}…</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-xs font-semibold">{sub.plan_name}</p>
                      <p className="text-gray-500 text-[10px]">${sub.plan_price}/mes</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
                        style={{ color: st.color, background: st.bg }}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-400 text-[10px] font-mono">{sub.efipay_reference ? sub.efipay_reference.slice(0,18)+"…" : "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(sub.created_at).toLocaleDateString("es-CO")}
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: sub.expires_at ? "white" : "#6b7280" }}>
                      {sub.expires_at ? new Date(sub.expires_at).toLocaleDateString("es-CO") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {sub.status === "pending" && (
                          <button onClick={() => activate(sub)} disabled={isBusy}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:opacity-90 disabled:opacity-40 transition-opacity"
                            style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
                            {isBusy ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            Aprobar
                          </button>
                        )}
                        {sub.status === "active" && (
                          <button onClick={() => cancel(sub)} disabled={isBusy}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:opacity-90 disabled:opacity-40 transition-opacity"
                            style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>
                            {isBusy ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Ban className="w-3 h-3" />}
                            Cancelar
                          </button>
                        )}
                        {(sub.status === "expired" || sub.status === "cancelled") && (
                          <button onClick={() => activate(sub)} disabled={isBusy}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:opacity-90 disabled:opacity-40 transition-opacity"
                            style={{ background: "rgba(249,115,22,0.12)", color: "#f97316" }}>
                            {isBusy ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                            Reactivar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
type SectionId = "overview" | "tools" | "categories" | "plans" | "media" | "settings" | "pages" | "affiliates" | "analytics" | "subscriptions";
const SIDEBAR_ITEMS: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "tools", label: "Herramientas", icon: Package },
  { id: "categories", label: "Categorías", icon: FolderOpen },
  { id: "plans", label: "Planes", icon: CreditCard },
  { id: "subscriptions", label: "Suscripciones", icon: ShieldCheck },
  { id: "affiliates", label: "Afiliados", icon: Users },
  { id: "media", label: "Media", icon: Film },
  { id: "settings", label: "Configuración", icon: Settings },
  { id: "pages", label: "Páginas", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
];

// ─── Main Admin ───────────────────────────────────────────────────────────────
const VALID_SECTIONS: SectionId[] = ["overview","tools","categories","plans","media","settings","pages","affiliates","analytics","subscriptions"];

const AdminPanel = ({ onSignOut }: { onSignOut: () => void }) => {
  const getInitialSection = (): SectionId => {
    const hash = window.location.hash.slice(1) as SectionId;
    return VALID_SECTIONS.includes(hash) ? hash : "overview";
  };
  const [section, setSection] = useState<SectionId>(getInitialSection);
  const { tools, categories, plans, settings, loading, error, refetch } = useSiteData();
  const logout = onSignOut;

  const goTo = (s: SectionId) => {
    setSection(s);
    window.location.hash = s;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}><div className="flex items-center gap-3 text-gray-400"><RefreshCw className="w-4 h-4 animate-spin" /> Cargando...</div></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#0a0a0a" }}><div className="max-w-md w-full rounded-2xl p-6 text-center" style={{ background: "#161618", border: "1px solid rgba(239,68,68,0.3)" }}><p className="text-red-400 font-medium mb-2">Error de conexión</p><p className="text-gray-500 text-sm mb-4">{error}</p><button onClick={refetch} className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "#f97316" }}>Reintentar</button></div></div>;

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0a0a" }}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col sticky top-0 h-screen" style={{ background: "#0d0d0f", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-4 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-8 w-auto mb-1" />
          <span className="text-[11px] text-gray-600 font-medium uppercase tracking-wider">Admin CMS</span>
        </div>
        <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
          {SIDEBAR_ITEMS.map(item => (
            <button key={item.id} onClick={() => goTo(item.id)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
              style={section === item.id ? { background: "rgba(249,115,22,0.12)", color: "#f97316" } : { color: "#6b7280" }}>
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
              {section === item.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400" />}
            </button>
          ))}
        </nav>
        <div className="px-2 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={refetch} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-gray-600 hover:text-gray-300 transition-colors"><RefreshCw className="w-4 h-4" /> Sincronizar</button>
          <a href="/" target="_blank" className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-gray-600 hover:text-gray-300 transition-colors"><ExternalLink className="w-4 h-4" /> Ver sitio</a>
          <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-gray-600 hover:text-red-400 transition-colors"><LogOut className="w-4 h-4" /> Cerrar sesión</button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-2 px-3 py-2.5 overflow-x-auto"
        style={{ background: "#0d0d0f", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {SIDEBAR_ITEMS.map(item => (
          <button key={item.id} onClick={() => goTo(item.id)}
            className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={section === item.id ? { background: "rgba(249,115,22,0.2)", color: "#f97316", border: "1px solid rgba(249,115,22,0.3)" } : { color: "#6b7280", border: "1px solid rgba(255,255,255,0.06)" }}>
            <item.icon className="w-3.5 h-3.5" />{item.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 mt-14 md:mt-0">
          <AnimatePresence mode="wait">
            <motion.div key={section} variants={pageVariants} initial="initial" animate="animate" exit="exit">
              {section === "overview" && <OverviewSection tools={tools} categories={categories} plans={plans} settings={settings} />}
              {section === "tools" && <ToolsSection tools={tools} categories={categories} onRefresh={refetch} />}
              {section === "categories" && <CategoriesSection categories={categories} onRefresh={refetch} />}
              {section === "plans" && <PlansSection plans={plans} onRefresh={refetch} />}
              {section === "media" && <MediaSection settings={settings} onRefresh={refetch} />}
              {section === "settings" && <SettingsSection settings={settings} onRefresh={refetch} />}
              {section === "pages" && <PagesSection settings={settings} onRefresh={refetch} />}
              {section === "affiliates" && <AffiliatesSection settings={settings} onRefresh={refetch} />}
              {section === "analytics" && <AnalyticsSection />}
              {section === "subscriptions" && <SubscriptionsSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// ─── Export ───────────────────────────────────────────────────────────────────
export default function Admin() {
  const { session, profile, loading, isAdmin, signOut } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <div className="flex items-center gap-3 text-gray-400"><RefreshCw className="w-4 h-4 animate-spin" /> Cargando...</div>
    </div>
  );
  if (!session) return <LoginScreen />;
  if (!isAdmin) return <NoAccessScreen onSignOut={signOut} email={profile?.email ?? session.user.email} />;
  return <AdminPanel onSignOut={signOut} />;
}
