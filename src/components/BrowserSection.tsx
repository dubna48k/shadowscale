import { motion } from "framer-motion";
import { Download, Monitor, KeyRound, Zap } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const features = [
  { icon: Monitor, title: "Navegador de escritorio", desc: "Disponible para Windows y macOS. Instálalo en segundos." },
  { icon: KeyRound, title: "Sin contraseñas", desc: "Inicio de sesión instantáneo en todas las herramientas." },
  { icon: Zap, title: "Acceso inmediato", desc: "Abre cualquier herramienta premium con un solo clic." },
];

const BrowserSection = () => {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <motion.div
        className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 sm:p-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={spring}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
            <Download className="w-5 h-5 text-coral" />
          </div>
          <h2 className="text-xl font-bold text-white">Descarga la aplicación</h2>
        </div>

        <p className="text-[14px] text-gray-400 mb-8 max-w-lg">
          ScalPass Browser es un navegador de escritorio para Windows y macOS que te permite acceder a más de 50 herramientas premium con inicio de sesión instantáneo y sin contraseñas. La prueba gratuita de 3 días comienza al iniciar sesión, no al descargar.
        </p>

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
