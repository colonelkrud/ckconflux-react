import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { REGISTRATION_EVENT } from '../config/registrationEvent';
import { getPageMetadata, ROUTE_PATHS } from '../metadata/pageMetadata';

const FIXTURE_TOKEN = 'TEST-ONLY-REGISTRATION-TOKEN-NOT-A-CREDENTIAL';
let options;
const renderRoute = () => { window.history.pushState({}, '', '/register-event'); return render(<App />); };

beforeEach(() => {
  options = undefined;
  window.turnstile = {
    render: vi.fn((_node, value) => { options = value; return 'fixture-widget-id'; }),
    reset: vi.fn(),
  };
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete window.turnstile;
  document.head.querySelectorAll('link[rel="canonical"], meta[name="robots"]').forEach((node) => node.remove());
});

describe('free registration campaign', () => {
  it('uses the focused campaign layout, stays undiscoverable, and is noindex', async () => {
    renderRoute();
    expect(screen.getByRole('heading', { level: 1, name: REGISTRATION_EVENT.campaign })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Campaign page links' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument();
    expect(document.querySelectorAll('a[href="/register-event"]')).toHaveLength(0);
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow'));
    expect(ROUTE_PATHS).toContain('/register-event');
    expect(getPageMetadata('/register-event').robots).toBe('noindex, nofollow');
    expect(getPageMetadata('/migrate').robots).toBe('noindex, nofollow');
  });

  it('renders Turnstile with the production public contract', async () => {
    renderRoute();
    await waitFor(() => expect(window.turnstile.render).toHaveBeenCalled());
    expect(options).toMatchObject({ sitekey: REGISTRATION_EVENT.sitekey, action: 'registration_event_token' });
    expect(screen.getByText(/anti-automation challenge/i)).toBeInTheDocument();
    expect(document.body).toHaveTextContent(/not proof of identity/i);
  });

  it('posts a completed challenge and renders, copies, and links the returned token', async () => {
    fetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ campaign: REGISTRATION_EVENT.campaign, registration_token: FIXTURE_TOKEN, expires_at: '2026-10-01T00:00:00Z' }) });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockResolvedValue() } });
    renderRoute();
    await waitFor(() => expect(options).toBeDefined());
    await options.callback('TEST-ONLY-TURNSTILE-RESPONSE');
    expect(fetch).toHaveBeenCalledWith('/api/registration-event/token', expect.objectContaining({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ turnstile_response: 'TEST-ONLY-TURNSTILE-RESPONSE' }) }));
    expect(await screen.findByText(FIXTURE_TOKEN)).toBeInTheDocument();
    expect(screen.getByText(REGISTRATION_EVENT.campaign)).toBeInTheDocument();
    expect(screen.getByText(/Expires:/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Copy registration token' }));
    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith(FIXTURE_TOKEN));
    expect(screen.getByRole('link', { name: 'Continue to Element registration' })).toHaveAttribute('href', 'https://element.ckconflux.com/#/register');
  });

  it('provides manual-copy fallback when Clipboard API is unavailable', async () => {
    fetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ registration_token: FIXTURE_TOKEN }) });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    renderRoute(); await waitFor(() => expect(options).toBeDefined()); await options.callback('TEST-ONLY-RESPONSE');
    fireEvent.click(await screen.findByRole('button', { name: 'Copy registration token' }));
    expect(await screen.findByText(/Select and copy the token manually/i)).toBeInTheDocument();
  });

  it.each([
    ['invalid challenge', () => options['error-callback'](), /rejected/i],
    ['expired challenge', () => options['expired-callback'](), /expired/i],
  ])('never reveals a token for an %s and resets before retrying', async (_name, fail, message) => {
    renderRoute(); await waitFor(() => expect(options).toBeDefined()); act(() => fail());
    expect(screen.queryByText(FIXTURE_TOKEN)).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(message));
    fireEvent.click(screen.getByRole('button', { name: 'Run a new challenge' }));
    expect(window.turnstile.reset).toHaveBeenCalledWith('fixture-widget-id');
  });

  it.each([
    [400, /rejected/i], [429, /Too many requests/i], [503, /temporarily unavailable/i],
  ])('does not reveal a token after backend HTTP %s', async (status, message) => {
    fetch.mockResolvedValue({ ok: false, status });
    renderRoute(); await waitFor(() => expect(options).toBeDefined()); await options.callback('TEST-ONLY-RESPONSE');
    expect(screen.queryByText(FIXTURE_TOKEN)).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(message);
  });

  it('does not reuse a consumed response after an ambiguous failure', async () => {
    fetch.mockRejectedValue(new TypeError('fixture network failure'));
    renderRoute(); await waitFor(() => expect(options).toBeDefined());
    await options.callback('TEST-ONLY-CONSUMED-RESPONSE');
    await options.callback('TEST-ONLY-CONSUMED-RESPONSE');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(FIXTURE_TOKEN)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Run a new challenge' }));
    expect(window.turnstile.reset).toHaveBeenCalled();
  });
});
