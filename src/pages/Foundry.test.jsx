import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import FoundryServerCard from '../components/FoundryServerCard';
import { FOUNDRY_SERVERS } from '../config/foundry';
import { SUPPORTER_URL } from '../config/community';
import { getPageMetadata, ROUTE_PATHS } from '../metadata/pageMetadata';

const renderFoundry = () => { window.history.pushState({}, '', '/foundry'); return render(<App />); };
afterEach(() => { vi.unstubAllGlobals(); document.head.querySelectorAll('link[rel="canonical"]').forEach((node) => node.remove()); });

describe('Foundry landing page', () => {
  it('routes through the normal shell and presents configured servers and schedules', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('not deployed')));
    renderFoundry();
    expect(screen.getByRole('heading', { level: 1, name: 'Foundry VTT' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
    expect(screen.getByText('Wednesday').closest('div')).toHaveTextContent('6:30 PM Eastern');
    expect(screen.getByText('Thursday').closest('div')).toHaveTextContent('6:30 PM Eastern');
    FOUNDRY_SERVERS.forEach((server) => expect(screen.getByRole('link', { name: `Enter ${server.name} (opens in a new tab)` })).toHaveAttribute('href', server.url));
    await waitFor(() => expect(screen.getAllByRole('status').every((node) => node.textContent.includes('Status unavailable'))).toBe(true));
  });

  it('keeps server entry actionable and status available as text in every state', () => {
    for (const status of ['checking', 'online', 'offline', 'unknown']) {
      const { unmount } = render(<FoundryServerCard server={FOUNDRY_SERVERS[0]} status={status} />);
      const link = screen.getByRole('link', { name: /Enter Server 1/ });
      expect(link).toHaveAttribute('href', FOUNDRY_SERVERS[0].url);
      expect(link).not.toHaveAttribute('aria-disabled');
      expect(screen.getByRole('status')).toHaveTextContent({ checking: 'Checking', online: 'Online', offline: 'Offline', unknown: 'Status unavailable' }[status]);
      unmount();
    }
  });

  it('uses lightweight Checking motion only when reduced motion is not requested', async () => {
    const matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    vi.stubGlobal('matchMedia', matchMedia);
    render(<FoundryServerCard server={FOUNDRY_SERVERS[0]} status="checking" />);

    const indicator = document.querySelector('[data-status-indicator="checking"]');
    await waitFor(() => expect(indicator).not.toHaveClass('animate-pulse'));
    expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    expect(screen.getByRole('status')).toHaveTextContent('Checking');
  });

  it('uses canonical voluntary-support messaging and footer discoverability', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
    renderFoundry();
    expect(screen.getByRole('link', { name: 'Buy Me a Coffee' })).toHaveAttribute('href', SUPPORTER_URL);
    expect(screen.getByText(/Support is always voluntary/)).toHaveTextContent(/payment is not required to use either Foundry server/i);
    expect(screen.getByRole('navigation', { name: 'Community links' }).querySelector('a[href="/foundry"]')).toHaveTextContent('Foundry VTT');
  });

  it('registers metadata for prerendering without a script special case', () => {
    expect(ROUTE_PATHS).toContain('/foundry');
    expect(getPageMetadata('/foundry')).toMatchObject({ title: 'Foundry VTT | CK Conflux', url: 'https://ckconflux.com/foundry', known: true, robots: null });
  });
});
