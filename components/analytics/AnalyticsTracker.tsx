'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function getSessionId() {
  const key = 'gds_session_id';
  let id = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
  if (!id && typeof window !== 'undefined') {
    id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(key, id);
  }
  return id || 'anonymous';
}

export async function trackEvent(payload: Record<string, any>) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: getSessionId(), ...payload })
    });
  } catch {}
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const started = Date.now();
    trackEvent({ type: 'PAGE_VIEW', path: pathname, metadata: { query: searchParams.toString() } });

    let maxDepth = 0;
    const onScroll = () => {
      const doc = document.documentElement;
      const total = Math.max(1, doc.scrollHeight - window.innerHeight);
      maxDepth = Math.max(maxDepth, Math.round((window.scrollY / total) * 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      const duration = Math.round((Date.now() - started) / 1000);
      trackEvent({ type: 'PAGE_EXIT', path: pathname, value: duration, metadata: { maxDepth } });
    };
  }, [pathname, searchParams]);

  return null;
}
