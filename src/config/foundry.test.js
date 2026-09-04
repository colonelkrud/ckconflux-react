import { describe, expect, it } from 'vitest';
import { FOUNDRY_SERVERS, FOUNDRY_STATUS_ENDPOINT } from './foundry';

describe('Foundry configuration', () => {
  it('keeps stable destinations, schedules, and status endpoint together', () => {
    expect(FOUNDRY_STATUS_ENDPOINT).toBe('/foundry-status.json');
    expect(FOUNDRY_SERVERS).toEqual([
      expect.objectContaining({ id: 'fvtt1', url: 'https://fvtt1.ckconflux.com', schedule: { day: 'Wednesday', time: '6:30 PM Eastern' } }),
      expect.objectContaining({ id: 'fvtt2', url: 'https://fvtt2.ckconflux.com', schedule: { day: 'Thursday', time: '6:30 PM Eastern' } }),
    ]);
    expect(FOUNDRY_SERVERS.every(({ url }) => !url.includes('foundry.ckconflux.com'))).toBe(true);
  });
});
