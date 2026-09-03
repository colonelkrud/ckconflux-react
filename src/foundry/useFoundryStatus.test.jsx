import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useFoundryStatus } from './useFoundryStatus';

afterEach(() => vi.unstubAllGlobals());

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
});
