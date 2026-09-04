import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useFoundryStatus } from './useFoundryStatus';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('useFoundryStatus', () => {
  it('uses its own endpoint and parses the initial request', async () => {
    const fetch = vi.fn().mockResolvedValue({ json: async () => ({ stale: false, servers: { fvtt1: { status: 'up' }, fvtt2: { status: 'down' } } }) });
    vi.stubGlobal('fetch', fetch);
    const { result } = renderHook(() => useFoundryStatus());
    expect(result.current).toEqual({ fvtt1: 'checking', fvtt2: 'checking' });
    await waitFor(() => expect(result.current).toEqual({ fvtt1: 'online', fvtt2: 'offline' }));
    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith('/foundry-status.json', expect.any(Object));
    expect(fetch).not.toHaveBeenCalledWith('/status.json', expect.anything());
  });

  it('turns fetch and JSON failures into advisory unknown status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    const { result } = renderHook(() => useFoundryStatus());
    await waitFor(() => expect(result.current).toEqual({ fvtt1: 'unknown', fvtt2: 'unknown' }));
  });

  it('turns a hung status request into advisory unknown status after the timeout', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn((_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    })));
    const { result } = renderHook(() => useFoundryStatus({ timeoutMs: 50 }));
    expect(result.current).toEqual({ fvtt1: 'checking', fvtt2: 'checking' });
    await act(async () => { await vi.advanceTimersByTimeAsync(51); });
    expect(result.current).toEqual({ fvtt1: 'unknown', fvtt2: 'unknown' });
  });
});
