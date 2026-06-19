import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL    = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SVC_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

  // Solo headers de infraestructura confiable (Cloudflare/proxy verificado).
  // x-forwarded-for es spoofeable por el cliente → ignorado.
  const ip = req.headers.get("cf-connecting-ip")
    ?? req.headers.get("x-real-ip")
    ?? "unknown";

  const supabase = createClient(SUPABASE_URL, SUPABASE_SVC_KEY);

  // Try insert (ignores if already exists due to PRIMARY KEY conflict)
  await supabase.from("promo_sessions").insert({ ip }).catch(() => null);

  const { data: record } = await supabase
    .from("promo_sessions")
    .select("started_at")
    .eq("ip", ip)
    .maybeSingle();

  return json({ started_at: record?.started_at ?? new Date().toISOString() });
});
