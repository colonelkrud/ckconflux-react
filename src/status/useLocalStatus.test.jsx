import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useLocalStatus } from './useLocalStatus';

const payload = (state = 'ok') => ({ generated_at: '2026-08-30T12:00:00Z', checks: { matrix: state } });
const response = (body, ok = true) => ({ ok, json: async () => body });

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('useLocalStatus', () => {
  it.each([
    [200, 'ok', 'operational'],
    [503, 'degraded', 'degraded'],
    [503, 'down', 'unavailable'],
    [418, 'degraded', 'degraded'],
  ])('accepts a recognized payload from HTTP %s', async (code, state, overall) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response(payload(state), code < 400)));
    const { result } = renderHook(() => useLocalStatus());
    await waitFor(() => expect(result.current.phase).toBe('ready'));
    expect(result.current.overall).toBe(overall);
  });

  it.each([
    ['malformed JSON', () => Promise.resolve({ ok: true, json: () => Promise.reject(new SyntaxError()) })],
    ['unrecognized JSON', () => Promise.resolve(response({ status: 'down', error: 'backend error' }, false))],
    ['network failure', () => Promise.reject(new TypeError('offline'))],
  ])('reports %s as an error', async (_label, implementation) => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(implementation));
    const { result } = renderHook(() => useLocalStatus());
    await waitFor(() => expect(result.current.phase).toBe('error'));
  });

  it('reports a timeout as an error', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn((_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError'))))));
    const { result } = renderHook(() => useLocalStatus({ timeoutMs: 50 }));
    await act(async () => { await vi.advanceTimersByTimeAsync(51); });
    expect(result.current.phase).toBe('error');
  });

  it('keeps successful data visible during refresh and marks it stale after failure', async () => {
    let rejectRefresh;
    const fetch = vi.fn()
      .mockResolvedValueOnce(response(payload()))
      .mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectRefresh = reject; }));
    vi.stubGlobal('fetch', fetch);
    const { result } = renderHook(() => useLocalStatus());
    await waitFor(() => expect(result.current.phase).toBe('ready'));
    act(() => { result.current.refresh(); });
    expect(result.current.phase).toBe('ready');
    expect(result.current.isRefreshing).toBe(true);
    expect(result.current.components[0].name).toBe('Messaging');
    await act(async () => { rejectRefresh(new Error('offline')); });
    expect(result.current.phase).toBe('ready');
    expect(result.current.stale).toBe(true);
    expect(result.current.refreshError).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('manual refresh performs another successful request', async () => {
    const fetch = vi.fn().mockResolvedValue(response(payload()));
    vi.stubGlobal('fetch', fetch);
    const { result } = renderHook(() => useLocalStatus());
    await waitFor(() => expect(result.current.phase).toBe('ready'));
    await act(async () => { await result.current.refresh(); });
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
