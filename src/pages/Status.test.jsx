import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Status from './Status';

const response = (body, ok = true, status = 200) => ({ ok, status, json: async () => body });

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Status page', () => {
  it('renders a production-style HTTP 503 outage while preserving all six component states', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({
      status: 'down',
      generated_at: '2026-08-30T23:27:03Z',
      messages: ['Synapse degraded', 'Media uploads degraded', 'Calls degraded', 'Membership services degraded'],
      checks: { website: 'ok', login: 'degraded', matrix: 'down', media: 'down', calls: 'down', membership: 'down' },
      snapshot_age_seconds: 7.2,
      stale: false,
    }, false, 503)));
    render(<Status />);

    expect(await screen.findByRole('heading', { name: 'Service outage detected' })).toBeInTheDocument();
    expect(screen.getByText(/website remains available/i)).toBeInTheDocument();
    expect(screen.getByText('Website').closest('li')).toHaveTextContent('Operational');
    expect(screen.getByText('Sign in').closest('li')).toHaveTextContent('Degraded');
    for (const name of ['Messaging', 'Voice & video', 'Media & uploads', 'Account & membership']) {
      expect(screen.getByText(name).closest('li')).toHaveTextContent('Unavailable');
    }
    expect(screen.queryByRole('heading', { name: 'Status information unavailable' })).not.toBeInTheDocument();
    expect(screen.queryByText('Synapse degraded')).not.toBeInTheDocument();
  });

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
    expect(screen.getByRole('status')).toHaveTextContent('Showing the last reported service status.');
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

    expect(await screen.findByRole('heading', { name: 'Status information unavailable' })).toBeInTheDocument();
    expect(screen.getByText('Current service status is not available yet.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Services' })).not.toBeInTheDocument();
    expect(screen.getByText('A status snapshot is not available yet.')).toBeInTheDocument();
  });

  it('uses neutral incomplete wording when only the feed-level state is unknown', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ status: 'unknown', checks: { website: 'ok' } })));
    render(<Status />);

    expect(await screen.findByRole('heading', { name: 'Status information incomplete' })).toBeInTheDocument();
    expect(screen.getByText('Status information is incomplete; the status feed did not confirm a complete platform state.')).toBeInTheDocument();
    expect(screen.queryByText('Some service checks returned an unknown state.')).not.toBeInTheDocument();
    expect(screen.getByText('Website').closest('li')).toHaveTextContent('Operational');
  });
});
