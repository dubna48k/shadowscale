import PageLayout from "@/components/PageLayout";
import { useSiteData } from "@/hooks/useSiteData";

const Terminos = () => {
  const { settings } = useSiteData();
  const content = settings["page_terminos_content"] ?? DEFAULT_CONTENT;

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-white mb-2">Términos y Condiciones</h1>
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

const DEFAULT_CONTENT = `ShadowScale es un servicio de acceso compartido a herramientas premium digitales. Al usar nuestro servicio, aceptas los presentes términos.

## 1. Uso del Servicio

ShadowScale te otorga acceso a cuentas premium compartidas de herramientas digitales como ChatGPT, Canva, CapCut, y otras. Este acceso es personal e intransferible.

## 2. Prohibiciones

No está permitido: compartir credenciales de acceso con terceros, usar las herramientas para fines ilegales, automatizar procesos masivos que afecten a otros usuarios, o intentar apropiarse de las cuentas.

## 3. Pagos y Cancelaciones

Los cobros son mensuales y se realizan al inicio de cada ciclo. Puedes cancelar en cualquier momento. No se realizan reembolsos parciales por períodos no utilizados.

## 4. Disponibilidad

Nos comprometemos a mantener el servicio disponible 24/7, pero no garantizamos disponibilidad ininterrumpida. Algunos servicios pueden estar temporalmente fuera de línea por mantenimiento de los proveedores.

## 5. Cambios en el Servicio

ShadowScale se reserva el derecho de modificar el catálogo de herramientas disponibles, los precios y estos términos con previo aviso de 7 días.

## 6. Contacto

Para cualquier consulta sobre estos términos, contacta a soporte@shadowscale.pro`;

export default Terminos;
