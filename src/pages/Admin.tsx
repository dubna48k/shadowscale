import { useState, useEffect, useRef } from "react";
import { supabase, Tool, Category, Plan, ToolStatus, BadgeType, PlanStatus } from "@/lib/supabase";
import { useSiteData } from "@/hooks/useSiteData";
import { Plus, Trash2, Save, Eye, EyeOff, LogOut, RefreshCw, ExternalLink, ChevronDown, ChevronUp, Upload, Film, ImageIcon, X } from "lucide-react";

const ADMIN_PASSWORD = "Agencia2032**";

// ─── Auth Gate ──────────────────────────────────────────────────────────────
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
      <form onSubmit={submit} className="w-80 rounded-2xl p-8 flex flex-col gap-4"
        style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.08)" }}>
        <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-8 w-auto mx-auto mb-2" />
        <h1 className="text-white text-lg font-bold text-center">Admin Panel</h1>
        <input
          type="password" placeholder="Contraseña" value={pw}
          onChange={e => setPw(e.target.value)} autoFocus
          className="w-full bg-[#0f0f0f] border rounded-lg px-4 py-2.5 text-white text-sm outline-none transition-colors"
          style={{ borderColor: err ? "#ef4444" : "rgba(255,255,255,0.1)" }}
        />
        {err && <p className="text-red-400 text-xs text-center">Contraseña incorrecta</p>}
        <button type="submit" className="w-full py-2.5 rounded-lg font-bold text-white text-sm transition-all hover:opacity-90"
          style={{ background: "#f97316" }}>
          Entrar
        </button>
      </form>
    </div>
  );
};

// ─── Status badge ─────────────────────────────────────────────────────────────
const statusColors: Record<string, string> = {
  active: "#10b981", inactive: "#6b7280", sold_out: "#ef4444", coming_soon: "#f59e0b",
};
const statusLabels: Record<string, string> = {
  active: "Activo", inactive: "Inactivo", sold_out: "Agotado", coming_soon: "Próximo",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: statusColors[status] + "22", color: statusColors[status] }}>
    {statusLabels[status] ?? status}
  </span>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center justify-between px-5 py-3.5 cursor-pointer select-none" onClick={() => setOpen(o => !o)}
        style={{ borderBottom: open ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
        <h2 className="text-white font-bold text-sm">{title}</h2>
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          {action}
          <button onClick={() => setOpen(o => !o)} className="text-gray-500 hover:text-white transition-colors">
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
};

// ─── Input helpers ────────────────────────────────────────────────────────────
const inputCls = "w-full bg-[#0f0f0f] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-white/20 transition-colors";
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">{label}</label>
    {children}
  </div>
);

// ─── Tools Section ────────────────────────────────────────────────────────────
const ToolsSection = ({ tools, categories, onRefresh }: { tools: Tool[]; categories: Category[]; onRefresh: () => void }) => {
  const [editing, setEditing] = useState<Partial<Tool> | null>(null);
  const [saving, setSaving] = useState(false);

  const blank: Partial<Tool> = {
    name: "", category_id: categories[0]?.id ?? "", color: "#6366f1", initial: "",
    domain: "", badge: null, note: "", individual_price: 0, status: "active", sort_order: 99,
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = { ...editing };
    if (!payload.domain) payload.domain = null;
    if (!payload.note) payload.note = null;
    if (payload.id) {
      await supabase.from("tools").update(payload).eq("id", payload.id);
    } else {
      await supabase.from("tools").insert(payload);
    }
    setSaving(false);
    setEditing(null);
    onRefresh();
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar esta herramienta?")) return;
    await supabase.from("tools").delete().eq("id", id);
    onRefresh();
  };

  const toggleStatus = async (tool: Tool) => {
    const next: ToolStatus = tool.status === "active" ? "inactive" : "active";
    await supabase.from("tools").update({ status: next }).eq("id", tool.id);
    onRefresh();
  };

  return (
    <Section title={`Herramientas (${tools.length})`} action={
      <button onClick={() => setEditing(blank)} className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:opacity-90" style={{ background: "#f97316", color: "#fff" }}>
        <Plus className="w-3.5 h-3.5" /> Nueva
      </button>
    }>
      {/* Editor modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
            style={{ background: "#1a1a1c", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h3 className="text-white font-bold">{editing.id ? "Editar herramienta" : "Nueva herramienta"}</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre">
                <input className={inputCls} value={editing.name ?? ""} onChange={e => setEditing(v => ({ ...v, name: e.target.value }))} />
              </Field>
              <Field label="Inicial (fallback logo)">
                <input className={inputCls} maxLength={2} value={editing.initial ?? ""} onChange={e => setEditing(v => ({ ...v, initial: e.target.value.toUpperCase() }))} />
              </Field>
              <Field label="Dominio (para logo)">
                <input className={inputCls} placeholder="openai.com" value={editing.domain ?? ""} onChange={e => setEditing(v => ({ ...v, domain: e.target.value }))} />
              </Field>
              <Field label="Color">
                <div className="flex gap-2">
                  <input type="color" value={editing.color ?? "#6366f1"} onChange={e => setEditing(v => ({ ...v, color: e.target.value }))}
                    className="w-10 h-9 rounded cursor-pointer border-0 bg-transparent" />
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
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="sold_out">Agotado</option>
                  <option value="coming_soon">Próximamente</option>
                </select>
              </Field>
              <Field label="Precio individual ($)">
                <input type="number" className={inputCls} value={editing.individual_price ?? 0} onChange={e => setEditing(v => ({ ...v, individual_price: Number(e.target.value) }))} />
              </Field>
              <Field label="Badge">
                <select className={inputCls} value={editing.badge ?? ""} onChange={e => setEditing(v => ({ ...v, badge: (e.target.value || null) as BadgeType }))}>
                  <option value="">Sin badge</option>
                  <option value="nuevo">Nuevo</option>
                  <option value="prueba">Prueba</option>
                </select>
              </Field>
            </div>
            <Field label="Nota de acceso (ticker en card)">
              <input className={inputCls} placeholder="Solo modelos ILIMITADOS · Sin límites" value={editing.note ?? ""} onChange={e => setEditing(v => ({ ...v, note: e.target.value }))} />
            </Field>
            <Field label="Orden (número menor = primero)">
              <input type="number" className={inputCls} value={editing.sort_order ?? 99} onChange={e => setEditing(v => ({ ...v, sort_order: Number(e.target.value) }))} />
            </Field>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
              <button onClick={save} disabled={saving} className="px-5 py-2 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "#f97316" }}>
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 text-[11px] uppercase border-b border-white/[0.05]">
              <th className="pb-2 pr-4">Herramienta</th>
              <th className="pb-2 pr-4">Categoría</th>
              <th className="pb-2 pr-4">Precio</th>
              <th className="pb-2 pr-4">Estado</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {tools.map(t => (
              <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-2.5 pr-4">
                  <div className="flex items-center gap-2.5">
                    {t.domain ? (
                      <img src={`https://logo.clearbit.com/${t.domain}`} className="w-6 h-6 rounded-md bg-white object-contain p-0.5" onError={e => { e.currentTarget.style.display = "none"; }} />
                    ) : (
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white" style={{ background: t.color }}>{t.initial}</div>
                    )}
                    <span className="text-white font-medium">{t.name}</span>
                    {t.badge && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: t.badge === "nuevo" ? "#f97316" : "#7c3aed", color: "#fff" }}>{t.badge.toUpperCase()}</span>}
                  </div>
                </td>
                <td className="py-2.5 pr-4 text-gray-400">{categories.find(c => c.id === t.category_id)?.label ?? "-"}</td>
                <td className="py-2.5 pr-4 text-white font-mono">${t.individual_price}</td>
                <td className="py-2.5 pr-4"><StatusBadge status={t.status} /></td>
                <td className="py-2.5">
                  <div className="flex items-center gap-1.5 justify-end">
                    <button onClick={() => toggleStatus(t)} className="p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors hover:bg-white/[0.05]">
                      {t.status === "active" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => setEditing(t)} className="p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors hover:bg-white/[0.05]">
                      <Save className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => remove(t.id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 transition-colors hover:bg-white/[0.05]">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
};

// ─── Categories Section ───────────────────────────────────────────────────────
const CategoriesSection = ({ categories, onRefresh }: { categories: Category[]; onRefresh: () => void }) => {
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");

  const add = async () => {
    if (!label.trim()) return;
    const id = label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    await supabase.from("categories").insert({ id, label: label.trim(), sort_order: categories.length + 1 });
    setLabel(""); setAdding(false); onRefresh();
  };

  const rename = async (cat: Category, newLabel: string) => {
    await supabase.from("categories").update({ label: newLabel }).eq("id", cat.id);
    onRefresh();
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar categoría? Las herramientas quedarán sin categoría.")) return;
    await supabase.from("categories").delete().eq("id", id);
    onRefresh();
  };

  return (
    <Section title="Categorías" action={
      <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg hover:opacity-90" style={{ background: "#f97316", color: "#fff" }}>
        <Plus className="w-3.5 h-3.5" /> Nueva
      </button>
    }>
      <div className="flex flex-col gap-2">
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center gap-3 group">
            <span className="text-[11px] text-gray-600 font-mono w-6 text-right">{cat.sort_order}</span>
            <input
              defaultValue={cat.label}
              onBlur={e => { if (e.target.value !== cat.label) rename(cat, e.target.value); }}
              className="flex-1 bg-transparent border border-transparent focus:border-white/10 rounded-lg px-3 py-1.5 text-white text-sm outline-none transition-colors"
            />
            <button onClick={() => remove(cat.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 transition-all">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {adding && (
          <div className="flex gap-2 mt-1">
            <input autoFocus className={inputCls} placeholder="Nombre de categoría" value={label} onChange={e => setLabel(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") add(); if (e.key === "Escape") setAdding(false); }} />
            <button onClick={add} className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: "#f97316" }}>Agregar</button>
          </div>
        )}
      </div>
    </Section>
  );
};

// ─── Plans Section ────────────────────────────────────────────────────────────
const PlansSection = ({ plans, onRefresh }: { plans: Plan[]; onRefresh: () => void }) => {
  const [editing, setEditing] = useState<Partial<Plan> | null>(null);
  const [saving, setSaving] = useState(false);

  const blank: Partial<Plan> = {
    name: "", price: 0, status: "active", features: [""], highlight: false,
    cta_text: "Comenzar ahora", cta_link: "https://app.shadowscale.pro/register", sort_order: 99,
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    if (editing.id) await supabase.from("plans").update(editing).eq("id", editing.id);
    else await supabase.from("plans").insert(editing);
    setSaving(false); setEditing(null); onRefresh();
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar plan?")) return;
    await supabase.from("plans").delete().eq("id", id);
    onRefresh();
  };

  return (
    <Section title="Planes y Precios" action={
      <button onClick={() => setEditing(blank)} className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg hover:opacity-90" style={{ background: "#f97316", color: "#fff" }}>
        <Plus className="w-3.5 h-3.5" /> Nuevo
      </button>
    }>
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
            style={{ background: "#1a1a1c", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h3 className="text-white font-bold">{editing.id ? "Editar plan" : "Nuevo plan"}</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre">
                <input className={inputCls} value={editing.name ?? ""} onChange={e => setEditing(v => ({ ...v, name: e.target.value }))} />
              </Field>
              <Field label="Precio ($/mes)">
                <input type="number" className={inputCls} value={editing.price ?? 0} onChange={e => setEditing(v => ({ ...v, price: Number(e.target.value) }))} />
              </Field>
              <Field label="Estado">
                <select className={inputCls} value={editing.status ?? "active"} onChange={e => setEditing(v => ({ ...v, status: e.target.value as PlanStatus }))}>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="sold_out">Agotado</option>
                </select>
              </Field>
              <Field label="Destacado">
                <select className={inputCls} value={editing.highlight ? "1" : "0"} onChange={e => setEditing(v => ({ ...v, highlight: e.target.value === "1" }))}>
                  <option value="0">No</option>
                  <option value="1">Sí (resaltado)</option>
                </select>
              </Field>
              <Field label="Texto del botón">
                <input className={inputCls} value={editing.cta_text ?? ""} onChange={e => setEditing(v => ({ ...v, cta_text: e.target.value }))} />
              </Field>
              <Field label="Link del botón">
                <input className={inputCls} value={editing.cta_link ?? ""} onChange={e => setEditing(v => ({ ...v, cta_link: e.target.value }))} />
              </Field>
            </div>
            <Field label="Features (una por línea)">
              <textarea rows={5} className={inputCls}
                value={(editing.features ?? []).join("\n")}
                onChange={e => setEditing(v => ({ ...v, features: e.target.value.split("\n") }))}
              />
            </Field>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
              <button onClick={save} disabled={saving} className="px-5 py-2 rounded-lg text-sm font-bold text-white hover:opacity-90 disabled:opacity-50" style={{ background: "#f97316" }}>
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {plans.map(p => (
          <div key={p.id} className="rounded-xl p-4 flex flex-col gap-2" style={{ background: "#0f0f0f", border: p.highlight ? "1px solid #f97316" : "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold">{p.name}</h3>
                <span className="text-2xl font-bold text-white">${p.price}<span className="text-sm font-normal text-gray-400">/mes</span></span>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <ul className="text-xs text-gray-400 flex flex-col gap-1 flex-1">
              {p.features.map((f, i) => <li key={i}>• {f}</li>)}
            </ul>
            <div className="flex gap-1.5 pt-2 border-t border-white/[0.05]">
              <button onClick={() => setEditing(p)} className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white hover:opacity-80" style={{ background: "#f97316" }}>Editar</button>
              <button onClick={() => remove(p.id)} className="py-1.5 px-3 rounded-lg text-xs text-gray-500 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

// ─── Media Section ────────────────────────────────────────────────────────────
type MediaKey = "browser_video_url" | "browser_image_url";

const MediaUploader = ({
  label, icon: Icon, settingKey, accept, currentUrl, onUploaded,
}: {
  label: string;
  icon: React.ElementType;
  settingKey: MediaKey;
  accept: string;
  currentUrl: string;
  onUploaded: (url: string) => void;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setUploading(true); setError("");
    const ext = file.name.split(".").pop();
    const path = `${settingKey}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("media").upload(path, file, { upsert: true });
    if (upErr) { setError(upErr.message); setUploading(false); return; }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    await supabase.from("site_settings").upsert({ key: settingKey, value: data.publicUrl }, { onConflict: "key" });
    onUploaded(data.publicUrl);
    setUploading(false);
  };

  const remove = async () => {
    await supabase.from("site_settings").upsert({ key: settingKey, value: "" }, { onConflict: "key" });
    onUploaded("");
  };

  const isVideo = accept.includes("video");
  const hasMedia = !!currentUrl;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] text-gray-500 font-medium uppercase tracking-wide flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" /> {label}
      </label>

      {hasMedia ? (
        <div className="relative rounded-xl overflow-hidden bg-[#0f0f0f] border border-white/[0.08]">
          {isVideo
            ? <video src={currentUrl} controls muted className="w-full max-h-40 object-contain" />
            : <img src={currentUrl} alt={label} className="w-full max-h-40 object-contain" />
          }
          <button
            onClick={remove}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="px-3 py-1.5 text-[10px] text-gray-500 truncate">{currentUrl}</div>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed transition-colors disabled:opacity-50"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "#0f0f0f" }}
        >
          {uploading
            ? <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" />
            : <Upload className="w-5 h-5 text-gray-500" />
          }
          <span className="text-[12px] text-gray-500">
            {uploading ? "Subiendo..." : `Seleccionar ${isVideo ? "video" : "imagen"}`}
          </span>
        </button>
      )}

      {error && <p className="text-red-400 text-[11px]">{error}</p>}

      <input ref={fileRef} type="file" accept={accept} className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); }} />

      {!hasMedia && (
        <p className="text-[10px] text-gray-600">
          O pega una URL directamente en Configuración del Sitio
        </p>
      )}
    </div>
  );
};

const MediaSection = ({ settings, onRefresh }: { settings: Record<string, string>; onRefresh: () => void }) => {
  const [videoUrl, setVideoUrl] = useState(settings["browser_video_url"] ?? "");
  const [imageUrl, setImageUrl] = useState(settings["browser_image_url"] ?? "");

  useEffect(() => {
    setVideoUrl(settings["browser_video_url"] ?? "");
    setImageUrl(settings["browser_image_url"] ?? "");
  }, [settings]);

  const handleUploaded = (key: MediaKey, url: string) => {
    if (key === "browser_video_url") setVideoUrl(url);
    else setImageUrl(url);
    onRefresh();
  };

  return (
    <Section title="Media — Video e Imágenes">
      <div className="grid sm:grid-cols-2 gap-5">
        <MediaUploader
          label="Video del Browser (MP4/WebM)"
          icon={Film}
          settingKey="browser_video_url"
          accept="video/mp4,video/webm"
          currentUrl={videoUrl}
          onUploaded={url => handleUploaded("browser_video_url", url)}
        />
        <MediaUploader
          label="Imagen del Browser (JPG/PNG/WebP)"
          icon={ImageIcon}
          settingKey="browser_image_url"
          accept="image/jpeg,image/png,image/webp,image/gif"
          currentUrl={imageUrl}
          onUploaded={url => handleUploaded("browser_image_url", url)}
        />
      </div>
      <p className="text-[11px] text-gray-600 mt-3">
        El video tiene prioridad sobre la imagen. Tamaño máximo: 50MB.
        Requiere bucket "media" en Supabase Storage (ejecuta create-bucket.mjs si aún no lo hiciste).
      </p>
    </Section>
  );
};

// ─── Settings Section ─────────────────────────────────────────────────────────
const SettingsSection = ({ settings, onRefresh }: { settings: Record<string, string>; onRefresh: () => void }) => {
  const [vals, setVals] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setVals(settings); }, [settings]);

  const save = async () => {
    setSaving(true);
    const updates = Object.entries(vals).map(([key, value]) =>
      supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" })
    );
    await Promise.all(updates);
    setSaving(false); onRefresh();
  };

  const s = (key: string) => ({ value: vals[key] ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setVals(v => ({ ...v, [key]: e.target.value })) });

  return (
    <Section title="Configuración del Sitio">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Banner — Texto">
          <input className={inputCls} {...s("banner_text")} placeholder="🎉 3 días gratis sin tarjeta..." />
        </Field>
        <Field label="Banner — Link">
          <input className={inputCls} {...s("banner_link")} placeholder="https://..." />
        </Field>
        <Field label="Banner — Visible">
          <select className={inputCls} value={vals["banner_visible"] ?? "true"} onChange={e => setVals(v => ({ ...v, banner_visible: e.target.value }))}>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </Field>
        <Field label="CTA Principal — Texto">
          <input className={inputCls} {...s("cta_text")} placeholder="Comenzar gratis — 3 días" />
        </Field>
        <Field label="CTA Principal — Link">
          <input className={inputCls} {...s("cta_link")} placeholder="https://app.shadowscale.pro/register" />
        </Field>
        <Field label="Price Card — Total acumulado">
          <input className={inputCls} {...s("price_card_total")} placeholder="$1,453" />
        </Field>
        <Field label="Price Card — Precio mensual">
          <input className={inputCls} {...s("price_card_monthly")} placeholder="$14.9" />
        </Field>
        <Field label="Footer — Copyright">
          <input className={inputCls} {...s("footer_copyright")} placeholder="© 2025 ShadowScale" />
        </Field>
        <Field label="Herramientas — Título sección">
          <input className={inputCls} {...s("tools_title")} placeholder="Tu arsenal de herramientas premium 🛠️" />
        </Field>
        <Field label="Herramientas — Subtítulo">
          <input className={inputCls} {...s("tools_subtitle")} placeholder="Todas con inicio de sesión instantáneo..." />
        </Field>
        <Field label="Browser — Título">
          <input className={inputCls} {...s("browser_title")} placeholder="Descarga la aplicación" />
        </Field>
        <Field label="Browser — Descripción">
          <textarea className={inputCls} {...s("browser_desc")} rows={2} placeholder="ShadowScale Browser es un navegador..." />
        </Field>
        <Field label="Browser — Texto del botón">
          <input className={inputCls} {...s("browser_download_text")} placeholder="Descargar aquí" />
        </Field>
        <Field label="Browser — Link de descarga">
          <input className={inputCls} {...s("browser_download_link")} placeholder="https://app.shadowscale.pro/download" />
        </Field>
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={save} disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          style={{ background: "#f97316" }}>
          {saving ? "Guardando..." : "Guardar configuración"}
        </button>
      </div>
    </Section>
  );
};

// ─── Main Admin ───────────────────────────────────────────────────────────────
const AdminPanel = () => {
  const { tools, categories, plans, settings, loading, error, refetch } = useSiteData();

  const logout = () => { localStorage.removeItem("ss_admin"); window.location.reload(); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <div className="flex items-center gap-3 text-gray-400">
        <RefreshCw className="w-4 h-4 animate-spin" /> Cargando...
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#0a0a0a" }}>
      <div className="max-w-md w-full rounded-2xl p-6 text-center" style={{ background: "#161618", border: "1px solid rgba(239,68,68,0.3)" }}>
        <p className="text-red-400 font-medium mb-2">Error de conexión</p>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <p className="text-gray-600 text-xs">Asegúrate de haber configurado las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Vercel.</p>
        <button onClick={refetch} className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "#f97316" }}>
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b flex items-center justify-between px-6 py-3"
        style={{ background: "#0a0a0a", borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3">
          <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-6 w-auto" />
          <span className="text-gray-500 text-sm">Admin CMS</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refetch} className="p-2 text-gray-500 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <a href="/" target="_blank" className="p-2 text-gray-500 hover:text-white transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
          <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white transition-colors hover:bg-white/[0.05]">
            <LogOut className="w-3.5 h-3.5" /> Salir
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4">
        <MediaSection settings={settings} onRefresh={refetch} />
        <SettingsSection settings={settings} onRefresh={refetch} />
        <PlansSection plans={plans} onRefresh={refetch} />
        <CategoriesSection categories={categories} onRefresh={refetch} />
        <ToolsSection tools={tools} categories={categories} onRefresh={refetch} />
      </div>
    </div>
  );
};

// ─── Export ───────────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(() => localStorage.getItem("ss_admin") === "1");
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <AdminPanel />;
}
