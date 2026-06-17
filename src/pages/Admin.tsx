import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, Tool, Category, Plan, ToolStatus, BadgeType, PlanStatus } from "@/lib/supabase";
import { useSiteData } from "@/hooks/useSiteData";
import {
  Plus, Trash2, Pencil, Eye, EyeOff, LogOut, RefreshCw, ExternalLink,
  Upload, Film, ImageIcon, X, LayoutDashboard, Package, FolderOpen,
  CreditCard, Settings, FileText, Users, BarChart2, Globe, ChevronRight,
  TrendingUp, Link2, DollarSign,
} from "lucide-react";

const ADMIN_PASSWORD = "Agencia2032**";

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

// ─── Login ─────────────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { localStorage.setItem("ss_admin", "1"); onLogin(); }
    else { setErr(true); setTimeout(() => setErr(false), 1500); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-80 rounded-2xl p-8 flex flex-col gap-4"
        style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.08)" }}>
        <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-10 w-auto mx-auto mb-2" />
        <h1 className="text-white text-lg font-bold text-center">Admin CMS</h1>
        <input type="password" placeholder="Contraseña" value={pw} onChange={e => setPw(e.target.value)} autoFocus
          className="w-full bg-[#0f0f0f] border rounded-lg px-4 py-2.5 text-white text-sm outline-none transition-colors"
          style={{ borderColor: err ? "#ef4444" : "rgba(255,255,255,0.1)" }} />
        {err && <p className="text-red-400 text-xs text-center">Contraseña incorrecta</p>}
        <button type="submit" className="w-full py-2.5 rounded-lg font-bold text-white text-sm hover:opacity-90 transition-opacity"
          style={{ background: "#f97316" }}>Entrar</button>
      </motion.form>
    </div>
  );
};

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

// ─── Overview ─────────────────────────────────────────────────────────────────
const OverviewSection = ({ tools, categories, plans, settings }:
  { tools: Tool[]; categories: Category[]; plans: Plan[]; settings: Record<string, string> }) => {
  const active = tools.filter(t => t.status === "active").length;
  const totalValue = tools.reduce((s, t) => s + (t.individual_price || 0), 0);
  const activePlans = plans.filter(p => p.status === "active").length;
  const stats = [
    { label: "Herramientas activas", value: active, sub: `de ${tools.length} totales`, color: "#10b981", icon: Package },
    { label: "Categorías", value: categories.length, sub: "configuradas", color: "#f97316", icon: FolderOpen },
    { label: "Planes activos", value: activePlans, sub: `de ${plans.length} totales`, color: "#6366f1", icon: CreditCard },
    { label: "Valor individual total", value: `$${totalValue.toLocaleString()}`, sub: "si se compran por separado", color: "#0ea5e9", icon: TrendingUp },
  ];
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm">Bienvenido al panel de administración de ShadowScale</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: s.color + "22" }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-white font-medium mt-0.5">{s.label}</div>
              <div className="text-xs text-gray-600 mt-0.5">{s.sub}</div>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Card>
          <h2 className="text-white font-bold mb-3 text-sm">Accesos rápidos</h2>
          {[{ label: "Ver sitio público", href: "/", icon: Globe }, { label: "Panel de afiliados", href: "/afiliados", icon: Users }, { label: "Términos y Condiciones", href: "/terminos", icon: FileText }].map((link, i) => (
            <a key={i} href={link.href} target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors">
              <link.icon className="w-4 h-4 shrink-0" />{link.label}<ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
            </a>
          ))}
        </Card>
        <Card>
          <h2 className="text-white font-bold mb-3 text-sm">Estado del sitio</h2>
          {[{ label: "Banner", key: "banner_visible", type: "bool" }, { label: "CTA principal", key: "cta_text", type: "text" }, { label: "Footer copyright", key: "footer_copyright", type: "text" }].map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm py-1.5">
              <span className="text-gray-500">{item.label}</span>
              <span className="text-white text-xs font-mono truncate max-w-[160px]">
                {item.type === "bool" ? (settings[item.key] !== "false" ? "✓ Visible" : "✗ Oculto") : (settings[item.key] ?? "—")}
              </span>
            </div>
          ))}
        </Card>
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
    const keys = ["page_terminos_content", "page_politica_content", "soporte_email", "soporte_whatsapp", "soporte_horario"];
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
        {tab === "soporte" && <div className="grid sm:grid-cols-2 gap-4"><Field label="Email de soporte"><input className={inputCls} {...s("soporte_email")} placeholder="soporte@shadowscale.pro" /></Field><Field label="WhatsApp"><input className={inputCls} {...s("soporte_whatsapp")} placeholder="+57 300 000 0000" /></Field><Field label="Horario"><input className={inputCls} {...s("soporte_horario")} placeholder="Lunes a Viernes · 9am – 8pm" /></Field></div>}
      </Card>
      <div className="flex justify-end"><button onClick={save} disabled={saving} className="px-8 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-50" style={{ background: "#f97316" }}>{saving ? "Guardando..." : "Guardar"}</button></div>
    </div>
  );
};

// ─── Affiliates Section ───────────────────────────────────────────────────────
const AffiliatesSection = ({ settings, onRefresh }: { settings: Record<string, string>; onRefresh: () => void }) => {
  const [vals, setVals] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState(false);
  useEffect(() => { setVals(settings); }, [settings]);
  const save = async () => { setSaving(true); const keys = ["affiliate_commission", "affiliate_min_payout", "affiliate_ref_base", "affiliate_apply_link", "affiliate_intro"]; await Promise.all(keys.map(key => supabase.from("site_settings").upsert({ key, value: vals[key] ?? "" }, { onConflict: "key" }))); setSaving(false); onRefresh(); };
  const s = (key: string) => ({ value: vals[key] ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setVals(v => ({ ...v, [key]: e.target.value })) });
  const commission = vals["affiliate_commission"] ?? "30";
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Programa de Afiliados</h1><p className="text-gray-500 text-sm">Configura la página pública y los parámetros del programa</p></div>
        <a href="/afiliados" target="_blank" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white border border-white/[0.08]"><ExternalLink className="w-3.5 h-3.5" /> Ver página</a>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[{ label: "Comisión activa", value: `${commission}%`, icon: DollarSign, color: "#f97316" }, { label: "Página pública", value: "Activa", icon: Globe, color: "#10b981" }, { label: "Solicitudes", value: "Por email", icon: Users, color: "#6366f1" }].map((s, i) => (
          <Card key={i}><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.color + "22" }}><s.icon className="w-4 h-4" style={{ color: s.color }} /></div><div><div className="text-white font-bold text-lg leading-tight">{s.value}</div><div className="text-gray-500 text-xs">{s.label}</div></div></div></Card>
        ))}
      </div>
      <Card>
        <h2 className="text-white font-semibold text-sm mb-4">Parámetros del programa</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Comisión (%)"><input className={inputCls} {...s("affiliate_commission")} placeholder="30" /></Field>
          <Field label="Mínimo de retiro"><input className={inputCls} {...s("affiliate_min_payout")} placeholder="$50" /></Field>
          <Field label="Link base de referidos"><input className={inputCls} {...s("affiliate_ref_base")} placeholder="https://shadowscale.pro/?ref=CODIGO" /></Field>
          <Field label="Link para aplicar"><input className={inputCls} {...s("affiliate_apply_link")} placeholder="mailto:afiliados@shadowscale.pro" /></Field>
        </div>
        <div className="mt-4"><Field label="Descripción del programa"><textarea className={inputCls} rows={3} {...s("affiliate_intro")} /></Field></div>
      </Card>
      <div className="flex justify-end"><button onClick={save} disabled={saving} className="px-8 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-50" style={{ background: "#f97316" }}>{saving ? "Guardando..." : "Guardar programa"}</button></div>
    </div>
  );
};

// ─── Analytics Section ────────────────────────────────────────────────────────
const AnalyticsSection = () => {
  const [range, setRange] = useState<"today" | "week" | "all">("today");
  const [visits, setVisits] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const now = new Date();
    let since: string | null = null;
    if (range === "today") { const d = new Date(now); d.setHours(0,0,0,0); since = d.toISOString(); }
    else if (range === "week") { const d = new Date(now); d.setDate(d.getDate() - 7); since = d.toISOString(); }
    let q = supabase.from("analytics_visits").select("*").order("created_at", { ascending: false }).limit(100);
    if (since) q = q.gte("created_at", since);
    let eq = supabase.from("analytics_events").select("*").order("ts", { ascending: true }).limit(1000);
    if (since) eq = eq.gte("ts", since);
    const [{ data: v }, { data: e }] = await Promise.all([q, eq]);
    setVisits(v ?? []); setEvents(e ?? []); setLoading(false);
  };

  useEffect(() => { load(); }, [range]);

  const mobile = visits.filter(v => v.device === "Móvil").length;
  const countries = Object.entries(visits.reduce((acc: Record<string,number>, v) => { if (v.country) acc[v.country] = (acc[v.country] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]);
  const evsByVisit = events.reduce((acc: Record<string, any[]>, e) => { if (!acc[e.visit_id]) acc[e.visit_id] = []; acc[e.visit_id].push(e); return acc; }, {});
  const eventColor: Record<string, string> = { inicio: "#6366f1", scroll: "#10b981", pestaña: "#f59e0b", cta_click: "#f97316", lightbox_abrir: "#0ea5e9", video_click: "#ec4899", lightbox_tiempo: "#8b5cf6" };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Analytics de visitas</h1><p className="text-gray-500 text-sm">Comportamiento real de usuarios en el sitio</p></div>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white border border-white/[0.08]"><RefreshCw className="w-3.5 h-3.5" /> Actualizar</button>
      </div>
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
        {(["today", "week", "all"] as const).map(r => <button key={r} onClick={() => setRange(r)} className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all" style={range === r ? { background: "#f97316", color: "#fff" } : { color: "#9ca3af" }}>{r === "today" ? "Hoy" : r === "week" ? "Esta semana" : "Todo"}</button>)}
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-10 justify-center"><RefreshCw className="w-4 h-4 animate-spin" /> Cargando datos...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Visitas", value: visits.length, color: "#f97316" },
              { label: "Móvil", value: `${visits.length ? Math.round(mobile / visits.length * 100) : 0}%`, color: "#10b981" },
              { label: "Desktop", value: `${visits.length ? Math.round((visits.length - mobile) / visits.length * 100) : 0}%`, color: "#6366f1" },
              { label: "País #1", value: countries[0]?.[0] ?? "—", color: "#0ea5e9" },
            ].map((s, i) => <Card key={i}><div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div><div className="text-gray-500 text-xs mt-1">{s.label}</div></Card>)}
          </div>
          {visits.length > 0 ? (
            <Card className="p-0 overflow-hidden">
              <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-white font-semibold text-sm">Sesiones recientes ({visits.length})</span>
              </div>
              <div>
                {visits.slice(0, 20).map(v => {
                  const vEvents = evsByVisit[v.id] ?? [];
                  const isOpen = expanded === v.id;
                  return (
                    <div key={v.id} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <button onClick={() => setExpanded(isOpen ? null : v.id)} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors text-left">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: "#f9731622", color: "#f97316" }}>{v.device?.[0] ?? "?"}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium truncate">{v.country ?? "Desconocido"} · {v.browser ?? "—"}</div>
                          <div className="text-gray-600 text-xs">{v.screen ?? ""} · {v.lang ?? ""}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-gray-400 text-xs">{new Date(v.created_at).toLocaleString("es-CO", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                          <div className="text-gray-600 text-xs">{vEvents.length} eventos</div>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform shrink-0 ${isOpen ? "rotate-90" : ""}`} />
                      </button>
                      {isOpen && vEvents.length > 0 && (
                        <div className="px-5 pb-3 ml-11 flex flex-col gap-1">
                          {vEvents.map((e, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: eventColor[e.event] ?? "#6b7280" }} />
                              <span className="font-medium" style={{ color: eventColor[e.event] ?? "#9ca3af" }}>{e.event}</span>
                              {e.value && <span className="text-gray-500">{e.value}</span>}
                              <span className="text-gray-700 ml-auto">{new Date(e.ts).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-10">
                <BarChart2 className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No hay visitas registradas en este período</p>
                <p className="text-gray-700 text-xs mt-1">Los datos aparecen cuando hay tráfico real en el sitio</p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
type SectionId = "overview" | "tools" | "categories" | "plans" | "media" | "settings" | "pages" | "affiliates" | "analytics";
const SIDEBAR_ITEMS: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "tools", label: "Herramientas", icon: Package },
  { id: "categories", label: "Categorías", icon: FolderOpen },
  { id: "plans", label: "Planes", icon: CreditCard },
  { id: "media", label: "Media", icon: Film },
  { id: "settings", label: "Configuración", icon: Settings },
  { id: "pages", label: "Páginas", icon: FileText },
  { id: "affiliates", label: "Afiliados", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
];

// ─── Main Admin ───────────────────────────────────────────────────────────────
const AdminPanel = () => {
  const [section, setSection] = useState<SectionId>("overview");
  const { tools, categories, plans, settings, loading, error, refetch } = useSiteData();
  const logout = () => { localStorage.removeItem("ss_admin"); window.location.reload(); };

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
            <button key={item.id} onClick={() => setSection(item.id)}
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
          <button key={item.id} onClick={() => setSection(item.id)}
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
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// ─── Export ───────────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(() => localStorage.getItem("ss_admin") === "1");
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <AdminPanel />;
}
