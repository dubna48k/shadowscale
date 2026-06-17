import PageLayout from "@/components/PageLayout";
import { useSiteData } from "@/hooks/useSiteData";

const Politica = () => {
  const { settings } = useSiteData();
  const content = settings["page_politica_content"] ?? DEFAULT_CONTENT;

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-white mb-2">Política de Privacidad</h1>
        <p className="text-gray-500 text-sm mb-10">Última actualización: junio 2025</p>
        <div className="prose prose-invert prose-sm max-w-none">
          {content.split("\n\n").map((p, i) => (
            p.startsWith("## ") ? (
              <h2 key={i} className="text-lg font-bold text-white mt-8 mb-3">{p.replace("## ", "")}</h2>
            ) : (
              <p key={i} className="text-gray-400 leading-relaxed mb-4">{p}</p>
            )
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

const DEFAULT_CONTENT = `En ShadowScale valoramos tu privacidad. Esta política explica qué datos recopilamos y cómo los utilizamos.

## 1. Datos que Recopilamos

Recopilamos: nombre, correo electrónico, dirección IP, datos de uso del servicio, y método de pago (procesado por terceros, no almacenamos datos de tarjeta).

## 2. Uso de los Datos

Usamos tus datos para: gestionar tu cuenta, procesar pagos, enviarte comunicaciones del servicio, y mejorar la plataforma. No vendemos ni compartimos tus datos personales con terceros.

## 3. Cookies

Usamos cookies para mantener tu sesión activa y analizar el uso del sitio (Microsoft Clarity, analíticas propias). Puedes desactivar las cookies en tu navegador.

## 4. Seguridad

Implementamos medidas de seguridad estándar de la industria para proteger tus datos. Sin embargo, ningún sistema es 100% seguro.

## 5. Tus Derechos

Tienes derecho a: acceder a tus datos, corregirlos, solicitar su eliminación, y oponerte a ciertos usos. Escríbenos a privacidad@shadowscale.pro.

## 6. Contacto

Para consultas sobre privacidad: privacidad@shadowscale.pro`;

export default Politica;
