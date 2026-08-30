import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const renderPath = (path) => { window.history.pushState({}, '', path); return render(<App />); };
beforeEach(() => { vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {}))); });
afterEach(() => { vi.unstubAllGlobals(); document.title = ''; document.head.querySelectorAll('link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"], meta[name="robots"]').forEach((node) => node.remove()); });

describe('CK Conflux application architecture', () => {
  it('renders the compact promotional Home and primary destinations', () => {
    renderPath('/');
    expect(screen.getByRole('heading', { name: /Private community chat, secure messaging/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Open Element' })[1]).toHaveAttribute('href', 'https://element.ckconflux.com');
    expect(screen.getByRole('link', { name: 'Create Account' })).toHaveAttribute('href', '/join');
    expect(screen.getByRole('link', { name: /Explore Element Call/i })).toHaveAttribute('href', '/calls');
    expect(document.querySelector('#main-content')).not.toHaveTextContent('TeamSpeak');
  });

  it.each([
    ['/about', 'About CK Conflux'], ['/why-ck-conflux', 'Why CK Conflux'], ['/join', 'Create your CK Conflux Matrix account'], ['/matrix', 'Open communication, with a community you know'], ['/calls', 'Element Call'],
    ['/membership', 'Membership'], ['/security', 'Security'], ['/privacy', 'CK Conflux Privacy Model'], ['/status', 'Service status'],
    ['/help', 'Matrix onboarding, FAQ, and support resources'], ['/support', 'Support'], ['/teamspeak', 'TeamSpeak 6 Beta'],
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
    expect(screen.getAllByRole('link', { name: 'Open Element' })[0]).toHaveAttribute('href', 'https://element.ckconflux.com');
  });

  it('renders the independent service status badge without replacing footer navigation', () => {
    renderPath('/');
    const badge = screen.getByRole('img', { name: 'CK Conflux service status' });
    expect(badge).toHaveAttribute('src', 'https://badge.uptimerobot.com/psp/177dfd29052bc6cc25407cf35076378b.svg?style=text&theme=dark');
    expect(badge.closest('a')).toHaveAttribute('href', 'https://status.ckconflux.com?utm_source=status_badge&utm_medium=referral');
    expect(badge.closest('a')).toHaveAttribute('target', '_blank');
    expect(badge.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('navigation', { name: 'Explore links' })).toHaveTextContent('Status');
    expect(screen.getByRole('navigation', { name: 'Explore links' })).toHaveTextContent('About');
    expect(screen.getByRole('navigation', { name: 'Community links' })).toHaveTextContent('Support');
    expect(screen.getByRole('navigation', { name: 'Legal links' })).toHaveTextContent('Privacy');
  });

  it('explains CK Conflux operator boundaries and community-run availability', () => {
    renderPath('/about');
    expect(screen.getByText(/independently and community-operated/i)).toHaveTextContent(/not operated by Element or the Matrix.org Foundation/i);
    expect(screen.getByRole('heading', { name: 'Who does what?' }).closest('section')).toHaveTextContent(/Element.*recommended app.*does not operate CK Conflux/i);
    expect(screen.getByRole('heading', { name: 'Who does what?' }).closest('section')).toHaveTextContent(/Matrix.*protocol and federated network.*Matrix.org Foundation does not operate CK Conflux/i);
    expect(screen.getByText(/does not control third-party homeservers/i)).toBeInTheDocument();
    expect(screen.getByText(/best-effort and community-run/i)).toHaveTextContent(/does not promise an SLA/i);
    expect(screen.getByRole('link', { name: 'View status' })).toHaveAttribute('href', '/status');
    expect(screen.getByRole('link', { name: 'Independent status page' })).toHaveAttribute('href', 'https://status.ckconflux.com');
    expect(screen.getByRole('link', { name: 'Open Support' })).toHaveAttribute('href', '/support');
    expect(screen.getByText(/Server Notices or official rooms/i)).toBeInTheDocument();
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

  it('labels both default media limits and explains how they differ', () => {
    renderPath('/membership');
    expect(screen.getByRole('heading', { name: /Communication is for the community/i })).toBeInTheDocument();
    expect(screen.getByText(/Critical messaging, calls, and community participation remain free/i)).toBeInTheDocument();
    expect(screen.getByText('Total stored-media capacity')).toBeInTheDocument();
    expect(screen.getByText('Monthly media allowance')).toBeInTheDocument();
    expect(screen.getByText('Total stored-media capacity').closest('div')).toHaveTextContent('10 GiB');
    expect(screen.getByText('Monthly media allowance').closest('div')).toHaveTextContent('1 GiB');
    expect(screen.getByText('10,737,418,240 bytes')).toBeInTheDocument();
    expect(screen.getByText('1,073,741,824 bytes')).toBeInTheDocument();
    expect(screen.getByText(/The total capacity is how much media/i)).toHaveTextContent(/reach the monthly limit.*still have room/i);
    expect(screen.getByText(/roughly 1 MB per photo/i)).toHaveTextContent(/on the order of 10,000 stored photos/);
    expect(screen.getByText(/This total-capacity example is only an illustration/i).closest('p')).toHaveTextContent(/not a monthly upload guarantee/);
    expect(document.body).not.toHaveTextContent(/unlock essential messaging|paid-only messaging|premium messaging/i);
  });

  it('keeps My Account distinct from Element throughout the membership flow', () => {
    renderPath('/membership');
    const accountLinks = screen.getAllByRole('link', { name: /My Account/i });
    expect(accountLinks.some((link) => link.getAttribute('href') === 'https://account.ckconflux.com')).toBe(true);
    expect(screen.getByText(/Membership, storage, and account administration/)).toHaveTextContent(/authoritative.*actual current total capacity, monthly allowance, usage, and entitlement/i);
    expect(screen.getByText(/Messaging, community rooms, and calls/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Open Element' }).some((link) => link.getAttribute('href') === 'https://element.ckconflux.com')).toBe(true);
  });

  it('explains media constraints and lifecycle without promising permanent or global retention', () => {
    renderPath('/membership');
    expect(screen.getByText(/Community per-file limit:/i)).toHaveTextContent('100 MB');
    expect(screen.getByText(/This applies to each individual upload/i)).toHaveTextContent(/10 GiB total capacity does not permit one file that large/i);
    expect(screen.getByText(/higher backend technical ceiling/i)).toHaveTextContent(/not a user entitlement/i);
    expect(screen.getByText(/CK Conflux local media lifecycle:/i)).toHaveTextContent('1 year');
    expect(screen.getByText(/Federated media cache lifecycle:/i).closest('p')).toHaveTextContent(/2 days.*does not necessarily delete the original/i);
    expect(screen.getByText(/Federation means CK Conflux cannot promise global deletion/i)).toHaveTextContent(/outside CK Conflux’s unilateral control/i);
    expect(screen.getByText(/Encrypted Matrix media may be stored as ciphertext/i)).toHaveTextContent(/does not imply CK Conflux can inspect its plaintext/i);
    expect(screen.getByText(/durable allocated account and media capacity/i)).toHaveTextContent(/does not mean permanent or stored forever/i);
    expect(screen.getByText(/CK Conflux local media lifecycle:/i).closest('p')).toHaveTextContent(/not a promise of permanent retention/i);
  });

  it('offers a voluntary supporter path while My Account remains authoritative', () => {
    renderPath('/membership');
    expect(screen.getByRole('link', { name: 'Support CK Conflux' })).toHaveAttribute('href', 'https://buymeacoffee.com/conflux');
    expect(screen.getByText(/Support is voluntary/i)).toHaveTextContent(/Critical messaging, calls, and community participation remain free/i);
    expect(screen.getByText(/Membership, storage, and account administration/)).toHaveTextContent(/My Account is authoritative/i);
    expect(document.body).not.toHaveTextContent(/\$\d+|per month|supporter tier.*GiB/i);
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
    fireEvent.click(screen.getByRole('link', { name: /Explore Matrix and Element/i }));
    expect(window.location.pathname).toBe('/matrix');
    expect(screen.getByRole('heading', { name: /Open communication/i })).toBeInTheDocument();
    act(() => { window.history.pushState({}, '', '/rules'); window.dispatchEvent(new PopStateEvent('popstate')); });
    expect(screen.getByRole('heading', { name: 'Server Rules' })).toBeInTheDocument();
  });

  it('keeps an exact same-URL navigation as a no-op', () => {
    renderPath('/');
    const pushState = vi.spyOn(window.history, 'pushState');
    fireEvent.click(screen.getByRole('link', { name: 'CK Conflux' }));
    expect(pushState).not.toHaveBeenCalled();
  });

  it('clears a stale fragment when navigating to the current pathname and restores page focus', () => {
    renderPath('/#signin');
    fireEvent.click(screen.getByRole('link', { name: 'CK Conflux' }));
    expect(window.location.pathname).toBe('/');
    expect(window.location.hash).toBe('');
    expect(screen.getByRole('heading', { name: /Private community chat/i })).toHaveFocus();
  });

  it('clears stale search state when navigating to the same pathname', () => {
    renderPath('/help?source=old');
    fireEvent.click(screen.getByRole('navigation', { name: 'Primary navigation' }).querySelector('a[href="/help"]'));
    expect(window.location.pathname).toBe('/help');
    expect(window.location.search).toBe('');
    expect(screen.getByRole('heading', { name: /Matrix onboarding/i })).toHaveFocus();
  });

  it('preserves initial focus and moves focus after client navigation', () => {
    renderPath('/');
    const homeHeading = screen.getByRole('heading', { name: /Private community chat, secure messaging/i });
    expect(homeHeading).not.toHaveFocus();
    fireEvent.click(screen.getByRole('link', { name: /Explore Matrix and Element/i }));
    const matrixHeading = screen.getByRole('heading', { name: /Open communication/i });
    expect(matrixHeading).toHaveFocus();
    expect(matrixHeading).toHaveAttribute('tabindex', '-1');
  });

  it('updates title, canonical, Open Graph, and social metadata', async () => {
    renderPath('/security');
    await waitFor(() => expect(document.title).toBe('Security | CK Conflux'));
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://ckconflux.com/security');
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute('content', 'Security | CK Conflux');
    expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', 'Learn about Matrix encryption, secure backup, recovery keys, device verification, and federation boundaries.');
    expect(document.querySelector('meta[name="robots"]')).not.toBeInTheDocument();
  });

  it('removes a prerendered 404 robots directive on a valid route', async () => {
    document.head.insertAdjacentHTML('beforeend', '<meta name="robots" content="noindex, nofollow">');
    renderPath('/');
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')).not.toBeInTheDocument());
  });

  it('applies noindex metadata to an unknown route', async () => {
    renderPath('/does-not-exist');
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow'));
    expect(document.title).toBe('Page Not Found | CK Conflux');
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://ckconflux.com/does-not-exist');
  });

  it('removes 404 robots metadata after client navigation to a valid route', async () => {
    renderPath('/does-not-exist');
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('link', { name: 'CK Conflux' }));
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')).not.toBeInTheDocument());
    expect(document.title).toBe('CK Conflux');
  });

  it('applies 404 robots metadata after client navigation to an unknown route', async () => {
    renderPath('/help');
    act(() => { window.history.pushState({}, '', '/missing'); window.dispatchEvent(new PopStateEvent('popstate')); });
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow'));
    expect(screen.getByRole('heading', { name: 'Page not found' })).toHaveFocus();
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
    expect(screen.getByRole('link', { name: 'Create Account' })).toHaveAttribute('href', '/join');
    expect(screen.getAllByRole('link', { name: 'Open Element' })[0]).toHaveAttribute('href', 'https://element.ckconflux.com');
    expect(screen.getAllByRole('link', { name: 'Calls' }).some((link) => link.getAttribute('href') === '/calls')).toBe(true);
    expect(screen.getByRole('link', { name: 'Security & recovery' })).toHaveAttribute('href', '/security');
    expect(screen.getByRole('link', { name: 'Help center' })).toHaveAttribute('href', '/help');
  });

  it('guides prospective members through current registration and recovery contracts', () => {
    renderPath('/join');
    expect(screen.getByRole('heading', { name: 'Who can join?' })).toBeInTheDocument();
    expect(screen.getByText(/invitation-based community for people aged 18 or older/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Why require a token?' })).toBeInTheDocument();
    expect(screen.getByText(/existing CK Conflux member/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Buy Me a Coffee' })).toHaveAttribute('href', 'https://buymeacoffee.com/conflux');
    expect(screen.getByText(/Invitation from an existing CK Conflux member is one path/i)).toHaveTextContent(/Payment is not required to join/i);
    expect(screen.getByText(/token, an available username, an email address, and an account password/i)).toBeInTheDocument();
    expect(screen.getByText(/makes the enabled password-recovery path possible/i)).toBeInTheDocument();
    expect(screen.getByText('@name:ckconflux.com')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Password ≠ recovery key' })).toBeInTheDocument();
    expect(screen.getByText(/A password reset does not recover that encrypted history/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Continue to Element registration' })).toHaveAttribute('href', 'https://element.ckconflux.com/#/register');
    expect(screen.getAllByRole('link', { name: 'Open Element' }).every((link) => link.getAttribute('href') === 'https://element.ckconflux.com')).toBe(true);
    expect(screen.getByRole('link', { name: 'Email account support' })).toHaveAttribute('href', 'mailto:support@ckconflux.com');
    expect(document.body).not.toHaveTextContent(/riot\.colonelkrud\.com|matrix\.colonelkrud\.com|24-hour|password complexity/i);
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

  it('exposes Mastodon as a secondary service from Help without changing primary navigation', () => {
    renderPath('/help');
    fireEvent.click(screen.getByRole('button', { name: /What about Mastodon or TeamSpeak support?/ }));
    expect(screen.getByRole('link', { name: 'Open CK Conflux Mastodon' })).toHaveAttribute('href', 'https://masto.colonelkrud.com');
    expect(screen.getByText(/secondary supported social service/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'TeamSpeak page' })).toHaveAttribute('href', '/teamspeak');
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).not.toHaveTextContent('Mastodon');
  });

  it('does not market Foundry VTT', () => {
    for (const path of ['/', '/why-ck-conflux', '/matrix', '/calls', '/teamspeak', '/privacy', '/security', '/help', '/support']) {
      const view = renderPath(path);
      expect(document.body).not.toHaveTextContent(/Foundry VTT/i);
      view.unmount();
    }
  });

  it('explains federation and the CK Conflux privacy commitments', () => {
    renderPath('/why-ck-conflux');
    expect(screen.getByText(/community-operated Matrix homeserver and community/i)).toBeInTheDocument();
    expect(screen.getByText(/does not sell user personal information/i)).toBeInTheDocument();
    expect(screen.getByText(/does not use users’ private conversations or content to train AI models/i)).toBeInTheDocument();
    expect(screen.getByText(/does not display advertising/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'How Matrix works' })).toHaveAttribute('href', '/matrix');
  });

  it('presents a service-wide privacy model without blanket media scanning', () => {
    renderPath('/privacy');
    expect(screen.getByRole('heading', { name: 'CK Conflux Privacy Model' })).toBeInTheDocument();
    expect(document.body).toHaveTextContent(/Matrix.*Mastodon.*TeamSpeak/s);
    expect(document.body).not.toHaveTextContent('All uploaded content is scanned');
  });

  it('does not claim encrypted Matrix media is universally scanned', () => {
    renderPath('/rules');
    expect(document.body).not.toHaveTextContent('All uploaded content is scanned');
    expect(document.body).toHaveTextContent(/encrypted Matrix media may be stored only as ciphertext/i);
  });

  it('covers recovery keys and device verification in Security and Help', () => {
    for (const path of ['/security', '/help']) {
      const view = renderPath(path);
      expect(document.body).toHaveTextContent(/recovery key/i);
      expect(document.body).toHaveTextContent(/verify.*device|device.*verif/i);
      view.unmount();
    }
  });

  it('routes support intents and exposes the independent status link', () => {
    renderPath('/support');
    expect(screen.getByRole('heading', { name: 'Forgot account password' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Verification email problem' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Can sign in but old encrypted messages are unavailable' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'No recovery key and no verified device' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Harassment or abuse' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Privacy or data request' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Service outage' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Membership or storage' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Reset password in Element' })).toHaveAttribute('href', 'https://element.ckconflux.com/#/forgot_password');
    expect(screen.getByRole('link', { name: 'Reset password in Element' }).compareDocumentPosition(screen.getAllByRole('link', { name: 'Email account support' })[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByText(/password reset does not recreate encryption keys/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Email security' })).toHaveAttribute('href', 'mailto:abuse@mg.ckconflux.com');
    expect(screen.getByRole('link', { name: 'Email abuse' })).toHaveAttribute('href', 'mailto:abuse@mg.ckconflux.com');
    expect(screen.getByRole('link', { name: 'Privacy contact' })).toHaveAttribute('href', 'mailto:abuse@mg.ckconflux.com');
    expect(screen.getByRole('link', { name: 'Independent status page' })).toHaveAttribute('href', 'https://status.ckconflux.com');
  });

  it.each([
    ['/privacy', ['abuse@mg.ckconflux.com']],
    ['/terms', ['abuse@mg.ckconflux.com']],
    ['/support', ['support@ckconflux.com', 'abuse@mg.ckconflux.com']],
  ])('publishes only canonical contact addresses on %s', (path, expectedAddresses) => {
    renderPath(path);
    const addresses = [...document.querySelectorAll('a[href^="mailto:"]')]
      .map((link) => link.getAttribute('href').slice('mailto:'.length));

    expect(new Set(addresses)).toEqual(new Set(expectedAddresses));
    expect(addresses).not.toContain('abuse@ckconflux.com');
    expect(addresses).not.toContain('security@ckconflux.com');
    expect(addresses).not.toContain('privacy@ckconflux.com');
  });

  it('renders successful component status and its generation time', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ generated_at: '2026-08-26T12:00:00Z', components: { website: 'healthy', authentication: 'up', matrix: 'operational', media: 'ok', calls: 'available', membership: 'passing' } }) });
    renderPath('/status');
    expect(await screen.findByText('Overall: Operational')).toBeInTheDocument();
    expect(screen.getByText('Matrix messaging')).toBeInTheDocument();
    expect(screen.getByText('Voice / video calls')).toBeInTheDocument();
    expect(screen.getByText(/Status payload updated:/)).toBeInTheDocument();
  });

  it('renders degraded status without claiming all systems operational', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ components: { website: 'operational', matrix: 'degraded' } }) });
    renderPath('/');
    expect(await screen.findByText('Some systems are degraded')).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent('All systems operational');
  });

  it.each([
    ['failed request', () => Promise.reject(new Error('offline'))],
    ['malformed response', () => Promise.resolve({ ok: true, json: async () => ({ message: 'no component data' }) })],
  ])('shows unknown status for a %s', async (_name, response) => {
    fetch.mockImplementation(response);
    renderPath('/status');
    expect(await screen.findByRole('heading', { name: 'Local status unavailable / unknown' })).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent('All systems operational');
  });

  it('prominently links the authoritative independent status host', () => {
    renderPath('/status');
    expect(screen.getByRole('link', { name: 'Open independent status page' })).toHaveAttribute('href', 'https://status.ckconflux.com');
    expect(document.body).not.toHaveTextContent('status.colonelkrud.com');
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
