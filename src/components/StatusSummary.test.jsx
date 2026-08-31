import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Router } from '../router/Router';
import StatusSummary from './StatusSummary';

const response = (body) => ({ ok: true, json: async () => body });

function renderSummary() {
  return render(<Router><StatusSummary /></Router>);
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('StatusSummary', () => {
  it('reports the feed-level production outage even when the website is operational', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({
      status: 'down', stale: false,
      checks: { website: 'ok', login: 'degraded', matrix: 'down', media: 'down', calls: 'down', membership: 'down' },
    })));
    renderSummary();
    expect(await screen.findByText('Service outage detected')).toBeInTheDocument();
    expect(screen.getByText('5 services are affected.')).toBeInTheDocument();
  });

  it('distinguishes a structured no-snapshot response from a feed failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({
      status: 'unknown', generated_at: null, snapshot_age_seconds: null, stale: true,
      messages: ['Status snapshot is not yet available'], checks: {},
    })));
    renderSummary();
    expect(await screen.findByText('Status information unavailable')).toBeInTheDocument();
    expect(screen.getByText('Current service status is not available yet.')).toBeInTheDocument();
  });

  it('does not claim messaging and sign-in are operational without evidence for both', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ checks: { calls: 'degraded', matrix: 'mystery', login: 'ok' } })));
    renderSummary();

    expect(await screen.findByText('Voice & video is degraded')).toBeInTheDocument();
    expect(screen.queryByText('Messaging and sign-in remain operational.')).not.toBeInTheDocument();
    expect(screen.getByText('Other services may remain operational; view details for the full status.')).toBeInTheDocument();
  });

  it('keeps the feed-level outage headline when it is worse than the sole affected component', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ status: 'down', checks: { calls: 'degraded' } })));
    renderSummary();

    expect(await screen.findByText('Service outage detected')).toBeInTheDocument();
    expect(screen.queryByText('Voice & video is degraded')).not.toBeInTheDocument();
  });

  it('derives freshness from the payload timestamp instead of permanently saying updated recently', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ generated_at: '2000-01-01T00:00:00Z', checks: { matrix: 'ok', login: 'ok' } })));
    renderSummary();

    expect(await screen.findByText('All systems operational')).toBeInTheDocument();
    expect(screen.queryByText('Updated recently')).not.toBeInTheDocument();
    expect(screen.getByText(/^Updated \d+ hours ago$/)).toBeInTheDocument();
  });

  it('does not call a server-reported stale healthy snapshot live or operational', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({
      status: 'ok',
      generated_at: '2000-01-01T00:00:00Z',
      snapshot_age_seconds: 130,
      stale: true,
      messages: [],
      checks: { website: 'ok', login: 'ok', matrix: 'ok', media: 'ok', calls: 'ok', membership: 'ok' },
    })));
    renderSummary();

    expect(await screen.findByText('Status information may be out of date')).toBeInTheDocument();
    expect(screen.queryByText('All systems operational')).not.toBeInTheDocument();
    expect(screen.getByText('Service status')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Showing the last reported service status.');
  });

  it('keeps freshness visible for an incident and warns when its refresh fails', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-30T14:00:00Z'));
    const fetch = vi.fn()
      .mockResolvedValueOnce(response({ generated_at: '2026-08-30T12:00:00Z', checks: { calls: 'degraded', matrix: 'ok', login: 'ok' } }))
      .mockRejectedValueOnce(new Error('offline'));
    vi.stubGlobal('fetch', fetch);
    renderSummary();

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByText('Voice & video is degraded')).toBeInTheDocument();
    expect(screen.getByText('Updated 2 hours ago')).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(60000);
      await Promise.resolve();
    });
    expect(screen.getByRole('status')).toHaveTextContent('Unable to refresh status. Showing the last known update.');
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
