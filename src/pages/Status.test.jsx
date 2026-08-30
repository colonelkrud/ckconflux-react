import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Status from './Status';

const response = (body, ok = true, status = 200) => ({ ok, status, json: async () => body });

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Status page', () => {
  it('does not claim absent services are healthy for a partial operational feed', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ checks: { matrix: 'ok', login: 'ok' } })));
    render(<Status />);

    expect(await screen.findByRole('heading', { name: 'All systems operational' })).toBeInTheDocument();
    expect(screen.getByText('All reported services are healthy.')).toBeInTheDocument();
    expect(screen.queryByText('Messaging, sign-in, calls, media, and account services are reporting healthy.')).not.toBeInTheDocument();
    expect(screen.getByText('Messaging')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.queryByText('Voice & video')).not.toBeInTheDocument();
    expect(screen.queryByText('Media & uploads')).not.toBeInTheDocument();
    expect(screen.queryByText('Account & membership')).not.toBeInTheDocument();
  });

  it('renders a stale healthy 503 as stale rather than all systems operational', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({
      status: 'ok',
      generated_at: '2026-08-30T18:00:00Z',
      snapshot_age_seconds: 130.1,
      stale: true,
      messages: [],
      checks: {
        website: 'ok',
        login: 'ok',
        matrix: 'ok',
        media: 'ok',
        calls: 'ok',
        membership: 'ok',
      },
    }, false, 503)));

    render(<Status />);

    expect(await screen.findByRole('heading', { name: 'Status information may be out of date' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'All systems operational' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Status snapshot is stale. Showing the last known status; it may be out of date.');
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument();
  });

  it('renders the structured no-snapshot startup response without treating it as malformed', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({
      status: 'unknown',
      generated_at: null,
      snapshot_age_seconds: null,
      stale: true,
      messages: ['Status snapshot is not yet available'],
      checks: {},
    }, false, 503)));

    render(<Status />);

    expect(await screen.findByRole('heading', { name: 'Status snapshot unavailable' })).toBeInTheDocument();
    expect(screen.getByText(/has not produced a status snapshot yet/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Services' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: "We couldn't retrieve CK Conflux service health" })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Current platform health could not be confirmed.');
  });
});
