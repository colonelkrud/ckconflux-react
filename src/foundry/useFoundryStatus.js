import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FOUNDRY_SERVERS,
  FOUNDRY_STATUS_ENDPOINT,
  FOUNDRY_STATUS_POLL_INTERVAL_MS,
  FOUNDRY_STATUS_TIMEOUT_MS,
} from '../config/foundry';
import { parseFoundryStatus } from './foundryStatus';

const initialStatuses = Object.freeze(Object.fromEntries(FOUNDRY_SERVERS.map(({ id }) => [id, 'checking'])));
const unavailableStatuses = Object.freeze(Object.fromEntries(FOUNDRY_SERVERS.map(({ id }) => [id, 'unknown'])));

export function useFoundryStatus({
  pollIntervalMs = FOUNDRY_STATUS_POLL_INTERVAL_MS,
  timeoutMs = FOUNDRY_STATUS_TIMEOUT_MS,
} = {}) {
  const [statuses, setStatuses] = useState(initialStatuses);
  const mounted = useRef(false);
  const activeController = useRef(null);

  const refresh = useCallback(async () => {
    // Aborting first makes an explicit refresh safe even if a previous request hung.
    activeController.current?.abort();
    const controller = new AbortController();
    activeController.current = controller;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(FOUNDRY_STATUS_ENDPOINT, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Foundry status request failed (${response.status})`);
      const parsed = parseFoundryStatus(await response.json());
      if (mounted.current && activeController.current === controller) setStatuses(parsed);
    } catch {
      if (mounted.current && activeController.current === controller) {
        // Health is advisory: failed monitoring is unknown, never an inferred outage.
        setStatuses(unavailableStatuses);
      }
    } finally {
      clearTimeout(timeout);
      if (activeController.current === controller) activeController.current = null;
    }
  }, [timeoutMs]);

  useEffect(() => {
    mounted.current = true;
    refresh();
    const interval = pollIntervalMs > 0 ? setInterval(refresh, pollIntervalMs) : null;
    return () => {
      mounted.current = false;
      activeController.current?.abort();
      activeController.current = null;
      if (interval) clearInterval(interval);
    };
  }, [pollIntervalMs, refresh]);

  return statuses;
}
