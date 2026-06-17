// ════════════════════════════════════════════════════════════════════════════
// Edge Function: send-email
// Envía correos transaccionales vía Resend. Desplegar con:
//   supabase functions deploy send-email
// Requiere los secrets:
//   supabase secrets set RESEND_API_KEY=re_xxx
//   supabase secrets set EMAIL_FROM="ShadowScale <no-reply@shadowscale.pro>"
// ════════════════════════════════════════════════════════════════════════════
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const EMAIL_FROM = Deno.env.get("EMAIL_FROM") ?? "ShadowScale <no-reply@shadowscale.pro>";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ─── Plantillas de correo ──────────────────────────────────────────────────────
const BRAND = "#f97316";
const wrap = (title: string, body: string) => `
<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#0a0a0a;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:28px;">
      <span style="font-size:24px;font-weight:800;color:#fff;">Shadow<span style="color:${BRAND}">Scale</span></span>
    </div>
    <div style="background:#161618;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;">
      <h1 style="color:#fff;font-size:20px;margin:0 0 16px;">${title}</h1>
      <div style="color:#a1a1aa;font-size:14px;line-height:1.7;">${body}</div>
    </div>
    <p style="text-align:center;color:#52525b;font-size:12px;margin-top:24px;">
      © ${new Date().getFullYear()} ShadowScale · <a href="https://shadowscale.pro" style="color:#71717a;">shadowscale.pro</a>
    </p>
  </div>
</body></html>`;

const btn = (text: string, href: string) =>
  `<a href="${href}" style="display:inline-block;background:${BRAND};color:#fff;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:10px;font-size:14px;margin-top:8px;">${text}</a>`;

type TemplateId = "affiliate_welcome" | "affiliate_approved" | "affiliate_commission" | "generic";

function render(template: TemplateId, data: Record<string, string>): { subject: string; html: string } {
  switch (template) {
    case "affiliate_welcome":
      return {
        subject: "Bienvenido al programa de afiliados de ShadowScale",
        html: wrap("¡Bienvenido, " + (data.name ?? "") + "! 🎉",
          `<p>Recibimos tu solicitud para el programa de afiliados. Tu cuenta está <b>en revisión</b> y te avisaremos en cuanto sea aprobada.</p>
           <p>Mientras tanto puedes entrar a tu panel:</p>${btn("Ir a mi panel", "https://shadowscale.pro/afiliados/dashboard")}`),
      };
    case "affiliate_approved":
      return {
        subject: "¡Tu cuenta de afiliado fue aprobada! 🚀",
        html: wrap("Cuenta aprobada ✅",
          `<p>Hola ${data.name ?? ""}, tu cuenta de afiliado ya está <b>activa</b>. Tu comisión es del <b>${data.rate ?? "30"}%</b> recurrente.</p>
           <p>Tu link único de referido:</p>
           <p style="background:#0a0a0a;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:12px;color:#fff;font-family:monospace;font-size:13px;word-break:break-all;">${data.link ?? ""}</p>
           ${btn("Ver mi panel", "https://shadowscale.pro/afiliados/dashboard")}`),
      };
    case "affiliate_commission":
      return {
        subject: "Nueva comisión generada 💰",
        html: wrap("¡Ganaste una comisión!",
          `<p>Un referido tuyo se convirtió. Comisión: <b>$${data.amount ?? "0"}</b>.</p>
           ${btn("Ver mis comisiones", "https://shadowscale.pro/afiliados/dashboard")}`),
      };
    default:
      return { subject: data.subject ?? "ShadowScale", html: wrap(data.title ?? "ShadowScale", data.body ?? "") };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { to, template, data } = await req.json();
    if (!to || !template) {
      return new Response(JSON.stringify({ error: "to y template son requeridos" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }
    const { subject, html } = render(template as TemplateId, data ?? {});

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
    });

    const result = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: result }), { status: res.status, headers: { ...cors, "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ ok: true, id: result.id }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
