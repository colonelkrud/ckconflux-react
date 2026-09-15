import { StrictMode } from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import RegisterEvent from './RegisterEvent';
import { REGISTRATION_EVENT } from '../config/registrationEvent';
import { getPageMetadata, ROUTE_PATHS } from '../metadata/pageMetadata';

const FIXTURE_TOKEN = 'TEST-ONLY-REGISTRATION-TOKEN-NOT-A-CREDENTIAL';
const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let options;
const renderRoute = () => { window.history.pushState({}, '', '/register-event'); return render(<App />); };
const getScript = () => document.querySelector(`script[src="${TURNSTILE_SCRIPT}"]`);
const successfulResponse = () => ({ ok: true, status: 200, json: async () => ({ registration_token: FIXTURE_TOKEN }) });
const completeChallenge = async (response = 'TEST-ONLY-RESPONSE') => {
  await act(async () => { await options.callback(response); });
};

beforeEach(() => {
  options = undefined;
  window.turnstile = {
    render: vi.fn((_node, value) => { options = value; return 'fixture-widget-id'; }),
    remove: vi.fn(),
  };
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete window.turnstile;
  document.head.querySelectorAll(`link[rel="canonical"], meta[name="robots"], script[src="${TURNSTILE_SCRIPT}"]`).forEach((node) => node.remove());
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

  it('renders Turnstile with the production public contract and only manual retries', async () => {
    renderRoute();
    await waitFor(() => expect(window.turnstile.render).toHaveBeenCalled());
    expect(options).toMatchObject({
      sitekey: REGISTRATION_EVENT.sitekey,
      action: 'registration_event_token',
      size: 'compact',
      retry: 'never',
      'refresh-expired': 'never',
      'refresh-timeout': 'never',
    });
    expect(screen.getByText(/anti-automation challenge/i)).toBeInTheDocument();
    expect(document.body).toHaveTextContent(/not proof of identity/i);
  });

  it('posts a completed challenge and renders, copies, and links the returned token', async () => {
    fetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ campaign: REGISTRATION_EVENT.campaign, registration_token: FIXTURE_TOKEN, expires_at: '2026-10-01T00:00:00Z' }) });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockResolvedValue() } });
    renderRoute();
    await completeChallenge('TEST-ONLY-TURNSTILE-RESPONSE');
    expect(fetch).toHaveBeenCalledWith('/api/registration-event/token', expect.objectContaining({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ turnstile_response: 'TEST-ONLY-TURNSTILE-RESPONSE' }) }));
    expect(screen.getByText(FIXTURE_TOKEN)).toBeInTheDocument();
    expect(screen.getByText(REGISTRATION_EVENT.campaign)).toBeInTheDocument();
    expect(screen.getByText(/Expires:/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Copy registration token' }));
    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith(FIXTURE_TOKEN));
    expect(screen.getByRole('link', { name: 'Continue to Element registration' })).toHaveAttribute('href', 'https://element.ckconflux.com/#/register');
  });

  it('provides manual-copy fallback when Clipboard API is unavailable', async () => {
    fetch.mockResolvedValue(successfulResponse());
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    renderRoute();
    await completeChallenge();
    fireEvent.click(screen.getByRole('button', { name: 'Copy registration token' }));
    expect(screen.getByText(/Select and copy the token manually/i)).toBeInTheDocument();
  });

  it.each([
    ['invalid challenge', 'error-callback', /rejected/i],
    ['expired challenge', 'expired-callback', /expired/i],
    ['timed-out challenge', 'timeout-callback', /expired/i],
  ])('never reveals a token for an %s and replaces the widget before retrying', async (_name, callback, message) => {
    renderRoute();
    act(() => options[callback]());
    expect(screen.queryByText(FIXTURE_TOKEN)).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(message);
    fireEvent.click(screen.getByRole('button', { name: 'Run a new challenge' }));
    expect(window.turnstile.remove).toHaveBeenCalledWith('fixture-widget-id');
    expect(window.turnstile.render).toHaveBeenCalledTimes(2);
  });

  it.each([
    [400, /rejected/i], [429, /Too many requests/i], [503, /temporarily unavailable/i],
  ])('does not reveal a token after backend HTTP %s', async (status, message) => {
    fetch.mockResolvedValue({ ok: false, status });
    renderRoute();
    await completeChallenge();
    expect(screen.queryByText(FIXTURE_TOKEN)).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(message);
  });

  it('does not reuse a consumed response after an ambiguous failure', async () => {
    fetch.mockRejectedValue(new TypeError('fixture network failure'));
    renderRoute();
    await completeChallenge('TEST-ONLY-CONSUMED-RESPONSE');
    await completeChallenge('TEST-ONLY-CONSUMED-RESPONSE');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(FIXTURE_TOKEN)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Run a new challenge' }));
    expect(window.turnstile.remove).toHaveBeenCalledWith('fixture-widget-id');
    expect(window.turnstile.render).toHaveBeenCalledTimes(2);
  });
});

describe('Turnstile lifecycle regressions', () => {
  it('loads the script and renders the widget only once', () => {
    vi.useFakeTimers();
    const api = window.turnstile;
    delete window.turnstile;
    render(<RegisterEvent />);
    expect(screen.getByRole('status')).toHaveTextContent(/challenge loading/i);
    const script = getScript();
    expect(script).toHaveAttribute('src', TURNSTILE_SCRIPT);
    expect(script.async).toBe(true);
    window.turnstile = api;
    fireEvent.load(script);
    fireEvent.load(script);
    expect(api.render).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByRole('status')).toHaveTextContent(/Complete the anti-automation challenge/i);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('shows a retryable state on script error and loads a fresh script on retry', async () => {
    const api = window.turnstile;
    delete window.turnstile;
    render(<RegisterEvent />);
    const failedScript = getScript();
    fireEvent.error(failedScript);
    expect(failedScript.isConnected).toBe(false);
    expect(screen.getByRole('status')).toHaveTextContent(/temporarily unavailable/i);
    expect(fetch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Run a new challenge' }));
    const retryScript = getScript();
    expect(retryScript).not.toBe(failedScript);
    expect(screen.getByRole('status')).toHaveTextContent(/challenge loading/i);
    window.turnstile = api;
    fireEvent.load(failedScript);
    expect(api.render).not.toHaveBeenCalled();
    fireEvent.load(retryScript);
    fetch.mockResolvedValue(successfulResponse());
    await completeChallenge();
    expect(screen.getByText(FIXTURE_TOKEN)).toBeInTheDocument();
  });

  it.each([false, true])('bounds a stalled script load (existing script: %s) and recovers on retry', (existing) => {
    vi.useFakeTimers();
    const api = window.turnstile;
    delete window.turnstile;
    if (existing) {
      const script = document.createElement('script');
      script.src = TURNSTILE_SCRIPT;
      document.head.append(script);
    }
    render(<RegisterEvent />);
    const stalledScript = getScript();
    expect(document.querySelectorAll(`script[src="${TURNSTILE_SCRIPT}"]`)).toHaveLength(1);
    act(() => vi.advanceTimersByTime(9999));
    expect(screen.getByRole('status')).toHaveTextContent(/challenge loading/i);
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('status')).toHaveTextContent(/temporarily unavailable/i);
    expect(stalledScript.isConnected).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Run a new challenge' }));
    window.turnstile = api;
    fireEvent.load(getScript());
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByRole('status')).toHaveTextContent(/Complete the anti-automation challenge/i);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('rejects a loaded script without a usable Turnstile API', () => {
    delete window.turnstile;
    render(<RegisterEvent />);
    fireEvent.load(getScript());
    expect(getScript()).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent(/temporarily unavailable/i);
    expect(screen.getByRole('button', { name: 'Run a new challenge' })).toBeInTheDocument();
  });

  it('handles widget initialization errors and retries rendering', () => {
    window.turnstile.render.mockImplementationOnce(() => { throw new Error('fixture render error'); });
    render(<RegisterEvent />);
    expect(screen.getByRole('status')).toHaveTextContent(/temporarily unavailable/i);
    fireEvent.click(screen.getByRole('button', { name: 'Run a new challenge' }));
    expect(window.turnstile.render).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('status')).toHaveTextContent(/Complete the anti-automation challenge/i);
  });

  it.each(['expired-callback', 'error-callback', 'timeout-callback'])('preserves the issued token and copy action after %s', async (callback) => {
    fetch.mockResolvedValue(successfulResponse());
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockResolvedValue() } });
    render(<RegisterEvent />);
    await completeChallenge();
    act(() => options[callback]());
    expect(screen.getByText(FIXTURE_TOKEN)).toBeInTheDocument();
    expect(screen.getByText('Registration token ready.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Continue to Element registration' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Run a new challenge' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Copy registration token' }));
    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith(FIXTURE_TOKEN));
    await completeChallenge('TEST-ONLY-DUPLICATE-RESPONSE');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it.each(['expired-callback', 'error-callback', 'timeout-callback'])('does not interrupt an in-flight request after %s', async (callback) => {
    let finishRequest;
    fetch.mockImplementation(() => new Promise((resolve) => { finishRequest = resolve; }));
    render(<RegisterEvent />);
    let pending;
    act(() => { pending = options.callback('TEST-ONLY-RESPONSE'); });
    act(() => options[callback]());
    expect(screen.getByRole('status')).toHaveTextContent(/Request in progress/i);
    expect(screen.queryByRole('button', { name: 'Run a new challenge' })).not.toBeInTheDocument();
    await act(async () => { finishRequest(successfulResponse()); await pending; });
    expect(screen.getByText(FIXTURE_TOKEN)).toBeInTheDocument();
  });

  it('requires a manual retry after an error and ignores callbacks from the old widget', async () => {
    fetch.mockResolvedValue(successfulResponse());
    render(<RegisterEvent />);
    const oldOptions = options;
    act(() => oldOptions['error-callback']());
    await completeChallenge('TEST-ONLY-AUTOMATIC-RETRY');
    expect(fetch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Run a new challenge' }));
    expect(options).not.toBe(oldOptions);
    act(() => oldOptions['expired-callback']());
    await act(async () => { await oldOptions.callback('TEST-ONLY-STALE-RESPONSE'); });
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent(/Complete the anti-automation challenge/i);
    await completeChallenge('TEST-ONLY-FRESH-RESPONSE');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify({ turnstile_response: 'TEST-ONLY-FRESH-RESPONSE' }));
    expect(screen.getByText(FIXTURE_TOKEN)).toBeInTheDocument();
  });

  it('bounds backend requests and ignores a late response after timeout and retry', async () => {
    vi.useFakeTimers();
    let finishRequest;
    fetch.mockImplementationOnce(() => new Promise((resolve) => { finishRequest = resolve; }));
    render(<RegisterEvent />);
    let pending;
    act(() => { pending = options.callback('TEST-ONLY-SLOW-RESPONSE'); });
    const signal = fetch.mock.calls[0][1].signal;
    act(() => vi.advanceTimersByTime(10000));
    expect(signal.aborted).toBe(true);
    expect(screen.getByRole('status')).toHaveTextContent(/temporarily unavailable/i);
    fireEvent.click(screen.getByRole('button', { name: 'Run a new challenge' }));
    fetch.mockResolvedValue(successfulResponse());
    await completeChallenge('TEST-ONLY-FRESH-RESPONSE');
    await act(async () => {
      finishRequest({ ok: true, status: 200, json: async () => ({ registration_token: 'TEST-ONLY-STALE-TOKEN' }) });
      await pending;
    });
    expect(screen.getByText(FIXTURE_TOKEN)).toBeInTheDocument();
    expect(screen.queryByText('TEST-ONLY-STALE-TOKEN')).not.toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('removes pending script listeners and timers on unmount', () => {
    vi.useFakeTimers();
    const api = window.turnstile;
    delete window.turnstile;
    const view = render(<RegisterEvent />);
    const script = getScript();
    view.unmount();
    expect(script.isConnected).toBe(false);
    window.turnstile = api;
    fireEvent.load(script);
    fireEvent.error(script);
    expect(api.render).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('aborts an in-flight request and disposes the widget on unmount', async () => {
    vi.useFakeTimers();
    let finishRequest;
    fetch.mockImplementationOnce(() => new Promise((resolve) => { finishRequest = resolve; }));
    const view = render(<RegisterEvent />);
    const oldOptions = options;
    let pending;
    act(() => { pending = oldOptions.callback('TEST-ONLY-RESPONSE'); });
    const signal = fetch.mock.calls[0][1].signal;
    view.unmount();
    expect(signal.aborted).toBe(true);
    expect(window.turnstile.remove).toHaveBeenCalledWith('fixture-widget-id');
    await act(async () => { finishRequest(successfulResponse()); await pending; });
    await act(async () => { await oldOptions.callback('TEST-ONLY-STALE-RESPONSE'); });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(FIXTURE_TOKEN)).not.toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cleans up and recreates the widget during Strict Mode effect replay', async () => {
    const view = render(<StrictMode><RegisterEvent /></StrictMode>);
    expect(window.turnstile.render).toHaveBeenCalledTimes(2);
    expect(window.turnstile.remove).toHaveBeenCalledTimes(1);
    const oldOptions = window.turnstile.render.mock.calls[0][1];
    await act(async () => { await oldOptions.callback('TEST-ONLY-STALE-RESPONSE'); });
    expect(fetch).not.toHaveBeenCalled();
    fetch.mockResolvedValue(successfulResponse());
    await completeChallenge();
    expect(screen.getByText(FIXTURE_TOKEN)).toBeInTheDocument();
    view.unmount();
    expect(window.turnstile.remove).toHaveBeenCalledTimes(2);
  });

  it.each([320, 375])('uses compact sizing at a %spx viewport with space for its 140px height', (width) => {
    vi.stubGlobal('innerWidth', width);
    render(<RegisterEvent />);
    expect(options.size).toBe('compact');
    expect(screen.getByLabelText('Anti-automation challenge')).toHaveClass('min-h-[140px]');
  });

  it.each([null, {}, { registration_token: '' }])('handles malformed backend success data without revealing a token: %j', async (body) => {
    fetch.mockResolvedValue({ ok: true, status: 200, json: async () => body });
    render(<RegisterEvent />);
    await completeChallenge();
    expect(screen.getByRole('status')).toHaveTextContent(/temporarily unavailable/i);
    expect(screen.queryByText(FIXTURE_TOKEN)).not.toBeInTheDocument();
  });
});
