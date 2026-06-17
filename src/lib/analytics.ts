import { supabase } from './supabase';

const VISIT_KEY = 'ss_vid';

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return 'Edge';
  if (/Chrome\//.test(ua)) return 'Chrome';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Safari\//.test(ua)) return 'Safari';
  return 'Otro';
}

function getDevice(): string {
  if (/Mobi|Android/i.test(navigator.userAgent)) return 'Móvil';
  if (/Tablet|iPad/i.test(navigator.userAgent)) return 'Tablet';
  return 'Desktop';
}

interface GeoData {
  ip: string | null;
  country: string | null;
  country_code: string | null;
  city: string | null;
  region: string | null;
}

async function getGeo(): Promise<GeoData> {
  // ipapi.co devuelve IP + geolocalización en una sola llamada (gratis hasta 30k/mes)
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const d = await res.json();
      if (!d.error) {
        return {
          ip: d.ip ?? null,
          country: d.country_name ?? null,
          country_code: d.country_code ?? null,
          city: d.city ?? null,
          region: d.region ?? null,
        };
      }
    }
  } catch { /* fallthrough */ }
  // Fallback: solo IP
  try {
    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(2500) });
    const d = await res.json();
    return { ip: d.ip ?? null, country: null, country_code: null, city: null, region: null };
  } catch {
    return { ip: null, country: null, country_code: null, city: null, region: null };
  }
}

export async function initVisit(): Promise<string> {
  const existing = sessionStorage.getItem(VISIT_KEY);
  if (existing) return existing;

  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  sessionStorage.setItem(VISIT_KEY, id);

  const params = new URLSearchParams(window.location.search);
  const geo = await getGeo();

  await supabase.from('analytics_visits').insert({
    id,
    device: getDevice(),
    browser: getBrowser(),
    screen: `${screen.width}x${screen.height}`,
    lang: navigator.language,
    referrer: document.referrer || null,
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    ip: geo.ip,
    country: geo.country,
    country_code: geo.country_code,
    city: geo.city,
    region: geo.region,
  });

  return id;
}

export async function trackEvent(visitId: string, event: string, value?: string): Promise<void> {
  await supabase.from('analytics_events').insert({
    visit_id: visitId,
    event,
    value: value ?? null,
  });
}

// Registra un click de referido (?ref=CODE) y guarda el código para atribuir el signup.
export async function trackReferral(): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if (!ref) return;

  // Guarda la atribución 30 días (para asociar el registro posterior).
  try {
    localStorage.setItem('ss_ref', ref);
    localStorage.setItem('ss_ref_ts', Date.now().toString());
  } catch { /* ignore */ }

  // Registra el click una sola vez por sesión.
  if (sessionStorage.getItem('ss_ref_tracked') === ref) return;
  sessionStorage.setItem('ss_ref_tracked', ref);

  try {
    await supabase.rpc('track_referral_click', { ref_code: ref });
  } catch { /* la función ignora códigos inválidos */ }
}
