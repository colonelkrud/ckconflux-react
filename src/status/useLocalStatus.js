import { useEffect, useState } from 'react';
import { parseStatus, STATUS_ENDPOINT } from './status';

export function useLocalStatus() {
  const [result, setResult] = useState({ phase: 'loading', overall: 'unknown', components: [], generatedAt: null });
  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    const timer = setTimeout(() => { controller.abort(); if (mounted) setResult({ phase: 'error', overall: 'unknown', components: [], generatedAt: null }); }, 8000);
    fetch(STATUS_ENDPOINT, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((response) => { if (!response.ok) throw new Error('Status request failed'); return response.json(); })
      .then((payload) => {
        const parsed = parseStatus(payload);
        setResult(parsed ? { phase: 'ready', ...parsed } : { phase: 'error', overall: 'unknown', components: [], generatedAt: null });
      })
      .catch(() => { if (mounted && !controller.signal.aborted) setResult({ phase: 'error', overall: 'unknown', components: [], generatedAt: null }); })
      .finally(() => clearTimeout(timer));
    return () => { mounted = false; clearTimeout(timer); controller.abort(); };
  }, []);
  return result;
}
