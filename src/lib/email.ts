import { supabase } from "./supabase";

type EmailTemplate = "affiliate_welcome" | "affiliate_approved" | "affiliate_commission" | "generic";

// Envía un correo vía la Edge Function send-email (Resend). No bloquea: si falla, se ignora.
export async function sendEmail(to: string, template: EmailTemplate, data: Record<string, string> = {}): Promise<void> {
  try {
    await supabase.functions.invoke("send-email", { body: { to, template, data } });
  } catch (e) {
    console.warn("sendEmail failed:", e);
  }
}
