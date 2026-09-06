import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Status from './Status';

const response = (body, ok = true, status = 200) => ({ ok, status, json: async () => body });

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Status page', () => {
  it('shows the daily maintenance guidance between services and uptime history', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ checks: { website: 'ok' } })));
    render(<Status />);

    const services = await screen.findByRole('heading', { name: 'Services' });
    const maintenance = screen.getByRole('region', { name: 'Daily maintenance window' });
    const uptimeHistory = screen.getByRole('link', { name: /View uptime history/ });

    expect(within(maintenance).getByText('6:00 AM UTC')).toBeInTheDocument();
    expect(within(maintenance).getByText('4 hours')).toBeInTheDocument();
    expect(within(maintenance).getByText('Daily')).toBeInTheDocument();
    expect(within(maintenance).getByText(/Maintenance usually lasts under 10 minutes/)).toHaveTextContent('most applications do not experience any downtime');
    expect(within(maintenance).getByText(/voice calling and screen sharing/)).toHaveTextContent('may disconnect briefly');
    expect(services.compareDocumentPosition(maintenance) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(maintenance.compareDocumentPosition(uptimeHistory) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

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
    expect(screen.getByText(/web services remain available/i)).toBeInTheDocument();
    expect(screen.getByText('5 CK Conflux services are currently affected. Web services remain available.')).toBeInTheDocument();

    const website = screen.getByText('Web services').closest('li');
    const signin = screen.getByText('Sign in').closest('li');
    expect(website).toHaveTextContent('Operational');
    expect(website).toHaveAttribute('data-state', 'operational');
    expect(website).toHaveClass('bg-emerald-400/[0.09]');
    expect(signin).toHaveTextContent('Degraded');
    expect(signin).toHaveAttribute('data-state', 'degraded');
    expect(signin).toHaveClass('bg-amber-400/10');
    for (const name of ['Messaging', 'Voice & video', 'Media & uploads', 'Account & membership']) {
      const card = screen.getByText(name).closest('li');
      expect(card).toHaveTextContent('Unavailable');
      expect(card).toHaveAttribute('data-state', 'unavailable');
      expect(card).toHaveClass('bg-rose-400/10');
    }
    expect(screen.getByText('1 operational')).toBeInTheDocument();
    expect(screen.getByText('1 degraded')).toBeInTheDocument();
    expect(screen.getByText('4 unavailable')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Status information unavailable' })).not.toBeInTheDocument();
    expect(screen.queryByText('Synapse degraded')).not.toBeInTheDocument();
  });

  it('explains a TURN-only disruption without claiming Matrix messaging is down', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({
      status: 'degraded',
      stale: false,
      checks: {
        website: 'ok',
        login: 'ok',
        matrix: 'ok',
        media: 'ok',
        calls: 'ok',
        turn: 'down',
        membership: 'ok',
      },
    }, false, 503)));
    render(<Status />);

    expect(await screen.findByRole('heading', { name: 'Some services are degraded' })).toBeInTheDocument();
    const calls = screen.getByText('Voice & video').closest('li');
    expect(calls).toHaveAttribute('data-state', 'degraded');
    expect(calls).toHaveTextContent('The Matrix homeserver and MatrixRTC core remain available, but TURN is unavailable. Legacy calling is degraded and calls may fail in restrictive network conditions.');
    expect(screen.getByText('Messaging').closest('li')).toHaveAttribute('data-state', 'operational');
    expect(screen.queryByText('Turn')).not.toBeInTheDocument();
  });

  it('does not overstate the outage breadth when only one component is affected', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({
      status: 'down',
      checks: { website: 'ok', calls: 'down' },
    }, false, 503)));
    render(<Status />);

    expect(await screen.findByRole('heading', { name: 'Service outage detected' })).toBeInTheDocument();
    expect(screen.getByText('One or more CK Conflux services are currently unavailable. Web services remain available.')).toBeInTheDocument();
    expect(screen.queryByText(/Several CK Conflux services/i)).not.toBeInTheDocument();
  });

  it('does not claim absent services are healthy for a partial operational feed', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ checks: { matrix: 'ok', login: 'ok' } })));
    render(<Status />);

    expect(await screen.findByRole('heading', { name: 'All systems operational' })).toBeInTheDocument();
    expect(screen.getByText('All reported services are healthy.')).toBeInTheDocument();
    expect(screen.queryByText('Messaging, sign-in, calls, media, and account services are reporting healthy.')).not.toBeInTheDocument();
    expect(screen.getByText('Messaging').closest('li')).toHaveClass('bg-emerald-400/[0.09]');
    expect(screen.getByText('Sign in').closest('li')).toHaveClass('bg-emerald-400/[0.09]');
    expect(screen.getByText('2 operational')).toBeInTheDocument();
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
    expect(screen.getByText('6 operational')).toBeInTheDocument();
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
    expect(screen.getByRole('region', { name: 'Daily maintenance window' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View uptime history/ })).toBeInTheDocument();
  });

  it('uses neutral incomplete wording when only the feed-level state is unknown', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ status: 'unknown', checks: { website: 'ok' } })));
    render(<Status />);

    expect(await screen.findByRole('heading', { name: 'Status information incomplete' })).toBeInTheDocument();
    expect(screen.getByText('Status information is incomplete; the status feed did not confirm a complete platform state.')).toBeInTheDocument();
    expect(screen.queryByText('Some service checks returned an unknown state.')).not.toBeInTheDocument();
    expect(screen.getByText('Web services').closest('li')).toHaveTextContent('Operational');
  });
});
