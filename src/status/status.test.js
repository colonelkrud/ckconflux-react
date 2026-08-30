import { describe, expect, it } from 'vitest';
import { parseStatus } from './status';

describe('status payload normalization', () => {
  it('normalizes labels, keeps messaging and calls distinct, and uses preferred order', () => {
    const parsed = parseStatus({ components: { website: 'up', matrixrtc: 'degraded', login: 'ok', matrix: 'up', media: 'healthy', membership: 'passing' } });
    expect(parsed.overall).toBe('degraded');
    expect(parsed.components).toEqual([
      { id: 'messaging', name: 'Messaging', state: 'operational' },
      { id: 'signin', name: 'Sign in', state: 'operational' },
      { id: 'calls', name: 'Voice & video', state: 'degraded' },
      { id: 'media', name: 'Media & uploads', state: 'operational' },
      { id: 'account', name: 'Account & membership', state: 'operational' },
      { id: 'website', name: 'Website', state: 'operational' },
    ]);
  });

  it('parses the current GitOps public status contract and freshness metadata', () => {
    const parsed = parseStatus({
      status: 'ok',
      generated_at: '2026-08-30T18:00:00Z',
      snapshot_age_seconds: 12.4,
      stale: false,
      messages: [],
      checks: {
        website: 'ok',
        login: 'ok',
        matrix: 'ok',
        media: 'ok',
        calls: 'ok',
        membership: 'ok',
      },
    });

    expect(parsed.overall).toBe('operational');
    expect(parsed.stale).toBe(false);
    expect(parsed.snapshotAgeSeconds).toBe(12.4);
    expect(parsed.generatedAt).toBe('2026-08-30T18:00:00Z');
    expect(parsed.components).toHaveLength(6);
  });

  it('preserves a stale healthy snapshot instead of treating the response as fresh', () => {
    const parsed = parseStatus({
      status: 'ok',
      generated_at: '2026-08-30T18:00:00Z',
      snapshot_age_seconds: 125.2,
      stale: true,
      messages: [],
      checks: { website: 'ok', login: 'ok', matrix: 'ok', media: 'ok', calls: 'ok', membership: 'ok' },
    });

    expect(parsed.overall).toBe('operational');
    expect(parsed.stale).toBe(true);
    expect(parsed.snapshotAgeSeconds).toBe(125.2);
  });

  it('accepts the structured startup response before a snapshot exists', () => {
    const parsed = parseStatus({
      status: 'unknown',
      generated_at: null,
      snapshot_age_seconds: null,
      stale: true,
      messages: ['Status snapshot is not yet available'],
      checks: {},
    });

    expect(parsed).toMatchObject({
      overall: 'unknown',
      components: [],
      generatedAt: null,
      snapshotAgeSeconds: null,
      stale: true,
      messages: ['Status snapshot is not yet available'],
    });
  });

  it('aggregates unavailable ahead of degraded', () => {
    expect(parseStatus({ services: { matrix: 'degraded', calls: 'failed' } }).overall).toBe('unavailable');
  });

  it('honors an explicit feed-level outage over healthy component entries', () => {
    const parsed = parseStatus({ status: 'unavailable', checks: { website: 'ok', matrix: 'ok' } });
    expect(parsed.overall).toBe('unavailable');
  });

  it('keeps an explicit feed-level degraded state without escalating it to unavailable', () => {
    const parsed = parseStatus({ status: 'degraded', checks: { website: 'ok', matrix: 'ok' } });
    expect(parsed.overall).toBe('degraded');
  });

  it('includes unknown future components safely instead of dropping them', () => {
    const parsed = parseStatus({ components: { website: 'up', bridgeService: 'mystery' } });
    expect(parsed.overall).toBe('unknown');
    expect(parsed.components).toContainEqual({ id: 'other-bridgeservice', name: 'Bridge Service', state: 'unknown' });
  });

  it('uses the least healthy state when aliases describe the same category', () => {
    const parsed = parseStatus({ checks: { login: 'ok', authentication: 'down' } });
    expect(parsed.components).toEqual([{ id: 'signin', name: 'Sign in', state: 'unavailable' }]);
  });

  it('keeps an unknown alias result ahead of an operational alias result', () => {
    const parsed = parseStatus({ checks: { matrix: 'ok', synapse: 'mystery' } });
    expect(parsed.components).toEqual([{ id: 'messaging', name: 'Messaging', state: 'unknown' }]);
    expect(parsed.overall).toBe('unknown');
  });

  it('preserves recognized top-level component payloads for legacy compatibility', () => {
    const parsed = parseStatus({ website: 'up', matrix: 'degraded', generated_at: '2026-08-30T12:00:00Z' });
    expect(parsed.overall).toBe('degraded');
    expect(parsed.generatedAt).toBe('2026-08-30T12:00:00Z');
    expect(parsed.components).toEqual([
      { id: 'messaging', name: 'Messaging', state: 'degraded' },
      { id: 'website', name: 'Website', state: 'operational' },
    ]);
  });

  it('preserves health-like custom top-level states without treating metadata as components', () => {
    const parsed = parseStatus({
      website: 'up',
      bridgeService: 'down',
      generated_at: '2026-08-30T12:00:00Z',
      snapshot_age_seconds: 30,
      stale: true,
      messages: ['Legacy payload'],
    });

    expect(parsed.overall).toBe('unavailable');
    expect(parsed.components).toEqual([
      { id: 'website', name: 'Website', state: 'operational' },
      { id: 'other-bridgeservice', name: 'Bridge Service', state: 'unavailable' },
    ]);
    expect(parsed.components.map(({ id }) => id)).not.toEqual(expect.arrayContaining([
      'other-stale',
      'other-snapshotageseconds',
      'other-generatedat',
      'other-messages',
    ]));
    expect(parsed.stale).toBe(true);
    expect(parsed.snapshotAgeSeconds).toBe(30);
  });

  it('rejects JSON without meaningful component data or the current structured contract', () => {
    expect(parseStatus({ status: 'degraded', message: 'Synapse degraded' })).toBeNull();
    expect(parseStatus({ checks: {} })).toBeNull();
  });
});
