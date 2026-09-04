import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FOUNDRY_STATUS_POLL_INTERVAL_MS, FOUNDRY_STATUS_TIMEOUT_MS } from '../config/foundry';
import { useFoundryStatus } from './useFoundryStatus';

const snapshot = (fvtt1 = 'up', fvtt2 = 'down') => ({
  generated_at: '2026-09-02T20:30:00Z',
  stale: false,
  servers: { fvtt1: { status: fvtt1 }, fvtt2: { status: fvtt2 } },
});
const response = (body, overrides = {}) => ({ ok: true, status: 200, json: async () => body, ...overrides });
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
};

const flush = async () => { await act(async () => { await Promise.resolve(); await Promise.resolve(); }); };

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('useFoundryStatus', () => {
  it('starts at Checking, uses only its same-origin endpoint, and maps up/down independently', async () => {
    const request = deferred();
    const fetch = vi.fn().mockReturnValue(request.promise);
    vi.stubGlobal('fetch', fetch);
    const { result } = renderHook(() => useFoundryStatus({ pollIntervalMs: 0 }));

    expect(result.current).toEqual({ fvtt1: 'checking', fvtt2: 'checking' });
    request.resolve(response(snapshot()));
    await waitFor(() => expect(result.current).toEqual({ fvtt1: 'online', fvtt2: 'offline' }));
    expect(fetch).toHaveBeenCalledWith('/foundry-status.json', expect.objectContaining({ signal: expect.any(AbortSignal) }));
    expect(fetch).not.toHaveBeenCalledWith('/status.json', expect.anything());
    expect(fetch.mock.calls.flat().join(' ')).not.toMatch(/fvtt[12]\.ckconflux\.com/);
  });

  it.each([
    ['request rejection', () => Promise.reject(new TypeError('network unavailable'))],
    ['HTTP failure', () => Promise.resolve(response({}, { ok: false, status: 503 }))],
    ['malformed JSON', () => Promise.resolve(response(null))],
  ])('turns %s into advisory Unknown, never Offline', async (_label, implementation) => {
    vi.stubGlobal('fetch', vi.fn(implementation));
    const { result } = renderHook(() => useFoundryStatus({ pollIntervalMs: 0 }));
    await waitFor(() => expect(result.current).toEqual({ fvtt1: 'unknown', fvtt2: 'unknown' }));
  });

  it('turns a hung request into Unknown after the bounded timeout', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn((_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    }));
    vi.stubGlobal('fetch', fetch);
    const { result } = renderHook(() => useFoundryStatus({ pollIntervalMs: 0, timeoutMs: 50 }));

    expect(result.current).toEqual({ fvtt1: 'checking', fvtt2: 'checking' });
    await act(async () => { await vi.advanceTimersByTimeAsync(51); });
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
    expect(result.current).toEqual({ fvtt1: 'unknown', fvtt2: 'unknown' });
  });

  it('polls every 45 seconds, exposes a failed refresh as Unknown, and recovers later', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn()
      .mockResolvedValueOnce(response(snapshot('up', 'up')))
      .mockRejectedValueOnce(new Error('temporary monitoring failure'))
      .mockResolvedValueOnce(response(snapshot('down', 'up')));
    vi.stubGlobal('fetch', fetch);
    const { result } = renderHook(() => useFoundryStatus());

    await flush();
    expect(result.current).toEqual({ fvtt1: 'online', fvtt2: 'online' });
    await act(async () => { await vi.advanceTimersByTimeAsync(FOUNDRY_STATUS_POLL_INTERVAL_MS); });
    expect(result.current).toEqual({ fvtt1: 'unknown', fvtt2: 'unknown' });
    await act(async () => { await vi.advanceTimersByTimeAsync(FOUNDRY_STATUS_POLL_INTERVAL_MS); });
    expect(result.current).toEqual({ fvtt1: 'offline', fvtt2: 'online' });
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(FOUNDRY_STATUS_TIMEOUT_MS).toBeLessThan(FOUNDRY_STATUS_POLL_INTERVAL_MS);
  });

  it('aborts an old request and prevents its late result from racing a newer poll', async () => {
    vi.useFakeTimers();
    const first = deferred();
    const fetch = vi.fn()
      .mockReturnValueOnce(first.promise)
      .mockResolvedValueOnce(response(snapshot('down', 'up')));
    vi.stubGlobal('fetch', fetch);
    const { result } = renderHook(() => useFoundryStatus({ pollIntervalMs: 100, timeoutMs: 1_000 }));
    const firstSignal = fetch.mock.calls[0][1].signal;

    await act(async () => { await vi.advanceTimersByTimeAsync(100); });
    expect(firstSignal.aborted).toBe(true);
    expect(result.current).toEqual({ fvtt1: 'offline', fvtt2: 'online' });

    first.resolve(response(snapshot('up', 'down')));
    await flush();
    expect(result.current).toEqual({ fvtt1: 'offline', fvtt2: 'online' });
  });

  it('aborts the active request and clears timeout and polling timers on unmount', () => {
    vi.useFakeTimers();
    const clearInterval = vi.spyOn(globalThis, 'clearInterval');
    let signal;
    vi.stubGlobal('fetch', vi.fn((_url, options) => {
      signal = options.signal;
      return new Promise(() => {});
    }));
    const { unmount } = renderHook(() => useFoundryStatus({ pollIntervalMs: 100, timeoutMs: 1_000 }));

    unmount();
    expect(signal.aborted).toBe(true);
    expect(clearInterval).toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(2_000); });
    expect(fetch).toHaveBeenCalledOnce();
  });
});
