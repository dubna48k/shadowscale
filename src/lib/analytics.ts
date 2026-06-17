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

export async function initVisit(): Promise<string> {
  const existing = sessionStorage.getItem(VISIT_KEY);
  if (existing) return existing;

  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  sessionStorage.setItem(VISIT_KEY, id);

  const params = new URLSearchParams(window.location.search);
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
