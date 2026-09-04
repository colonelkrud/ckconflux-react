import { useEffect, useState } from 'react';
import { FOUNDRY_SERVERS, FOUNDRY_STATUS_ENDPOINT } from '../config/foundry';
import { parseFoundryStatus } from './foundryStatus';

const initialStatuses = Object.freeze(Object.fromEntries(FOUNDRY_SERVERS.map(({ id }) => [id, 'checking'])));
const unavailableStatuses = Object.freeze(Object.fromEntries(FOUNDRY_SERVERS.map(({ id }) => [id, 'unknown'])));

export function useFoundryStatus({ timeoutMs = 8000 } = {}) {
  const [statuses, setStatuses] = useState(initialStatuses);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let active = true;
    async function checkStatus() {
      try {
        const response = await fetch(FOUNDRY_STATUS_ENDPOINT, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        const payload = await response.json();
        if (active) setStatuses(parseFoundryStatus(payload));
      } catch {
        if (active) setStatuses(unavailableStatuses);
      } finally {
        clearTimeout(timeout);
      }
    }
    checkStatus();
    return () => { active = false; controller.abort(); clearTimeout(timeout); };
  }, [timeoutMs]);

  return statuses;
}
