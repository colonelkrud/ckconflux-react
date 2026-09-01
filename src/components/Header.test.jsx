import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Router } from '../router/Router';
import Header from './Header';

const response = (body) => ({ ok: true, json: async () => body });

function renderHeader() {
  return render(<Router><Header /></Router>);
}

async function startStatusMonitor() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1);
    await Promise.resolve();
    await Promise.resolve();
  });
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('Header incident banner', () => {
  it('shows the affected service for a fresh degraded state', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({
      status: 'degraded',
      stale: false,
      checks: { website: 'ok', login: 'ok', matrix: 'ok', media: 'ok', calls: 'ok', turn: 'down', membership: 'ok' },
    })));

    renderHeader();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await startStatusMonitor();

    expect(screen.getByRole('alert')).toHaveTextContent('Service disruption detected. Voice & video is degraded.');
    expect(screen.getByRole('link', { name: 'View status' })).toHaveAttribute('href', '/status');
  });

  it('uses outage treatment when a service is unavailable', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({
      status: 'down',
      stale: false,
      checks: { website: 'ok', login: 'ok', matrix: 'down', media: 'ok', calls: 'ok', turn: 'ok', membership: 'ok' },
    })));

    renderHeader();
    await startStatusMonitor();

    expect(screen.getByRole('alert')).toHaveTextContent('Service outage detected. Messaging is unavailable.');
    expect(screen.getByRole('alert')).toHaveClass('bg-rose-400/10');
  });

  it('does not announce an incident from stale status data', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({
      status: 'degraded',
      stale: true,
      checks: { website: 'ok', login: 'ok', matrix: 'ok', calls: 'ok', turn: 'down' },
    })));

    renderHeader();
    await startStatusMonitor();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
