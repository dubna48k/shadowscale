interface TopBannerProps {
  settings?: Record<string, string>;
}

const TopBanner = ({ settings = {} }: TopBannerProps) => {
  const visible = settings["banner_visible"] === "true";
  if (!visible) return null;

  const text = settings["banner_text"] ?? "Prueba 1 día gratis — Sin tarjeta de crédito";
  const link = settings["banner_link"] ?? "#";

  const content = (
    <span className="text-[12px] sm:text-[13px] font-semibold text-white">{text}</span>
  );

  return (
    <div className="w-full py-2 text-center border-b border-white/[0.06]" style={{ background: "linear-gradient(90deg, #f97316, #ea580c)" }}>
      {link && link !== "#"
        ? <a href={link} className="hover:underline">{content}</a>
        : content
      }
    </div>
  );
};

export default TopBanner;
