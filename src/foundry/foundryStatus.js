import { FOUNDRY_SERVERS } from '../config/foundry';

export const FOUNDRY_STATUS = Object.freeze({
  checking: Object.freeze({ label: 'Checking', description: 'Checking live server status.' }),
  online: Object.freeze({ label: 'Online', description: 'The server is responding.' }),
  offline: Object.freeze({ label: 'Offline', description: 'The server is not responding right now.' }),
  unknown: Object.freeze({ label: 'Status unavailable', description: 'Live status is unavailable. You can still try the server.' }),
});

const unknownServers = () => Object.fromEntries(FOUNDRY_SERVERS.map(({ id }) => [id, 'unknown']));

export function parseFoundryStatus(payload) {
  const result = unknownServers();
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) || payload.stale !== false
    || !payload.servers || typeof payload.servers !== 'object' || Array.isArray(payload.servers)) return result;

  for (const { id } of FOUNDRY_SERVERS) {
    const entry = payload.servers[id];
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
    if (entry.status === 'up') result[id] = 'online';
    else if (entry.status === 'down') result[id] = 'offline';
  }
  return result;
}
