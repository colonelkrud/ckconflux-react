import { useCallback, useEffect, useRef, useState } from 'react';
import { parseStatus, STATUS_ENDPOINT } from './status';

const EMPTY_RESULT = {
  phase: 'loading',
  overall: 'unknown',
  components: [],
  generatedAt: null,
  snapshotAgeSeconds: null,
  messages: [],
  checkedAt: null,
  isRefreshing: false,
  stale: false,
  refreshError: false,
  noSnapshot: false,
};

export function useLocalStatus({ refreshIntervalMs = 0, timeoutMs = 8000 } = {}) {
  const [result, setResult] = useState(EMPTY_RESULT);
  const mounted = useRef(false);
  const activeController = useRef(null);

  const refresh = useCallback(async () => {
    activeController.current?.abort();
    const controller = new AbortController();
    activeController.current = controller;
    setResult((current) => current.phase === 'ready' ? { ...current, isRefreshing: true } : { ...EMPTY_RESULT });
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(STATUS_ENDPOINT, { signal: controller.signal, headers: { Accept: 'application/json' } });
      const parsed = parseStatus(await response.json());
      if (!parsed) throw new Error('Unrecognized status payload');
      if (mounted.current && activeController.current === controller) {
        setResult({
          phase: 'ready',
          ...parsed,
          checkedAt: new Date().toISOString(),
          isRefreshing: false,
          refreshError: false,
        });
      }
    } catch {
      if (mounted.current && activeController.current === controller) {
        setResult((current) => current.phase === 'ready'
          ? { ...current, isRefreshing: false, refreshError: true }
          : { ...EMPTY_RESULT, phase: 'error', refreshError: true });
      }
    } finally {
      clearTimeout(timeout);
    }
  }, [timeoutMs]);

  useEffect(() => {
    mounted.current = true;
    refresh();
    const interval = refreshIntervalMs > 0 ? setInterval(refresh, refreshIntervalMs) : null;
    return () => {
      mounted.current = false;
      activeController.current?.abort();
      if (interval) clearInterval(interval);
    };
  }, [refresh, refreshIntervalMs]);

  return { ...result, refresh };
}
