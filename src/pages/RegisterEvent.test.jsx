import { StrictMode } from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import RegisterEvent from './RegisterEvent';
import { Router } from '../router/Router';
import { REGISTRATION_EVENT } from '../config/registrationEvent';
import registrationEventSource from '../config/registrationEvent.js?raw';
import { getPageMetadata } from '../metadata/pageMetadata';

const FIXTURE_TOKEN = 'TEST-ONLY-REGISTRATION-TOKEN-NOT-A-CREDENTIAL';
const RESPONSE = 'TEST-ONLY-TURNSTILE-RESPONSE';
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const configResponse = (body = { sitekey: 'TEST-ONLY-SITEKEY', action: 'registration_event_token' }, status = 200) => ({ status, json: async () => body });
const tokenResponse = (body = { registration_token: FIXTURE_TOKEN }, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => body });
let options;
const renderRegistration = (ui = <RegisterEvent />) => render(<Router>{ui}</Router>);

function mockRequests(token = tokenResponse()) {
  fetch.mockImplementation((url) => Promise.resolve(url === REGISTRATION_EVENT.configEndpoint ? configResponse() : token));
}
async function renderWidget(ui = <RegisterEvent />) {
  const view = renderRegistration(ui);
  await waitFor(() => expect(window.turnstile.render).toHaveBeenCalled());
  return view;
}
async function completeChallenge(value = RESPONSE) {
  await act(async () => { await options.callback(value); });
}

beforeEach(() => {
  options = undefined;
  window.turnstile = { render: vi.fn((_node, value) => { options = value; return 'widget-id'; }), remove: vi.fn() };
  vi.stubGlobal('fetch', vi.fn());
  mockRequests();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete window.turnstile;
  document.head.querySelectorAll(`script[src="${SCRIPT}"], link[rel="canonical"], meta[name="robots"]`).forEach((node) => node.remove());
});

describe('runtime Turnstile configuration', () => {
  it('does not expose a statically configured production sitekey', () => {
    expect(REGISTRATION_EVENT).not.toHaveProperty('sitekey');
    expect(registrationEventSource).not.toContain(['0x4AAAAAACFAmLXvI6', '_MxRTf'].join(''));
  });
  it('fetches config before rendering and uses only the canonical contract', async () => {
    await renderWidget();
    expect(fetch.mock.calls[0][0]).toBe('/api/registration-event/config');
    expect(fetch.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
    expect(options).toMatchObject({ sitekey: 'TEST-ONLY-SITEKEY', action: 'registration_event_token', retry: 'never', 'refresh-expired': 'never', 'refresh-timeout': 'never' });
  });

  it.each([
    ['empty sitekey', { sitekey: '', action: 'registration_event_token' }, 200],
    ['missing sitekey', { action: 'registration_event_token' }, 200],
    ['wrong action', { sitekey: 'TEST', action: 'other' }, 200],
    ['HTTP 404', {}, 404], ['HTTP 500', {}, 500],
  ])('fails closed for %s', async (_name, body, status) => {
    fetch.mockResolvedValue(configResponse(body, status));
    renderRegistration();
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Registration is temporarily unavailable'));
    expect(window.turnstile.render).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('link', { name: 'View support options' })).toHaveAttribute('href', '/support');
  });

  it('fails closed for malformed JSON', async () => {
    fetch.mockResolvedValue({ status: 200, json: async () => { throw new SyntaxError('fixture'); } });
    renderRegistration();
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Registration is temporarily unavailable'));
    expect(window.turnstile.render).not.toHaveBeenCalled();
  });

  it('times out config retrieval', async () => {
    vi.useFakeTimers();
    fetch.mockImplementation(() => new Promise(() => {}));
    renderRegistration();
    const signal = fetch.mock.calls[0][1].signal;
    await act(async () => { vi.advanceTimersByTime(10000); });
    expect(signal.aborted).toBe(true);
    expect(screen.getByRole('alert')).toHaveTextContent('Registration is temporarily unavailable');
    expect(window.turnstile.render).not.toHaveBeenCalled();
  });

  it('ignores stale config after a user retry', async () => {
    vi.useFakeTimers();
    let resolveFirst;
    fetch.mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve; }));
    renderRegistration();
    await act(async () => { vi.advanceTimersByTime(10000); });
    fetch.mockResolvedValueOnce(configResponse());
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await act(async () => {});
    expect(window.turnstile.render).toHaveBeenCalledTimes(1);
    await act(async () => resolveFirst?.(configResponse({ sitekey: 'STALE', action: REGISTRATION_EVENT.action })));
    expect(options.sitekey).toBe('TEST-ONLY-SITEKEY');
  });

  it('aborts config retrieval on unmount', () => {
    fetch.mockImplementation(() => new Promise(() => {}));
    const view = renderRegistration();
    const signal = fetch.mock.calls[0][1].signal;
    view.unmount();
    expect(signal.aborted).toBe(true);
    expect(window.turnstile.render).not.toHaveBeenCalled();
  });
});

describe('credential release and lifecycle', () => {
  it('moves from a compact loading state to focused challenge guidance', async () => {
    let resolveConfig;
    fetch.mockImplementation(() => new Promise((resolve) => { resolveConfig = resolve; }));
    renderRegistration();

    expect(screen.getByRole('status')).toHaveTextContent('Preparing secure registration');
    expect(screen.queryByRole('button', { name: 'Copy registration token' })).not.toBeInTheDocument();
    await act(async () => resolveConfig(configResponse()));

    expect(screen.getByRole('heading', { name: 'Request a free registration token' })).toBeInTheDocument();
    expect(screen.getByText('Complete this quick security check to continue.')).toBeInTheDocument();
    expect(screen.getByLabelText('Security check')).toBeVisible();
  });

  it('replaces the consumed challenge with progress while the request is pending', async () => {
    let finishRequest;
    fetch.mockImplementation((url) => url === REGISTRATION_EVENT.configEndpoint
      ? Promise.resolve(configResponse())
      : new Promise((resolve) => { finishRequest = resolve; }));
    await renderWidget();

    act(() => { options.callback(RESPONSE); });
    expect(screen.getByRole('status')).toHaveTextContent('Verification complete');
    expect(screen.getByText('Preparing your registration token…')).toBeInTheDocument();
    expect(screen.getByLabelText('Security check').parentElement).toHaveClass('hidden');
    expect(screen.getByLabelText('Security check').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
    expect(screen.queryByText(FIXTURE_TOKEN)).not.toBeInTheDocument();

    await act(async () => finishRequest(tokenResponse()));
  });

  it('posts the exact canonical payload and renders the token', async () => {
    await renderWidget();
    await completeChallenge();
    expect(fetch).toHaveBeenLastCalledWith('/api/registration-event/token', expect.objectContaining({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ turnstile_token: RESPONSE }) }));
    expect(fetch.mock.calls[1][1].body).not.toContain(['turnstile', 'response'].join('_'));
    expect(screen.getByText(FIXTURE_TOKEN)).toBeInTheDocument();
    expect(screen.getByLabelText('Registration token')).toHaveClass('select-all');
    expect(screen.getByRole('link', { name: 'Continue to Element registration' })).toBeInTheDocument();
    expect(screen.getByLabelText('Security check').parentElement).toHaveClass('hidden');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('announces a successful copy without hiding the selectable token', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    await renderWidget();
    await completeChallenge();

    fireEvent.click(screen.getByRole('button', { name: 'Copy registration token' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Copy registration token' })).toHaveTextContent('Copied'));
    expect(screen.getByRole('status')).toHaveTextContent('Registration token copied.');
    expect(writeText).toHaveBeenCalledWith(FIXTURE_TOKEN);
    expect(screen.getByText(FIXTURE_TOKEN)).toBeInTheDocument();
  });

  it.each([[400, /could not be accepted/i], [429, /Too many registration requests/i], [503, /temporarily unavailable/i]])('handles backend HTTP %s with a distinct error state', async (status, message) => {
    mockRequests(tokenResponse({}, status));
    await renderWidget();
    await completeChallenge();
    expect(screen.getByRole('alert')).toHaveTextContent(message);
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    if (status >= 500) expect(screen.getByRole('link', { name: 'View support options' })).toHaveAttribute('href', '/support');
    else expect(screen.queryByRole('link', { name: 'View support options' })).not.toBeInTheDocument();
  });

  it('suppresses duplicate responses and stale widget callbacks after manual retry', async () => {
    await renderWidget();
    const old = options;
    act(() => old['error-callback']());
    await old.callback('IGNORED');
    expect(fetch).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await waitFor(() => expect(window.turnstile.render).toHaveBeenCalledTimes(2));
    await old.callback('STALE');
    await completeChallenge('FRESH');
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('handles script errors, timeouts, and render exceptions without automatic retry', async () => {
    const api = window.turnstile;
    delete window.turnstile;
    renderRegistration();
    await waitFor(() => expect(document.querySelector(`script[src="${SCRIPT}"]`)).toBeInTheDocument());
    fireEvent.error(document.querySelector(`script[src="${SCRIPT}"]`));
    expect(screen.getByRole('alert')).toHaveTextContent(/temporarily unavailable/i);
    expect(fetch).toHaveBeenCalledTimes(1);
    window.turnstile = api;
    api.render.mockImplementationOnce(() => { throw new Error('fixture'); });
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await waitFor(() => expect(api.render).toHaveBeenCalled());
    expect(screen.getByRole('alert')).toHaveTextContent(/temporarily unavailable/i);
  });

  it('bounds a stalled script load', async () => {
    vi.useFakeTimers();
    delete window.turnstile;
    renderRegistration();
    await act(async () => {});
    const script = document.querySelector(`script[src="${SCRIPT}"]`);
    expect(script).toBeInTheDocument();
    await act(async () => { vi.advanceTimersByTime(10000); });
    expect(script).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(/temporarily unavailable/i);
  });

  it('bounds backend requests and ignores late results', async () => {
    vi.useFakeTimers();
    let finish;
    fetch.mockImplementation((url) => url === REGISTRATION_EVENT.configEndpoint ? Promise.resolve(configResponse()) : new Promise((resolve) => { finish = resolve; }));
    renderRegistration();
    await act(async () => {});
    const pending = options.callback(RESPONSE);
    const signal = fetch.mock.calls[1][1].signal;
    await act(async () => { vi.advanceTimersByTime(10000); });
    expect(signal.aborted).toBe(true);
    await act(async () => { finish(tokenResponse()); await pending; });
    expect(screen.queryByText(FIXTURE_TOKEN)).not.toBeInTheDocument();
  });

  it('supports Clipboard fallback and validates result metadata', async () => {
    mockRequests(tokenResponse({ registration_token: FIXTURE_TOKEN, campaign: {}, expires_at: {} }));
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    await renderWidget();
    await completeChallenge();
    expect(screen.getByText(`Campaign: ${REGISTRATION_EVENT.campaign}`)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Copy registration token' }));
    expect(screen.getByText(/Select and copy the token manually/i)).toBeInTheDocument();
  });

  it.each([null, {}, { registration_token: '' }])('rejects malformed successful result data: %j', async (body) => {
    mockRequests(tokenResponse(body));
    await renderWidget();
    await completeChallenge();
    expect(screen.getByRole('alert')).toHaveTextContent(/temporarily unavailable/i);
    expect(screen.queryByText(FIXTURE_TOKEN)).not.toBeInTheDocument();
  });

  it('preserves a successful token after later widget callbacks', async () => {
    await renderWidget();
    await completeChallenge();
    act(() => options['expired-callback']());
    expect(screen.getByText(FIXTURE_TOKEN)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
  });

  it('aborts requests, removes widgets on unmount, and is Strict Mode safe', async () => {
    const view = await renderWidget(<StrictMode><RegisterEvent /></StrictMode>);
    expect(fetch.mock.calls.filter(([url]) => url === REGISTRATION_EVENT.configEndpoint).length).toBe(2);
    expect(window.turnstile.render).toHaveBeenCalledTimes(1);
    view.unmount();
    expect(window.turnstile.remove).toHaveBeenCalledWith('widget-id');
  });

  it('aborts an in-flight token request on unmount', async () => {
    fetch.mockImplementation((url) => url === REGISTRATION_EVENT.configEndpoint ? Promise.resolve(configResponse()) : new Promise(() => {}));
    const view = await renderWidget();
    act(() => { options.callback(RESPONSE); });
    const signal = fetch.mock.calls[1][1].signal;
    view.unmount();
    expect(signal.aborted).toBe(true);
    expect(window.turnstile.remove).toHaveBeenCalledWith('widget-id');
  });
});

describe('route contracts', () => {
  it('keeps campaign routes noindex and off campaign navigation', async () => {
    window.history.pushState({}, '', '/register-event');
    render(<App />);
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow'));
    expect(getPageMetadata('/migrate').robots).toBe('noindex, nofollow');
    expect(document.querySelectorAll('a[href="/register-event"]')).toHaveLength(0);
  });
});
