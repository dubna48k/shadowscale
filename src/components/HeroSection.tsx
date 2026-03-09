import { motion } from "framer-motion";
import { Download, Users, TrendingUp } from "lucide-react";

const spring = { type: "spring", stiffness: 100, damping: 20 };

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-24 pb-16">
      {/* Mesh glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 mb-8 text-sm text-muted-foreground">
            <Users className="w-4 h-4 text-accent" />
            <span className="text-savings-foreground font-semibold">1,634</span>
            <span>miembros ahorrando</span>
            <span className="text-savings-foreground font-semibold">$2,221+/mes</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
        >
          Desbloquea más de{" "}
          <span className="text-primary">50 herramientas</span>{" "}
          premium
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.3 }}
        >
          Accede a más de <span className="text-foreground font-semibold">$2,000</span> en herramientas por solo{" "}
          <span className="text-primary font-bold text-2xl">$29/mes</span>
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.4 }}
        >
          <button className="glow-button inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-2xl text-lg font-semibold hover:brightness-110 transition-all duration-300 shadow-lg shadow-primary/25">
            <Download className="w-5 h-5" />
            Descargar (3 días gratis)
          </button>
          <p className="text-xs text-muted-foreground">
            La prueba comienza al iniciar sesión, no al descargar
          </p>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-8 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {[
            { icon: TrendingUp, label: "Windows & macOS" },
            { icon: Users, label: "Sin contraseñas" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <item.icon className="w-4 h-4 text-primary" />
              <span>{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
