import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const EMAIL_FROM = Deno.env.get("EMAIL_FROM") ?? "ShadowScale <no-reply@shadowscale.pro>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type EmailTemplate = "affiliate_welcome" | "affiliate_approved" | "affiliate_commission" | "generic";

function buildHtml(title: string, body: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{background:#0a0a0a;color:#e5e5e5;font-family:sans-serif;margin:0;padding:0}
.wrap{max-width:520px;margin:40px auto;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden}
.header{background:linear-gradient(135deg,#1a0a00,#0a0a0a);padding:28px 32px;border-bottom:1px solid #222}
.logo{color:#f97316;font-size:20px;font-weight:800;letter-spacing:-0.5px}
.body{padding:32px}
h1{color:#fff;font-size:20px;margin:0 0 12px}
p{color:#aaa;line-height:1.6;margin:0 0 16px}
.btn{display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:14px}
.footer{padding:16px 32px;border-top:1px solid #1a1a1a;color:#555;font-size:12px}
</style></head><body>
<div class="wrap">
  <div class="header"><span class="logo">ShadowScale</span></div>
  <div class="body"><h1>${title}</h1>${body}</div>
  <div class="footer">© 2026 ShadowScale · Todos los derechos reservados</div>
</div></body></html>`;
}

function getTemplate(template: EmailTemplate, data: Record<string, string>) {
  const name = data.name ?? "Afiliado";
  const link = data.link ?? "https://shadowscale.pro/afiliados/dashboard";

  switch (template) {
    case "affiliate_welcome":
      return {
        subject: "Bienvenido al programa de afiliados de ShadowScale",
        html: buildHtml(
          `¡Bienvenido, ${name}!`,
          `<p>Tu solicitud para unirte al programa de afiliados de ShadowScale ha sido recibida.</p>
          <p>Revisaremos tu cuenta y te notificaremos cuando sea aprobada (generalmente en menos de 24h).</p>
          <a href="${link}" class="btn">Ver mi dashboard</a>`
        ),
      };
    case "affiliate_approved":
      return {
        subject: "Tu cuenta de afiliado fue aprobada ✅",
        html: buildHtml(
          `¡Tu cuenta fue aprobada, ${name}!`,
          `<p>Ya puedes empezar a compartir tu link de referido y ganar comisiones.</p>
          <a href="${link}" class="btn">Ir a mi dashboard →</a>`
        ),
      };
    case "affiliate_commission":
      return {
        subject: "Nueva comisión generada 💰",
        html: buildHtml(
          `Nueva comisión, ${name}`,
          `<p>Se ha registrado una nueva conversión en tu link de referido. El monto se acreditará en tu próximo pago.</p>
          <a href="${link}" class="btn">Ver detalles</a>`
        ),
      };
    default:
      return {
        subject: data.subject ?? "Mensaje de ShadowScale",
        html: buildHtml(data.title ?? "Hola", `<p>${data.message ?? ""}</p>`),
      };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, template, data = {} } = await req.json();
    if (!to || !template) {
      return new Response(JSON.stringify({ error: "Missing to or template" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { subject, html } = getTemplate(template as EmailTemplate, data);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
    });

    const result = await res.json();
    return new Response(JSON.stringify(result), {
      status: res.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
