import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const renderPath = (path) => { window.history.pushState({}, '', path); return render(<App />); };
afterEach(() => { document.title = ''; document.head.querySelectorAll('link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"]').forEach((node) => node.remove()); });

describe('CK Conflux application architecture', () => {
  it('renders Home and its preserved onboarding content', () => {
    renderPath('/');
    expect(screen.getByRole('heading', { name: /Private community chat and calls/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Help Center/i })).toHaveAttribute('href', '/help');
    expect(screen.getByRole('link', { name: 'Explore Element Call' })).toHaveAttribute('href', '/calls');
  });

  it.each([
    ['/why-ck-conflux', 'Why CK Conflux'], ['/matrix', 'Open communication, with a community you know'], ['/calls', 'Element Call'],
    ['/membership', 'Membership'], ['/security', 'Security'], ['/privacy', 'Privacy Policy'], ['/status', 'Service status'],
    ['/help', 'Matrix onboarding, FAQ, and support resources'], ['/support', 'Support CK Conflux'], ['/teamspeak', 'TeamSpeak 6 Beta'],
    ['/terms', 'CK Conflux Terms of Use'], ['/rules', 'Server Rules'],
  ])('directly renders the %s route', (path, heading) => {
    renderPath(path);
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
  });

  it('renders a real Not Found page for an unknown route', () => {
    renderPath('/does-not-exist');
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Private community chat/i })).not.toBeInTheDocument();
  });

  it('provides primary navigation and separate external account and Element actions', () => {
    renderPath('/');
    const nav = screen.getByRole('navigation', { name: 'Primary navigation' });
    expect(nav).toHaveTextContent('Why CK Conflux'); expect(nav).toHaveTextContent('Matrix'); expect(nav).toHaveTextContent('Calls'); expect(nav).toHaveTextContent('Help');
    expect(screen.getAllByRole('link', { name: 'My Account' })[0]).toHaveAttribute('href', 'https://account.ckconflux.com');
    expect(screen.getByRole('link', { name: 'Open Element' })).toHaveAttribute('href', 'https://element.ckconflux.com');
  });

  it('opens and closes the accessible mobile navigation', () => {
    renderPath('/');
    const button = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' }).querySelector('a[href="https://account.ckconflux.com"]')).toHaveTextContent('My Account');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('explains free community membership and the illustrative storage allowance', () => {
    renderPath('/membership');
    expect(screen.getByRole('heading', { name: /Communication is for the community/i })).toBeInTheDocument();
    expect(screen.getByText(/Critical messaging, calls, and community participation remain free/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '10 GiB of media storage' })).toBeInTheDocument();
    expect(screen.getByText('10,737,418,240 bytes')).toBeInTheDocument();
    expect(screen.getByText(/roughly 1 MB per photo/i)).toHaveTextContent(/on the order of 10,000 photos/);
    expect(screen.getByText(/This is only an illustration/i).closest('p')).toHaveTextContent(/resolution, compression, format, device, and quality settings/);
    expect(document.body).not.toHaveTextContent(/unlock essential messaging|paid-only messaging|premium messaging/i);
  });

  it('keeps My Account distinct from Element throughout the membership flow', () => {
    renderPath('/membership');
    const accountLinks = screen.getAllByRole('link', { name: /My Account/i });
    expect(accountLinks.some((link) => link.getAttribute('href') === 'https://account.ckconflux.com')).toBe(true);
    expect(screen.getByText(/Membership, storage, and account administration/)).toBeInTheDocument();
    expect(screen.getByText(/Messaging, community rooms, and calls/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Open Element' }).some((link) => link.getAttribute('href') === 'https://element.ckconflux.com')).toBe(true);
  });

  it('does not request authenticated account state from the public membership page', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    renderPath('/membership');
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(screen.getByText(/public site does not retrieve them/i)).toBeInTheDocument();
    fetchSpy.mockRestore();
  });

  it('uses client navigation and responds to browser history events', () => {
    renderPath('/');
    fireEvent.click(screen.getByRole('link', { name: 'Open Help Center' }));
    expect(window.location.pathname).toBe('/help');
    expect(screen.getByRole('heading', { name: /Matrix onboarding/i })).toBeInTheDocument();
    act(() => { window.history.pushState({}, '', '/rules'); window.dispatchEvent(new PopStateEvent('popstate')); });
    expect(screen.getByRole('heading', { name: 'Server Rules' })).toBeInTheDocument();
  });

  it('preserves initial focus and moves focus after client navigation', () => {
    renderPath('/');
    const homeHeading = screen.getByRole('heading', { name: /Private community chat and calls/i });
    expect(homeHeading).not.toHaveFocus();
    fireEvent.click(screen.getByRole('link', { name: /Open Help Center/i }));
    const helpHeading = screen.getByRole('heading', { name: /Matrix onboarding/i });
    expect(helpHeading).toHaveFocus();
    expect(helpHeading).toHaveAttribute('tabindex', '-1');
  });

  it('updates title, canonical, Open Graph, and social metadata', async () => {
    renderPath('/security');
    await waitFor(() => expect(document.title).toBe('Security | CK Conflux'));
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://ckconflux.com/security');
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute('content', 'Security | CK Conflux');
    expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary');
  });

  it('distinguishes Matrix, CK Conflux, and Element for general users', () => {
    renderPath('/matrix');
    expect(screen.getByRole('heading', { name: 'Matrix' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'CK Conflux' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Element' })).toBeInTheDocument();
    expect(screen.getByText('@name:ckconflux.com')).toBeInTheDocument();
    expect(screen.getByText(/Because Matrix is federated/)).toHaveTextContent(/wider Matrix network/);
    expect(screen.getByText(/recommended web and desktop client/i)).toHaveTextContent('Element X');
  });

  it('provides the critical Matrix calls, account, security, and help links', () => {
    renderPath('/matrix');
    expect(screen.getByRole('link', { name: 'Create Account' })).toHaveAttribute('href', 'https://element.ckconflux.com/#/register');
    expect(screen.getAllByRole('link', { name: 'Open Element' })[0]).toHaveAttribute('href', 'https://element.ckconflux.com');
    expect(screen.getAllByRole('link', { name: 'Calls' }).some((link) => link.getAttribute('href') === '/calls')).toBe(true);
    expect(screen.getByRole('link', { name: 'Security & recovery' })).toHaveAttribute('href', '/security');
    expect(screen.getByRole('link', { name: 'Help center' })).toHaveAttribute('href', '/help');
  });

  it('presents Element Call as the primary MatrixRTC voice and video route', () => {
    renderPath('/calls');
    expect(screen.getByRole('heading', { level: 1, name: 'Element Call' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Matrix room → Element Call/ })).toHaveTextContent('screen sharing');
    expect(screen.getByText(/MatrixRTC is the underlying/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read Security' })).toHaveAttribute('href', '/security');
  });

  it('labels TeamSpeak as a separate beta and points back to Element Call', () => {
    renderPath('/teamspeak');
    expect(screen.getByRole('heading', { level: 1, name: 'TeamSpeak 6 Beta' })).toBeInTheDocument();
    expect(screen.getByText('ts6.ckconflux.com')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Connect to TeamSpeak' })).toHaveAttribute('href', 'ts3server://ts6.ckconflux.com');
    expect(screen.getByRole('link', { name: 'Official TeamSpeak downloads' })).toHaveAttribute('href', 'https://www.teamspeak.com/en/downloads/');
    expect(screen.getByRole('link', { name: 'Explore Element Call' })).toHaveAttribute('href', '/calls');
    expect(screen.getByText(/identity and setup are separate/)).toBeInTheDocument();
  });

  it('does not market Foundry VTT', () => {
    for (const path of ['/', '/matrix', '/calls', '/teamspeak']) {
      const view = renderPath(path);
      expect(document.body).not.toHaveTextContent(/Foundry VTT/i);
      view.unmount();
    }
  });

  it('preserves a reduced-motion override and observes the preference', () => {
    const original = window.matchMedia;
    const matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() });
    window.matchMedia = matchMedia;
    renderPath('/');
    expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    expect(document.styleSheets).toBeDefined();
    window.matchMedia = original;
  });
});
