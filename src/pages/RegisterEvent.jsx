import { useCallback, useEffect, useRef, useState } from 'react';
import { ELEMENT_REGISTRATION_URL, REGISTRATION_EVENT } from '../config/registrationEvent';

const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const REQUEST_TIMEOUT_MS = 10000;

function messageFor(state) {
  return {
    loading: 'Anti-automation challenge loading…',
    ready: 'Complete the anti-automation challenge to request a token.',
    verified: 'Verification complete. Requesting your registration token…',
    requesting: 'Request in progress…',
    expired: 'The challenge expired. Run it again to request a token.',
    rejected: 'The challenge was rejected. Run it again to retry.',
    unavailable: 'Registration is temporarily unavailable. Run a new challenge to retry.',
    limited: 'Too many requests. Please wait, then run a new challenge to retry.',
  }[state] ?? '';
}

export default function RegisterEvent() {
  const widgetHost = useRef(null);
  const widgetId = useRef(null);
  const consumedResponse = useRef(false);
  const [state, setState] = useState('loading');
  const [result, setResult] = useState(null);
  const [copyState, setCopyState] = useState('idle');

  const requestToken = useCallback(async (turnstileResponse) => {
    if (!turnstileResponse || consumedResponse.current) return;
    consumedResponse.current = true;
    setResult(null);
    setState('verified');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      setState('requesting');
      const response = await fetch(REGISTRATION_EVENT.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turnstile_response: turnstileResponse }),
        signal: controller.signal,
      });
      if (response.status === 429) { setState('limited'); return; }
      if (!response.ok) { setState(response.status >= 500 ? 'unavailable' : 'rejected'); return; }
      const body = await response.json();
      if (typeof body.registration_token !== 'string' || !body.registration_token) { setState('unavailable'); return; }
      setResult({ campaign: body.campaign || REGISTRATION_EVENT.campaign, token: body.registration_token, expiresAt: body.expires_at || null });
      setState('success');
    } catch {
      setState('unavailable');
    } finally {
      clearTimeout(timeout);
    }
  }, []);

  const renderWidget = useCallback(() => {
    if (!widgetHost.current || !window.turnstile || widgetId.current !== null) return;
    widgetId.current = window.turnstile.render(widgetHost.current, {
      sitekey: REGISTRATION_EVENT.sitekey,
      action: REGISTRATION_EVENT.action,
      callback: requestToken,
      'expired-callback': () => { consumedResponse.current = true; setResult(null); setState('expired'); },
      'error-callback': () => { consumedResponse.current = true; setResult(null); setState('rejected'); },
    });
    setState('ready');
  }, [requestToken]);

  useEffect(() => {
    if (window.turnstile) { renderWidget(); return undefined; }
    const existing = document.querySelector(`script[src="${TURNSTILE_SCRIPT}"]`);
    const script = existing || document.createElement('script');
    const onLoad = () => renderWidget();
    script.addEventListener('load', onLoad);
    if (!existing) { script.src = TURNSTILE_SCRIPT; script.async = true; script.defer = true; document.head.append(script); }
    return () => script.removeEventListener('load', onLoad);
  }, [renderWidget]);

  const retry = () => {
    consumedResponse.current = false;
    setResult(null);
    setCopyState('idle');
    setState('ready');
    if (widgetId.current !== null) window.turnstile?.reset(widgetId.current);
  };

  const copyToken = async () => {
    if (!navigator.clipboard?.writeText) { setCopyState('unavailable'); return; }
    try { await navigator.clipboard.writeText(result.token); setCopyState('copied'); }
    catch { setCopyState('unavailable'); }
  };

  return <>
    <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_55%)]"><div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Free registration event</p><h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">{REGISTRATION_EVENT.campaign}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Request the currently active free-registration token after a short anti-abuse and anti-automation check. This check is not proof of identity and does not guarantee admission.</p>
    </div></section>
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"><div className="rounded-2xl border border-cyan-300/25 bg-cyan-400/[0.07] p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-white">Request a free registration token</h2>
      <div ref={widgetHost} className="mt-5 min-h-[70px]" aria-label="Anti-automation challenge" />
      <p className="mt-3 text-sm text-slate-300" role="status" aria-live="polite">{state === 'success' ? 'Registration token ready.' : messageFor(state)}</p>
      {['expired', 'rejected', 'unavailable', 'limited'].includes(state) && <button type="button" onClick={retry} className="mt-4 rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white">Run a new challenge</button>}
      {result && <div className="mt-6" aria-labelledby="registration-token-heading"><h3 id="registration-token-heading" className="font-semibold text-white">Your registration token</h3><p className="mt-2 text-sm text-slate-300">Campaign: {result.campaign}</p><div className="mt-3 flex flex-col gap-3 sm:flex-row"><code className="min-w-0 select-all overflow-x-auto rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-base font-semibold text-cyan-200">{result.token}</code><button type="button" onClick={copyToken} aria-label="Copy registration token" className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white">{copyState === 'copied' ? 'Copied!' : 'Copy token'}</button></div>{result.expiresAt && <p className="mt-3 text-sm text-slate-300">Expires: <time dateTime={result.expiresAt}>{result.expiresAt}</time></p>}<p className="mt-3 min-h-6 text-sm text-slate-300" role="status" aria-live="polite">{copyState === 'copied' ? 'Registration token copied.' : copyState === 'unavailable' ? 'Copy unavailable. Select and copy the token manually.' : ''}</p><a href={ELEMENT_REGISTRATION_URL} className="mt-3 inline-flex w-full justify-center rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 sm:w-auto">Continue to Element registration</a></div>}
    </div></section>
    <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8"><div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-6"><h2 className="text-xl font-semibold text-white">Before you register</h2><p className="mt-3 leading-7 text-slate-300"><strong className="text-white">Payment is not required.</strong> Registration tokens rotate, so a copied token may eventually expire. A token permits an attempt to register; it does not waive age or other eligibility requirements, the Terms, or the Server Rules.</p></div></section>
  </>;
}
