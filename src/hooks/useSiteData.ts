import { useEffect, useState } from "react";
import { supabase, Tool, Category, Plan, SiteSettings } from "@/lib/supabase";

export interface SiteData {
  tools: Tool[];
  categories: Category[];
  plans: Plan[];
  settings: Record<string, string>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSiteData(): SiteData {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const [t, c, p, s] = await Promise.all([
        supabase.from("tools").select("*").order("sort_order"),
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("plans").select("*").order("sort_order"),
        supabase.from("site_settings").select("*"),
      ]);
      if (t.error) throw t.error;
      if (c.error) throw c.error;
      if (p.error) throw p.error;
      if (s.error) throw s.error;
      setTools(t.data ?? []);
      setCategories(c.data ?? []);
      setPlans(p.data ?? []);
      const settingsMap: Record<string, string> = {};
      (s.data as SiteSettings[])?.forEach((r) => { settingsMap[r.key] = r.value; });
      setSettings(settingsMap);
    } catch (e: any) {
      setError(e.message ?? "Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return { tools, categories, plans, settings, loading, error, refetch: fetch };
}
