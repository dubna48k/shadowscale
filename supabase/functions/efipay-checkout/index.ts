// Edge Function — Efipay Checkout
// Valida plan contra BD, precio nunca viene del cliente.
// API key de Efipay solo desde secrets de Supabase.

import { createClient } from "jsr:@supabase/supabase-js@2";

const EFIPAY_API_KEY   = Deno.env.get("EFIPAY_API_KEY") ?? "";
const EFIPAY_BRANCH_ID = Deno.env.get("EFIPAY_BRANCH_ID") ?? "";
const SUPABASE_URL     = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SVC_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

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
    // 1. Autenticar usuario desde JWT
    const jwt = (req.headers.get("authorization") ?? "").replace("Bearer ", "");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SVC_KEY);
    const { data: { user }, error: authErr } = await supabase.auth.getUser(jwt);
    if (authErr || !user) return json({ error: "Debes iniciar sesión para continuar." }, 401);

    // 2. Leer SOLO el plan_name del cliente (nunca el precio)
    const { plan_name, ref_code } = await req.json();

    if (!plan_name || typeof plan_name !== "string" || plan_name.length > 50) {
      return json({ error: "plan_name inválido." }, 400);
    }

    // 3. Validar plan y precio contra la BD — el precio NUNCA viene del cliente
    const { data: plan, error: planErr } = await supabase
      .from("plans")
      .select("id, name, price, status")
      .ilike("name", plan_name.trim())
      .eq("status", "active")
      .maybeSingle();

    if (planErr || !plan) {
      return json({ error: "Plan no encontrado o inactivo." }, 400);
    }

    if (!EFIPAY_API_KEY)   return json({ error: "API Key de Efipay no configurada en secrets." }, 500);
    if (!EFIPAY_BRANCH_ID) return json({ error: "Branch ID no configurado en secrets." }, 500);

    // 4. Obtener URLs de redirección desde site_settings (no del cliente)
    const { data: settingsRows } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["efipay_success_url", "efipay_pending_url", "efipay_rejected_url", "efipay_currency"]);

    const cfg: Record<string, string> = {};
    (settingsRows ?? []).forEach((r: { key: string; value: string }) => { cfg[r.key] = r.value; });

    const webhookUrl = `${SUPABASE_URL}/functions/v1/efipay-webhook`;

    const body = {
      payment: {
        description:   `ShadowScale ${plan.name}`,
        amount:        Number(plan.price),
        currency_type: cfg["efipay_currency"] ?? "COP",
        checkout_type: "redirect",
      },
      office: Number(EFIPAY_BRANCH_ID),
      advanced_options: {
        has_comments: false,
        result_urls: {
          url_response_approved: cfg["efipay_success_url"]  || "https://shadowscale.pro/gracias",
          url_response_pending:  cfg["efipay_pending_url"]  || "https://shadowscale.pro/pago-pendiente",
          url_response_rejected: cfg["efipay_rejected_url"] || "https://shadowscale.pro/pago-rechazado",
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

    console.log("[efipay-checkout] Efipay response:", JSON.stringify(data));

    if (!res.ok) {
      return json({ error: data?.message ?? `Efipay error ${res.status}`, detail: data });
    }

    // Efipay puede devolver la URL y el ID en diferentes campos según versión
    const checkout_url = data.url ?? data.checkout_url ?? data.payment_url ?? data.data?.url ?? null;
    const payment_id   =
      data.payment_id ?? data.id ?? data.checkout_id ??
      data.data?.payment_id ?? data.data?.id ?? null;

    if (!checkout_url) {
      return json({ error: "Efipay no devolvió URL de pago", raw: data }, 502);
    }

    const efipay_ref = payment_id != null ? String(payment_id) : `SS-${Date.now()}`;

    // 5. Guardar suscripción pendiente con precio real de BD
    await supabase.from("subscriptions").insert({
      user_id:          user.id,
      user_email:       user.email ?? null,
      plan_name:        plan.name,
      plan_price:       Number(plan.price),
      status:           "pending",
      efipay_reference: efipay_ref,
      ref_code:         typeof ref_code === "string" ? ref_code.slice(0, 50) : null,
    });

    return json({ checkout_url, payment_id: efipay_ref });

  } catch (err) {
    return json({ error: String(err) }, 500);
  }
});
