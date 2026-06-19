// Edge Function — Efipay Webhook
// Recibe notificación de pago, valida firma HMAC SHA256, activa suscripción, envía email.
// Docs webhook: https://efipay.co/docs/1.0/webhook-transaction
//
// Secrets requeridos:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (auto)
//   RESEND_API_KEY
//   EFIPAY_WEBHOOK_TOKEN  (del panel Efipay → Documentación → token webhook)

import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL         = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY       = Deno.env.get("RESEND_API_KEY") ?? "";
const EFIPAY_WEBHOOK_TOKEN = Deno.env.get("EFIPAY_WEBHOOK_TOKEN") ?? "";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, signature",
};

const PLAN_DAYS: Record<string, number> = {
  starter: 30,
  pro:     30,
  elite:   30,
};

async function hmacSHA256(secret: string, data: string): Promise<string> {
  const enc  = new TextEncoder();
  const key  = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig  = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST")    return new Response("Method Not Allowed", { status: 405, headers: cors });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

  try {
    const rawBody = await req.text();

    // Validar firma HMAC SHA256 si el webhook token está configurado
    if (EFIPAY_WEBHOOK_TOKEN) {
      const receivedSig = req.headers.get("Signature") ?? req.headers.get("signature") ?? "";
      const expectedSig = await hmacSHA256(EFIPAY_WEBHOOK_TOKEN, rawBody);
      if (receivedSig !== expectedSig) {
        return json({ error: "Firma inválida" }, 401);
      }
    }

    const payload = JSON.parse(rawBody);

    // Efipay envía { transaction: {...}, checkout: {...} }
    const transaction = payload.transaction ?? payload;
    const checkout    = payload.checkout ?? {};

    // payment_id viene en checkout o en el root del payload
    const payment_id = checkout.id ?? checkout.payment_id ?? payload.payment_id ?? null;
    const status     = transaction.status ?? payload.status ?? "";

    if (!payment_id) {
      return json({ error: "No se encontró payment_id en el webhook", payload }, 400);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Buscar suscripción pendiente con ese reference
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("efipay_reference", payment_id)
      .maybeSingle();

    if (!sub) {
      // No es un error crítico — puede ser un pago no relacionado
      return json({ ok: true, note: "subscription not found", payment_id });
    }

    const isApproved = ["Aprobada", "approved", "APPROVED", "paid", "PAID"].includes(String(status));
    const isRejected = ["Rechazada", "rejected", "declined", "failed", "FAILED"].includes(String(status));
    // "Pendiente" / "pending" → ignorar, esperar siguiente webhook con estado final

    if (isApproved) {
      const planDays  = PLAN_DAYS[sub.plan_name?.toLowerCase()] ?? 30;
      const now       = new Date();
      const expiresAt = new Date(now.getTime() + planDays * 86400000);

      await supabase.from("subscriptions").update({
        status:     "active",
        starts_at:  now.toISOString(),
        expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString(),
      }).eq("id", sub.id);

      // Registrar conversión de referido si hay ref_code
      if (sub.ref_code) {
        const { data: aff } = await supabase
          .from("affiliates")
          .select("id, commission_rate, total_earnings, pending_earnings")
          .eq("code", sub.ref_code)
          .eq("status", "approved")
          .maybeSingle();
        if (aff) {
          const commission = Number(sub.plan_price) * (aff.commission_rate / 100);
          await Promise.all([
            supabase.from("referrals").insert({
              affiliate_id:    aff.id,
              subscription_id: sub.id,
              status:          "converted",
              commission_earned: commission,
            }).catch(() => null),
            supabase.from("affiliates").update({
              total_earnings:   (aff.total_earnings ?? 0) + commission,
              pending_earnings: (aff.pending_earnings ?? 0) + commission,
            }).eq("id", aff.id),
          ]);
        }
      }

      // Email de bienvenida al cliente + notificación al admin
      const { data: userData } = await supabase.auth.admin.getUserById(sub.user_id);
      const email = userData?.user?.email;
      if (RESEND_API_KEY) {
        const tasks = [];
        if (email) tasks.push(sendWelcomeEmail(email, sub.plan_name, expiresAt));
        tasks.push(sendAdminNotification(email ?? "desconocido", sub.plan_name, sub.plan_price));
        await Promise.allSettled(tasks);
      }
    } else if (isRejected) {
      await supabase.from("subscriptions").update({
        status:     "cancelled",
        updated_at: new Date().toISOString(),
      }).eq("id", sub.id);
    }
    // "Pendiente" → no hacer nada, esperar siguiente webhook

    return json({ ok: true, status, payment_id });

  } catch (err) {
    return json({ error: String(err) }, 500);
  }
});

async function sendAdminNotification(customerEmail: string, planName: string, planPrice: number) {
  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
  <tr><td align="center">
    <table width="480" cellpadding="0" cellspacing="0" style="background:#111;border-radius:16px;border:1px solid #1f1f1f;max-width:480px;width:100%;">
      <tr><td style="padding:24px 28px;border-bottom:1px solid #1a1a1a;">
        <span style="font-size:13px;font-weight:700;color:#10b981;background:rgba(16,185,129,0.1);padding:4px 10px;border-radius:20px;">💸 Nuevo pago recibido</span>
      </td></tr>
      <tr><td style="padding:24px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:12px;color:#6b7280;padding-bottom:2px;">Cliente</td>
            <td style="font-size:12px;color:#6b7280;padding-bottom:2px;text-align:right;">Plan</td>
          </tr>
          <tr>
            <td style="font-size:15px;font-weight:600;color:#fff;padding-bottom:16px;">${customerEmail}</td>
            <td style="font-size:15px;font-weight:700;color:#f97316;text-align:right;padding-bottom:16px;">${planName} · $${planPrice}/mes</td>
          </tr>
        </table>
        <a href="https://shadowscale.pro/admin" style="display:inline-block;background:#f97316;color:#fff;font-weight:700;font-size:13px;padding:10px 22px;border-radius:10px;text-decoration:none;">Ver en Admin →</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from:    "ShadowScale <noreply@shadowscale.pro>",
      to:      ["robles9301@gmail.com"],
      subject: `💸 Nuevo suscriptor: ${planName} — ${customerEmail}`,
      html,
    }),
  });
}

async function sendWelcomeEmail(email: string, planName: string, expiresAt: Date) {
  const expStr = expiresAt.toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
  <tr><td align="center">
    <table width="520" cellpadding="0" cellspacing="0" style="background:#111;border-radius:20px;border:1px solid #222;max-width:520px;width:100%;">
      <tr><td style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid #1a1a1a;">
        <span style="font-size:22px;font-weight:800;color:#fff;">Shadow<span style="color:#f97316;">Scale</span></span>
      </td></tr>
      <tr><td style="padding:32px;">
        <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fff;">¡Bienvenido al plan ${planName}! 🎉</p>
        <p style="margin:0 0 24px;font-size:14px;color:#9ca3af;line-height:1.6;">Tu suscripción está <strong style="color:#10b981;">activa</strong>. Accede ahora a todas las herramientas premium.</p>
        <div style="background:#0d0d0d;border:1px solid #1f1f1f;border-radius:14px;padding:20px;margin-bottom:24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:12px;color:#6b7280;padding-bottom:4px;">Plan</td>
              <td style="font-size:12px;color:#6b7280;padding-bottom:4px;text-align:right;">Vence el</td>
            </tr>
            <tr>
              <td style="font-size:16px;font-weight:700;color:#fff;">${planName}</td>
              <td style="font-size:14px;font-weight:600;color:#f97316;text-align:right;">${expStr}</td>
            </tr>
          </table>
        </div>
        <div style="text-align:center;margin-bottom:28px;">
          <a href="https://shadowscale.pro/cuenta" style="display:inline-block;background:#f97316;color:#fff;font-weight:700;font-size:15px;padding:14px 36px;border-radius:14px;text-decoration:none;">Ir a mi cuenta →</a>
        </div>
        <p style="margin:0;font-size:13px;color:#4b5563;text-align:center;">
          ¿Tienes dudas? <a href="https://shadowscale.pro/soporte" style="color:#f97316;text-decoration:none;">Centro de soporte</a>
        </p>
      </td></tr>
      <tr><td style="padding:20px 32px;border-top:1px solid #1a1a1a;text-align:center;">
        <p style="margin:0;font-size:11px;color:#374151;">© ${new Date().getFullYear()} ShadowScale</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from:    "ShadowScale <noreply@shadowscale.pro>",
      to:      [email],
      subject: `¡Tu plan ${planName} está activo! ⚡`,
      html,
    }),
  });
}
