import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const AfiliadoAuth = () => {
  const nav = useNavigate();
  const { session, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (session) nav("/afiliados/dashboard"); }, [session, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(""); setMsg("");
    if (mode === "register") {
      if (name.trim().length < 2) { setErr("Ingresa tu nombre completo"); setBusy(false); return; }
      const { error } = await signUpWithEmail(email, pw, name.trim());
      if (error) setErr(error);
      else setMsg("Revisa tu correo para confirmar tu cuenta y luego inicia sesión.");
    } else {
      const { error } = await signInWithEmail(email, pw);
      if (error) setErr(error);
    }
    setBusy(false);
  };

  const redirectTo = `${window.location.origin}/afiliados/dashboard`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0a0a0a" }}>
      <div className="absolute top-6 left-6">
        <Link to="/afiliados" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col gap-4"
        style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.08)" }}>
        <img src="/shadowscale-logo.png" alt="ShadowScale" className="h-14 w-auto mx-auto" />
        <div className="text-center">
          <h1 className="text-white text-xl font-bold">{mode === "register" ? "Únete como afiliado" : "Inicia sesión"}</h1>
          <p className="text-gray-500 text-sm mt-1">{mode === "register" ? "Gana comisiones recurrentes" : "Accede a tu panel de afiliado"}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-[11px] text-gray-600">con tu correo</span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          {mode === "register" && (
            <input type="text" placeholder="Nombre completo" value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-white/25" />
          )}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-white/25" />
          <input type="password" placeholder="Contraseña" value={pw} onChange={e => setPw(e.target.value)} required minLength={6}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-white/25" />
          {err && <p className="text-red-400 text-xs">{err}</p>}
          {msg && <p className="text-emerald-400 text-xs">{msg}</p>}
          <button type="submit" disabled={busy} className="w-full py-2.5 rounded-xl font-bold text-white text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            style={{ background: "#f97316" }}>
            {busy ? "Procesando..." : mode === "register" ? "Crear cuenta" : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          {mode === "register" ? "¿Ya tienes cuenta? " : "¿Eres nuevo? "}
          <button onClick={() => { setMode(mode === "register" ? "login" : "register"); setErr(""); setMsg(""); }}
            className="text-orange-400 font-medium hover:underline">
            {mode === "register" ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AfiliadoAuth;
