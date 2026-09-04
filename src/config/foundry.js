export const FOUNDRY_STATUS_ENDPOINT = '/foundry-status.json';
export const FOUNDRY_STATUS_POLL_INTERVAL_MS = 45_000;
export const FOUNDRY_STATUS_TIMEOUT_MS = 8_000;

export const FOUNDRY_SERVERS = Object.freeze([
  Object.freeze({
    id: 'fvtt1',
    name: 'Server 1',
    url: 'https://fvtt1.ckconflux.com',
    schedule: Object.freeze({ day: 'Wednesday', time: '6:30 PM Eastern' }),
  }),
  Object.freeze({
    id: 'fvtt2',
    name: 'Server 2',
    url: 'https://fvtt2.ckconflux.com',
    schedule: Object.freeze({ day: 'Thursday', time: '6:30 PM Eastern' }),
  }),
]);
