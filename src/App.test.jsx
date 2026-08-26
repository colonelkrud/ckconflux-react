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
    expect(screen.getByRole('link', { name: 'ts6.ckconflux.com' })).toHaveAttribute('href', 'ts3server://ts6.ckconflux.com');
  });

  it.each([
    ['/why-ck-conflux', 'Why CK Conflux'], ['/matrix', 'Matrix at CK Conflux'], ['/calls', 'Calls at CK Conflux'],
    ['/membership', 'Membership'], ['/security', 'Security'], ['/privacy', 'Privacy Policy'], ['/status', 'Service status'],
    ['/help', 'Matrix onboarding, FAQ, and support resources'], ['/support', 'Support CK Conflux'], ['/teamspeak', 'TeamSpeak'],
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
    expect(screen.getByRole('link', { name: 'My Account' })).toHaveAttribute('href', 'https://account.ckconflux.com');
    expect(screen.getByRole('link', { name: 'Open Element' })).toHaveAttribute('href', 'https://element.ckconflux.com');
  });

  it('opens and closes the accessible mobile navigation', () => {
    renderPath('/');
    const button = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('uses client navigation and responds to browser history events', () => {
    renderPath('/');
    fireEvent.click(screen.getByRole('link', { name: 'Open Help Center' }));
    expect(window.location.pathname).toBe('/help');
    expect(screen.getByRole('heading', { name: /Matrix onboarding/i })).toBeInTheDocument();
    act(() => { window.history.pushState({}, '', '/rules'); window.dispatchEvent(new PopStateEvent('popstate')); });
    expect(screen.getByRole('heading', { name: 'Server Rules' })).toBeInTheDocument();
  });

  it('updates title, canonical, Open Graph, and social metadata', async () => {
    renderPath('/security');
    await waitFor(() => expect(document.title).toBe('Security | CK Conflux'));
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://ckconflux.com/security');
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute('content', 'Security | CK Conflux');
    expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary');
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
