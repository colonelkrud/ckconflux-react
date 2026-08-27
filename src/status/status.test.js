import { describe, expect, it } from 'vitest';
import { parseStatus } from './status';

describe('status payload normalization', () => {
  it('keeps Matrix messaging and MatrixRTC call health distinct', () => {
    const parsed = parseStatus({
      components: {
        matrix: 'up',
        matrixrtc: 'degraded',
      },
    });

    expect(parsed.overall).toBe('degraded');
    expect(parsed.components).toEqual([
      { name: 'Matrix messaging', state: 'operational' },
      { name: 'Voice / video calls', state: 'degraded' },
    ]);
  });

  it('includes unknown components in the aggregate instead of dropping them', () => {
    const parsed = parseStatus({
      components: {
        website: 'up',
        bridgeService: 'down',
      },
    });

    expect(parsed.overall).toBe('unavailable');
    expect(parsed.components).toContainEqual({ name: 'Bridge Service', state: 'unavailable' });
  });

  it('normalizes the production login check and TeamSpeak component', () => {
    const parsed = parseStatus({
      checks: {
        login: 'ok',
        teamspeak: 'degraded',
      },
    });

    expect(parsed.overall).toBe('degraded');
    expect(parsed.components).toEqual([
      { name: 'Sign-in / authentication', state: 'operational' },
      { name: 'TeamSpeak', state: 'degraded' },
    ]);
  });
});
