import { describe, expect, it } from 'vitest';
import { parseFoundryStatus } from './foundryStatus';

const payload = (servers, extra = {}) => ({ generated_at: '2026-09-02T20:30:00Z', stale: false, servers, ...extra });

describe('Foundry status contract', () => {
  it('maps up and down while tolerating future properties', () => {
    expect(parseFoundryStatus(payload({ fvtt1: { status: 'up', latency: 12 }, fvtt2: { status: 'down' } }, { schema_version: 2 }))).toEqual({ fvtt1: 'online', fvtt2: 'offline' });
  });

  it('treats every stale snapshot as unknown', () => {
    expect(parseFoundryStatus({ ...payload({ fvtt1: { status: 'up' }, fvtt2: { status: 'up' } }), stale: true })).toEqual({ fvtt1: 'unknown', fvtt2: 'unknown' });
  });

  it.each([
    ['non-object payload', 'bad'],
    ['missing servers', { stale: false }],
    ['array servers', { stale: false, servers: [] }],
    ['invalid freshness marker', { stale: 'false', servers: { fvtt1: { status: 'up' } } }],
  ])('safely handles malformed shape: %s', (_label, value) => {
    expect(parseFoundryStatus(value)).toEqual({ fvtt1: 'unknown', fvtt2: 'unknown' });
  });

  it('maps missing servers and future status values to unknown', () => {
    expect(parseFoundryStatus(payload({ fvtt1: { status: 'maintenance' } }))).toEqual({ fvtt1: 'unknown', fvtt2: 'unknown' });
  });
});
