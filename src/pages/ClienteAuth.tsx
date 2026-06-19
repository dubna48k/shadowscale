import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const inputCls = "w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500/50 transition-colors placeholder:text-gray-600";
const labelCls = "text-gray-400 text-xs font-medium";

const ClienteAuth = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/cuenta";
  const modeParam = params.get("mode");

  const [mode, setMode] = useState<"login" | "register" | "forgot">(modeParam === "register" ? "register" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(redirect, { replace: true });
    });
  }, []);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/cuenta/reset-password`,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setResetSent(true);
  };

  const handleGoogle = async () => {
    setLoadingGoogle(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${redirect}` },
    });
    if (err) { setError(err.message); setLoadingGoogle(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "register") {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) { setError(err.message); setLoading(false); return; }
      setSent(true);
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError(err.message === "Invalid login credentials" ? "Correo o contraseña incorrectos" : err.message); setLoading(false); return; }
      navigate(redirect, { replace: true });
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0a0a0a" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center flex flex-col gap-5"
        >
          <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-10 w-auto mx-auto opacity-80" />
          <div className="rounded-2xl p-8 flex flex-col gap-3" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="text-3xl mb-1">📬</div>
            <h2 className="text-white font-bold text-lg">Revisa tu correo</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Te enviamos un link de confirmación a <span className="text-white">{email}</span>. Confírmalo y vuelve aquí para continuar.
            </p>
            <button onClick={() => setMode("login")}
              className="mt-2 text-sm text-orange-400 hover:text-orange-300 transition-colors">
              Ya confirmé → Iniciar sesión
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0a0a0a" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm flex flex-col gap-6"
      >
        <div className="flex justify-center">
          <Link to="/">
            <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Tabs — ocultar en modo forgot */}
          {mode !== "forgot" && (
            <div className="flex rounded-xl overflow-hidden" style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}>
              {(["login", "register"] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setError(""); setResetSent(false); }}
                  className="flex-1 py-2.5 text-sm font-semibold transition-colors"
                  style={{ background: mode === m ? "#f97316" : "transparent", color: mode === m ? "#fff" : "#6b7280" }}>
                  {m === "login" ? "Iniciar sesión" : "Crear cuenta"}
                </button>
              ))}
            </div>
          )}

          {/* Pantalla recuperar contraseña */}
          {mode === "forgot" && (
            resetSent ? (
              <div className="flex flex-col items-center gap-3 text-center py-2">
                <div className="text-3xl">📬</div>
                <p className="text-white font-semibold">Revisa tu correo</p>
                <p className="text-gray-400 text-sm">Te enviamos un enlace para restablecer tu contraseña a <span className="text-white">{email}</span>.</p>
                <button onClick={() => { setMode("login"); setResetSent(false); setError(""); }}
                  className="text-sm text-orange-400 hover:text-orange-300 mt-2">← Volver al login</button>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="flex flex-col gap-4">
                <div>
                  <p className="text-white font-semibold mb-1">Recuperar contraseña</p>
                  <p className="text-gray-500 text-xs">Te enviaremos un enlace para crear una nueva contraseña.</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Correo electrónico</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="tu@correo.com" className={inputCls} autoComplete="email" />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-xs py-2 px-3 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                  </div>
                )}
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                  style={{ background: "#f97316" }}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Enviar enlace
                </button>
                <button type="button" onClick={() => { setMode("login"); setError(""); }}
                  className="text-center text-xs text-gray-600 hover:text-gray-400">← Volver</button>
              </form>
            )
          )}

          {/* Google — solo en login/register */}
          {mode !== "forgot" && <button type="button" onClick={handleGoogle} disabled={loadingGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
            style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}>
            {loadingGoogle ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
            Continuar con Google
          </button>}

          {mode !== "forgot" && <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <span className="text-gray-600 text-xs">o</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>}

          {mode !== "forgot" && <AnimatePresence mode="wait">
            <motion.form key={mode} onSubmit={handleSubmit}
              initial={{ opacity: 0, x: mode === "login" ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Correo electrónico</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com" className={inputCls} autoComplete="email" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Contraseña{mode === "register" && " (mínimo 8 caracteres)"}</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} required minLength={8}
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" className={inputCls + " pr-11"} autoComplete={mode === "login" ? "current-password" : "new-password"} />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs py-2 px-3 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
                style={{ background: "#f97316" }}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {mode === "login" ? "Entrar" : "Crear cuenta"}
              </button>

              {mode === "login" && (
                <div className="flex flex-col gap-2 text-center">
                  <button type="button" onClick={() => { setMode("forgot"); setError(""); }}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </button>
                  <p className="text-xs text-gray-600">
                    ¿No tienes cuenta?{" "}
                    <button type="button" onClick={() => { setMode("register"); setError(""); }}
                      className="text-orange-400 hover:text-orange-300">
                      Regístrate
                    </button>
                  </p>
                </div>
              )}
            </motion.form>
          </AnimatePresence>}
        </div>

        <p className="text-center text-xs text-gray-700">
          Al continuar aceptas nuestros{" "}
          <Link to="/terminos" className="text-gray-500 hover:text-gray-400">Términos</Link>{" "}y{" "}
          <Link to="/politica" className="text-gray-500 hover:text-gray-400">Política de privacidad</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ClienteAuth;
