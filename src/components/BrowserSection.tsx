import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

interface BrowserSectionProps {
  settings?: Record<string, string>;
}

const BrowserMockup = ({ videoUrl, imageUrl }: { videoUrl: string; imageUrl: string }) => {
  const hasVideo = !!videoUrl;
  const hasImage = !!imageUrl;

  return (
    <div className="relative w-full max-w-2xl mx-auto select-none">
      {/* Purple glow behind */}
      <div
        className="absolute inset-0 rounded-2xl blur-3xl opacity-30 -z-10"
        style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" }}
      />

      {/* macOS browser chrome */}
      <div
        className="rounded-xl overflow-hidden border"
        style={{
          background: "#1a1a1f",
          borderColor: "rgba(255,255,255,0.1)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-3 px-4 py-2.5"
          style={{ background: "#111114", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] text-gray-400"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="w-3 h-3 rounded-sm bg-[#f97316] flex items-center justify-center">
                <span className="text-[7px] font-black text-white">S</span>
              </div>
              ShadowScale
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="relative aspect-[16/9] bg-[#0d0d0f]">
          {hasVideo ? (
            <video
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : hasImage ? (
            <img
              src={imageUrl}
              alt="ShadowScale Browser"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            // Placeholder
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-3">
                {["#10b981","#f97316","#14b8a6","#0ea5e9","#a855f7","#ec4899","#06b6d4"].map((color, i) => (
                  <motion.div
                    key={i}
                    className="w-10 h-10 rounded-xl"
                    style={{ background: color, opacity: 0.7 }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                  />
                ))}
              </div>
              <p className="text-[12px] text-gray-600 mt-2">Sube un video o imagen desde el CMS</p>
            </div>
          )}
        </div>

        {/* Bottom sidebar hint */}
        <div
          className="flex items-center gap-2 px-4 py-2"
          style={{ background: "#111114", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex gap-1.5">
            {["#10b981","#f97316","#14b8a6","#0ea5e9","#a855f7"].map((c, i) => (
              <div key={i} className="w-5 h-5 rounded-md" style={{ background: c, opacity: 0.8 }} />
            ))}
          </div>
          <span className="text-[10px] text-gray-600 ml-1">+17 herramientas</span>
        </div>
      </div>
    </div>
  );
};

const BrowserSection = ({ settings = {} }: BrowserSectionProps) => {
  const title = settings["browser_title"] ?? "Descarga la aplicación y accede al instante";
  const desc = settings["browser_desc"] ?? "ShadowScale Browser es un navegador de escritorio para Windows y macOS que te permite acceder a todas tus herramientas premium con inicio de sesión instantáneo. Sin contraseñas, sin configuración.";
  const downloadText = settings["browser_download_text"] ?? "Descargar aquí";
  const downloadLink = settings["browser_download_link"] ?? "";
  const videoUrl = settings["browser_video_url"] ?? "";
  const imageUrl = settings["browser_image_url"] ?? "";

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left: text */}
        <motion.div
          className="flex flex-col gap-5"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={spring}
        >
          <h2 className="text-[26px] sm:text-[32px] font-bold text-white leading-tight">{title}</h2>
          <p className="text-[14px] text-gray-400 leading-relaxed">{desc}</p>

          {downloadLink && (
            <a
              href={downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "#f97316", boxShadow: "0 0 24px rgba(249,115,22,0.4)" }}
            >
              <Download className="w-4 h-4" />
              {downloadText}
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          )}

          <div className="flex items-center gap-6 pt-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-white font-bold text-[15px]">Windows & macOS</span>
              <span className="text-gray-500 text-[12px]">Compatible con ambas plataformas</span>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div className="flex flex-col gap-0.5">
              <span className="text-white font-bold text-[15px]">0 contraseñas</span>
              <span className="text-gray-500 text-[12px]">Acceso con un solo clic</span>
            </div>
          </div>
        </motion.div>

        {/* Right: browser mockup */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ...spring, delay: 0.08 }}
        >
          <BrowserMockup videoUrl={videoUrl} imageUrl={imageUrl} />
        </motion.div>
      </div>
    </section>
  );
};

export default BrowserSection;
