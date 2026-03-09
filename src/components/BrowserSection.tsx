import { motion } from "framer-motion";
import { Monitor, KeyRound, Zap } from "lucide-react";

const spring = { type: "spring", stiffness: 100, damping: 20 };

const features = [
  { icon: Monitor, title: "Navegador de escritorio", desc: "Disponible para Windows y macOS. Descárgalo e instálalo en segundos." },
  { icon: KeyRound, title: "Sin contraseñas", desc: "Inicio de sesión instantáneo en todas las herramientas. Sin copiar ni pegar credenciales." },
  { icon: Zap, title: "Acceso inmediato", desc: "Abre cualquier herramienta premium con un solo clic desde la interfaz del navegador." },
];

const BrowserSection = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 py-20">
      <motion.div
        className="glass p-8 sm:p-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={spring}
      >
        <h2 className="text-3xl font-bold mb-2">Scalboost Browser</h2>
        <p className="text-muted-foreground mb-10 max-w-xl">
          Un navegador dedicado que te da acceso instantáneo a todas tus herramientas premium sin necesidad de contraseñas.
        </p>

        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.1 }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default BrowserSection;
