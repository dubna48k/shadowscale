import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string ?? "https://placeholder.supabase.co";
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string ?? "placeholder";

export const supabase = createClient(url, key);
export const supabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export type ToolStatus = "active" | "inactive" | "sold_out" | "coming_soon";
export type BadgeType = "nuevo" | "prueba" | null;
export type PlanStatus = "active" | "inactive" | "sold_out";

export interface Tool {
  id: string;
  name: string;
  category_id: string;
  color: string;
  initial: string;
  domain: string | null;
  logo_url: string | null;
  badge: BadgeType;
  note: string | null;
  individual_price: number;
  status: ToolStatus;
  sort_order: number;
  created_at: string;
}

export interface Category {
  id: string;
  label: string;
  sort_order: number;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  status: PlanStatus;
  features: string[];
  highlight: boolean;
  cta_text: string;
  cta_link: string;
  sort_order: number;
  subtitle: string | null;
  old_price: string | null;
  discount: string | null;
  top_badge: string | null;
  slots_left: number | null;
}

export interface Affiliate {
  id: string;
  user_id: string;
  code: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  commission_rate: number;
  payout_method: string | null;
  payout_details: string | null;
  created_at: string;
}

export interface Referral {
  id: string;
  affiliate_id: string;
  visitor_ip: string | null;
  status: "click" | "signup" | "converted";
  amount: number | null;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
}
