import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const inputCls = "w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500/50 transition-colors placeholder:text-gray-600";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase maneja el token de la URL automáticamente vía el evento PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Las contraseñas no coinciden."); return; }
    if (password.length < 8)  { setError("Mínimo 8 caracteres."); return; }
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(() => navigate("/cuenta"), 2500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0a0a0a" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm flex flex-col gap-6"
      >
        <div className="flex justify-center">
          <Link to="/">
            <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-10 w-auto opacity-80" />
          </Link>
        </div>

        <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.08)" }}>
          {done ? (
            <div className="flex flex-col items-center gap-3 text-center py-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              <p className="text-white font-bold text-lg">¡Contraseña actualizada!</p>
              <p className="text-gray-400 text-sm">Redirigiendo a tu cuenta...</p>
            </div>
          ) : !ready ? (
            <div className="flex flex-col items-center gap-3 text-center py-4">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              <p className="text-gray-400 text-sm">Verificando enlace...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <p className="text-white font-bold text-lg mb-1">Nueva contraseña</p>
                <p className="text-gray-500 text-xs">Elige una contraseña segura de al menos 8 caracteres.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs font-medium">Nueva contraseña</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} required minLength={8}
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" className={inputCls + " pr-11"} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs font-medium">Confirmar contraseña</label>
                <input type="password" required minLength={8}
                  value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••" className={inputCls} autoComplete="new-password" />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs py-2 px-3 rounded-xl"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                style={{ background: "#f97316" }}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Guardar nueva contraseña
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
