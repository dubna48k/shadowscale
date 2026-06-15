import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key);

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
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
}
