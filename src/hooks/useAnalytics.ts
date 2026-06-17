import { useEffect, useRef } from 'react';
import { initVisit, trackEvent } from '@/lib/analytics';

export function useAnalytics() {
  const vidRef = useRef<string | null>(null);

  useEffect(() => {
    initVisit()
      .then(id => {
        vidRef.current = id;
        trackEvent(id, 'inicio').catch(() => {});
      })
      .catch(() => {});

    const milestones = new Set<number>();
    const handleScroll = () => {
      if (!vidRef.current) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = Math.round((window.scrollY / total) * 100);
      for (const m of [25, 50, 75, 100]) {
        if (pct >= m && !milestones.has(m)) {
          milestones.add(m);
          trackEvent(vidRef.current!, 'scroll', `${m}%`).catch(() => {});
        }
      }
    };

    const handleVisibility = () => {
      if (vidRef.current) {
        trackEvent(vidRef.current, 'pestaña', document.hidden ? 'oculta' : 'visible').catch(() => {});
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const track = (event: string, value?: string) => {
    if (vidRef.current) trackEvent(vidRef.current, event, value).catch(() => {});
  };

  return { track };
}
