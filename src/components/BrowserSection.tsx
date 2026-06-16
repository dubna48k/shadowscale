import { motion } from "framer-motion";
import { Download, Monitor, KeyRound, Zap, ExternalLink } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const features = [
  { icon: Monitor, title: "Navegador de escritorio", desc: "Disponible para Windows y macOS. Instálalo en segundos." },
  { icon: KeyRound, title: "Sin contraseñas", desc: "Inicio de sesión instantáneo en todas las herramientas." },
  { icon: Zap, title: "Acceso inmediato", desc: "Abre cualquier herramienta premium con un solo clic." },
];

interface BrowserSectionProps {
  settings?: Record<string, string>;
}

const BrowserSection = ({ settings = {} }: BrowserSectionProps) => {
  const title = settings["browser_title"] ?? "Descarga la aplicación";
  const desc = settings["browser_desc"] ?? "ShadowScale Browser es un navegador de escritorio para Windows y macOS que te permite acceder a más de 12 herramientas premium con inicio de sesión instantáneo y sin contraseñas.";
  const downloadText = settings["browser_download_text"] ?? "Descargar aquí";
  const downloadLink = settings["browser_download_link"] ?? "#";

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <motion.div
        className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 sm:p-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={spring}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
            <Download className="w-5 h-5 text-coral" />
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>

        <p className="text-[14px] text-gray-400 mb-6 max-w-lg text-left mx-auto">{desc}</p>

        {downloadLink && downloadLink !== "#" && (
          <div className="flex justify-center mb-8">
            <a
              href={downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "#f97316", boxShadow: "0 0 20px rgba(249,115,22,0.35)" }}
            >
              <Download className="w-4 h-4" />
              {downloadText}
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.08 }}
            >
              <f.icon className="w-4 h-4 text-gray-400" />
              <h3 className="text-[14px] font-semibold text-white">{f.title}</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default BrowserSection;
