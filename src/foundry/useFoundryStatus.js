import { useEffect, useState } from 'react';
import { FOUNDRY_SERVERS, FOUNDRY_STATUS_ENDPOINT } from '../config/foundry';
import { parseFoundryStatus } from './foundryStatus';

const initialStatuses = Object.freeze(Object.fromEntries(FOUNDRY_SERVERS.map(({ id }) => [id, 'checking'])));
const unavailableStatuses = Object.freeze(Object.fromEntries(FOUNDRY_SERVERS.map(({ id }) => [id, 'unknown'])));

export function useFoundryStatus() {
  const [statuses, setStatuses] = useState(initialStatuses);

  useEffect(() => {
    const controller = new AbortController();
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
      }
    }
    checkStatus();
    return () => { active = false; controller.abort(); };
  }, []);

  return statuses;
}
