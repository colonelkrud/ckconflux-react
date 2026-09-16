import { act, cleanup, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import RegisterEvent from './RegisterEvent';
import { ELEMENT_REGISTRATION_URL, REGISTRATION_EVENT } from '../config/registrationEvent';

const FIXTURE_TOKEN = 'TEST-ONLY-OPTIONAL-FIELDS-TOKEN-NOT-A-CREDENTIAL';
const FIXTURE_CAMPAIGN = 'TEST-ONLY-CAMPAIGN';
const FIXTURE_EXPIRY = '2026-10-01T00:00:00Z';
const INVALID_OPTIONAL_FIELDS = [
  ['missing', undefined],
  ['null', null],
  ['object', { unexpected: 'value' }],
  ['array', ['unexpected']],
  ['number', 42],
  ['boolean', true],
  ['empty string', ''],
  ['whitespace', '  \t'],
];
let options;

beforeEach(() => {
  options = undefined;
  vi.stubGlobal('turnstile', {
    render: vi.fn((_node, value) => { options = value; return 'review-fixture-widget'; }),
    remove: vi.fn(),
  });
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.head.querySelectorAll('link[rel="canonical"], meta[name="robots"]').forEach((node) => node.remove());
  window.history.replaceState({}, '', '/');
});

async function issueToken(fields) {
  // JSON round-tripping models omitted fields and values from the real endpoint.
  const body = JSON.parse(JSON.stringify({ registration_token: FIXTURE_TOKEN, ...fields }));
  fetch.mockImplementation((url) => Promise.resolve(url === REGISTRATION_EVENT.configEndpoint
    ? { status: 200, json: async () => ({ sitekey: 'TEST-ONLY-REVIEW-SITEKEY', action: REGISTRATION_EVENT.action }) }
    : { ok: true, status: 200, json: async () => body }));
  render(<RegisterEvent />);
  await waitFor(() => expect(options).toBeDefined());
  await act(async () => { await options.callback('TEST-ONLY-REVIEW-RESPONSE'); });
}

function expectUsableToken() {
  expect(screen.getByText(FIXTURE_TOKEN)).toBeInTheDocument();
  expect(screen.getByText('Registration token ready.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Copy registration token' })).toBeEnabled();
  expect(screen.getByRole('link', { name: 'Continue to Element registration' })).toHaveAttribute('href', ELEMENT_REGISTRATION_URL);
  expect(screen.queryByRole('button', { name: 'Run a new challenge' })).not.toBeInTheDocument();
}

function renderRoute(path) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

describe('registration response metadata validation', () => {
  it.each(INVALID_OPTIONAL_FIELDS)('uses the campaign fallback for %s metadata without losing the token or expiry', async (_name, campaign) => {
    await issueToken({ campaign, expires_at: FIXTURE_EXPIRY });
    expectUsableToken();
    expect(screen.getByText(`Campaign: ${REGISTRATION_EVENT.campaign}`)).toBeInTheDocument();
    expect(screen.getByText(FIXTURE_EXPIRY)).toHaveAttribute('datetime', FIXTURE_EXPIRY);
  });

  it.each(INVALID_OPTIONAL_FIELDS)('omits %s expiry metadata without losing the token or campaign', async (_name, expiresAt) => {
    await issueToken({ campaign: FIXTURE_CAMPAIGN, expires_at: expiresAt });
    expectUsableToken();
    expect(screen.getByText(`Campaign: ${FIXTURE_CAMPAIGN}`)).toBeInTheDocument();
    expect(document.querySelector('time')).not.toBeInTheDocument();
    expect(screen.queryByText(/Expires:/)).not.toBeInTheDocument();
  });

  it('safely handles both optional fields being objects in the same response', async () => {
    await issueToken({ campaign: { name: FIXTURE_CAMPAIGN }, expires_at: { date: FIXTURE_EXPIRY } });
    expectUsableToken();
    expect(screen.getByText(`Campaign: ${REGISTRATION_EVENT.campaign}`)).toBeInTheDocument();
    expect(screen.queryByText(/Expires:/)).not.toBeInTheDocument();
  });

  it('preserves valid server-supplied string metadata', async () => {
    await issueToken({ campaign: FIXTURE_CAMPAIGN, expires_at: FIXTURE_EXPIRY });
    expectUsableToken();
    expect(screen.getByText(`Campaign: ${FIXTURE_CAMPAIGN}`)).toBeInTheDocument();
    expect(screen.getByText(FIXTURE_EXPIRY)).toHaveAttribute('datetime', FIXTURE_EXPIRY);
  });
});

describe('registration and migration review copy', () => {
  it('describes all three supported token paths on the join route', () => {
    renderRoute('/join');
    expect(screen.getByText('Choose one of the three supported paths below. Each provides the registration code needed to create an account.')).toBeInTheDocument();
    expect(screen.queryByText(/Choose either supported path|Both provide/)).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 4 }).map((heading) => heading.textContent)).toEqual([
      'Already know a member?',
      'Need a free registration token?',
      'Want to support the community?',
    ]);
    expect(screen.getByRole('link', { name: 'Open community registration' })).toHaveAttribute('href', '/register-event');
    expect(screen.queryByText('Open Autumn 2026 Community Registration')).not.toBeInTheDocument();
    expect(screen.getByText('Payment is not required to join CK Conflux.')).toBeInTheDocument();
  });

  it.each([
    ['/migrate', 'Migration page links', 'Campaign page links'],
    ['/register-event', 'Campaign page links', 'Migration page links'],
  ])('preserves the footer navigation accessible name on %s', (path, expectedLabel, otherLabel) => {
    renderRoute(path);
    const footer = screen.getByRole('navigation', { name: expectedLabel });
    expect(screen.queryByRole('navigation', { name: otherLabel })).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument();
    for (const [name, href] of [['Help', '/help'], ['Support', '/support'], ['Terms', '/terms'], ['Rules', '/rules'], ['Privacy', '/privacy']]) {
      expect(within(footer).getByRole('link', { name })).toHaveAttribute('href', href);
    }
  });
});
