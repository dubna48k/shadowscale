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

const CACHE_KEY = "ss_site_cache_v1";

function readCache(): Partial<SiteData> | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeCache(data: { tools: Tool[]; categories: Category[]; plans: Plan[]; settings: Record<string, string> }) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
}

export function useSiteData(): SiteData {
  const cached = readCache();

  const [tools, setTools] = useState<Tool[]>((cached?.tools as Tool[]) ?? []);
  const [categories, setCategories] = useState<Category[]>((cached?.categories as Category[]) ?? []);
  const [plans, setPlans] = useState<Plan[]>((cached?.plans as Plan[]) ?? []);
  const [settings, setSettings] = useState<Record<string, string>>((cached?.settings as Record<string, string>) ?? {});
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    if (!cached) setLoading(true);
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
      const toolsData = t.data ?? [];
      const categoriesData = c.data ?? [];
      const plansData = p.data ?? [];
      const settingsMap: Record<string, string> = {};
      (s.data as SiteSettings[])?.forEach((r) => { settingsMap[r.key] = r.value; });
      setTools(toolsData);
      setCategories(categoriesData);
      setPlans(plansData);
      setSettings(settingsMap);
      writeCache({ tools: toolsData, categories: categoriesData, plans: plansData, settings: settingsMap });
    } catch (e: any) {
      setError(e.message ?? "Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return { tools, categories, plans, settings, loading, error, refetch: fetch };
}
