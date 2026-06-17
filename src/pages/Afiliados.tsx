import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { useSiteData } from "@/hooks/useSiteData";
import { DollarSign, Users, Link2, TrendingUp, ArrowUpRight, CheckCircle2 } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const Afiliados = () => {
  const { settings } = useSiteData();
  const commission = settings["affiliate_commission"] ?? "30";
  const minPayout = settings["affiliate_min_payout"] ?? "$50";
  const refLink = settings["affiliate_ref_base"] ?? "https://shadowscale.pro/?ref=TU_CÓDIGO";
  const applyLink = settings["affiliate_apply_link"] ?? "mailto:afiliados@shadowscale.pro";
  const intro = settings["affiliate_intro"] ?? "Gana dinero recurrente recomendando ShadowScale. Sin inventario, sin inversión.";

  const steps = [
    { n: "01", title: "Regístrate", desc: "Envíanos tu solicitud. Aprobamos en menos de 48h.", icon: Users },
    { n: "02", title: "Comparte tu link", desc: "Recibe tu URL única y compártela donde quieras.", icon: Link2 },
    { n: "03", title: "Genera comisiones", desc: `Gana el ${commission}% de cada suscripción que refiereas, mes tras mes.`, icon: TrendingUp },
    { n: "04", title: "Cobra", desc: `Retira cuando alcances ${minPayout}. Pagamos por transferencia o crypto.`, icon: DollarSign },
  ];

  const perks = [
    `${commission}% de comisión recurrente`,
    "Panel de seguimiento en tiempo real",
    "Materiales de marketing listos",
    "Pagos puntuales cada mes",
    "Soporte dedicado para afiliados",
    "Sin límite de referidos",
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/10 blur-[100px] rounded-full" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)", color: "#fb923c" }}
          >
            <DollarSign className="w-4 h-4" />
            Programa de Afiliados
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.05 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight"
          >
            Gana el <span style={{ color: "#f97316" }}>{commission}%</span> por cada<br />referido que se quede
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
            className="text-gray-400 text-lg mb-8 max-w-xl mx-auto"
          >
            {intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <a
              href={applyLink}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white text-base transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "#f97316", boxShadow: "0 0 32px rgba(249,115,22,0.35)" }}
            >
              Aplicar ahora
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="#como-funciona"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-gray-300 text-base transition-all hover:text-white"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Cómo funciona
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Comisión", value: `${commission}%`, sub: "Recurrente mensual" },
            { label: "Mínimo retiro", value: minPayout, sub: "Sin fecha límite" },
            { label: "Aprobación", value: "< 48h", sub: "Proceso rápido" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.08 }}
              className="rounded-2xl p-5 text-center"
              style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-white text-sm font-semibold mb-0.5">{s.label}</div>
              <div className="text-gray-600 text-xs">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-10">Cómo funciona</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.08 }}
              className="rounded-2xl p-6 flex gap-4"
              style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="shrink-0 text-[11px] font-black text-orange-400 opacity-60 mt-0.5">{step.n}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <step.icon className="w-4 h-4 text-orange-400" />
                  <h3 className="text-white font-bold">{step.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Perks + CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row gap-8 items-start"
          style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.08), rgba(0,0,0,0) 60%), #161618", border: "1px solid rgba(249,115,22,0.2)" }}>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-5">Todo lo que incluye</h2>
            <ul className="flex flex-col gap-2.5">
              {perks.map((p, i) => (
                <li key={i} className="flex items-center gap-2.5 text-gray-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink-0 flex flex-col gap-3 w-full sm:w-56">
            <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-gray-500 text-xs mb-1">Tu link de referido</p>
              <p className="text-white text-xs font-mono truncate">{refLink}</p>
            </div>
            <a
              href={applyLink}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
              style={{ background: "#f97316" }}
            >
              Aplicar al programa
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <p className="text-center text-[11px] text-gray-600">Sin costos de entrada · Cancela cuando quieras</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Afiliados;
