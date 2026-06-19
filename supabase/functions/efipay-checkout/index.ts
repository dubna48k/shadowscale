// Edge Function — Efipay Checkout
// POST /api/v1/payment/generate-payment → checkout_type: "redirect" → devuelve data.url
// Docs: https://efipay.co/docs/1.0/generate-transaction

import { createClient } from "jsr:@supabase/supabase-js@2";

const EFIPAY_API_KEY_SECRET    = Deno.env.get("EFIPAY_API_KEY") ?? "";
const EFIPAY_BRANCH_ID_SECRET  = Deno.env.get("EFIPAY_BRANCH_ID") ?? "";
const SUPABASE_URL             = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SVC_KEY         = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const EFIPAY_BASE = "https://sag.efipay.co";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

  try {
    // Autenticar usuario desde JWT
    const jwt = (req.headers.get("authorization") ?? "").replace("Bearer ", "");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SVC_KEY);
    const { data: { user }, error: authErr } = await supabase.auth.getUser(jwt);
    if (authErr || !user) return json({ error: "Debes iniciar sesión para continuar." });

    const {
      plan_name,
      plan_price,
      api_key,
      branch_id,
      currency,
      success_url,
      pending_url,
      rejected_url,
      ref_code,
    } = await req.json();

    const EFIPAY_API_KEY    = api_key    || EFIPAY_API_KEY_SECRET;
    const EFIPAY_BRANCH_ID  = branch_id || EFIPAY_BRANCH_ID_SECRET;

    if (!plan_name || !plan_price) return json({ error: "plan_name y plan_price son requeridos." });
    if (!EFIPAY_API_KEY)           return json({ error: "API Key de Efipay no configurada." });
    if (!EFIPAY_BRANCH_ID)         return json({ error: "Branch ID no configurado." });

    const webhookUrl = `${SUPABASE_URL}/functions/v1/efipay-webhook`;

    const body = {
      payment: {
        description:   `ShadowScale ${plan_name}`,
        amount:        Number(plan_price),
        currency_type: currency ?? "COP",
        checkout_type: "redirect",
      },
      office: Number(EFIPAY_BRANCH_ID),
      advanced_options: {
        has_comments: false,
        result_urls: {
          url_response_approved: success_url  ?? "https://shadowscale.pro/gracias",
          url_response_pending:  pending_url  ?? "https://shadowscale.pro/pago-pendiente",
          url_response_rejected: rejected_url ?? "https://shadowscale.pro/pago-rechazado",
          url_response_webhook:  webhookUrl,
        },
      },
    };

    const res = await fetch(`${EFIPAY_BASE}/api/v1/payment/generate-payment`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${EFIPAY_API_KEY}`,
        "Content-Type":  "application/json",
        "Accept":        "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return json({ error: data?.message ?? `Efipay error ${res.status}`, detail: data });
    }

    // Respuesta de redirect: { saved, payment_id, url }
    const checkout_url = data.url ?? null;
    const payment_id   = data.payment_id ?? null;

    if (!checkout_url) {
      return json({ error: "Efipay no devolvió URL de pago", raw: data }, 502);
    }

    // Crear suscripción pendiente ligada al payment_id
    await supabase.from("subscriptions").insert({
      user_id:          user.id,
      user_email:       user.email ?? null,
      plan_name,
      plan_price:       Number(plan_price),
      status:           "pending",
      efipay_reference: payment_id ?? `SS-${Date.now()}`,
      ref_code:         ref_code ?? null,
    });

    return json({ checkout_url, payment_id });

  } catch (err) {
    return json({ error: String(err) });
  }
});
