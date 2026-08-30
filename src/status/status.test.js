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

  it('preserves recognized top-level component payloads', () => {
    const parsed = parseStatus({ website: 'up', matrix: 'degraded', generated_at: '2026-08-30T12:00:00Z' });
    expect(parsed.overall).toBe('degraded');
    expect(parsed.generatedAt).toBe('2026-08-30T12:00:00Z');
    expect(parsed.components).toEqual([
      { id: 'messaging', name: 'Messaging', state: 'degraded' },
      { id: 'website', name: 'Website', state: 'operational' },
    ]);
  });

  it('rejects JSON without meaningful component data', () => {
    expect(parseStatus({ status: 'degraded', message: 'Synapse degraded' })).toBeNull();
    expect(parseStatus({ checks: {} })).toBeNull();
  });
});