import { useEffect, useRef, useState } from 'react';
import { Check, CheckCircle2, Copy, ExternalLink, LoaderCircle, ShieldCheck, TriangleAlert } from 'lucide-react';
import { ELEMENT_REGISTRATION_URL, REGISTRATION_EVENT } from '../config/registrationEvent';
import { Link } from '../router/Router';

const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const SCRIPT_TIMEOUT_MS = 10000;
const REQUEST_TIMEOUT_MS = 10000;
const ERROR_STATES = ['expired', 'rejected', 'unavailable', 'limited'];
const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200';

function formatExpiration(value) {
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
    }).format(date);
  } catch {
    return value;
  }
}

function LoadingState() {
  return <div className="flex flex-col items-center py-3 text-center" role="status" aria-live="polite">
    <LoaderCircle className="h-7 w-7 animate-spin text-cyan-200 motion-reduce:animate-none" aria-hidden="true" />
    <h2 className="mt-4 text-xl font-semibold text-white">Preparing secure registration…</h2>
    <p className="mt-2 text-sm leading-6 text-slate-300">The security check will be ready shortly.</p>
  </div>;
}

function ChallengeState() {
  return <div className="text-center">
    <ShieldCheck className="mx-auto h-7 w-7 text-cyan-200" aria-hidden="true" />
    <h2 className="mt-4 text-xl font-semibold text-white">Request a free registration token</h2>
    <p className="mt-2 text-sm leading-6 text-slate-300">Complete this quick security check to continue.</p>
  </div>;
}

function RequestingState() {
  return <div className="flex flex-col items-center py-3 text-center" role="status" aria-live="polite">
    <LoaderCircle className="h-7 w-7 animate-spin text-cyan-200 motion-reduce:animate-none" aria-hidden="true" />
    <h2 className="mt-4 text-xl font-semibold text-white">Verification complete</h2>
    <p className="mt-2 text-sm leading-6 text-slate-300">Preparing your registration token…</p>
  </div>;
}

function ErrorState({ state, onRetry, headingRef }) {
  const content = {
    expired: ["Let's try that again", 'The security check expired before the request completed.'],
    rejected: ["Let's try that again", 'The security check could not be accepted. Complete a new check to retry.'],
    unavailable: ['Registration is temporarily unavailable', "We couldn't prepare a registration token right now."],
    limited: ['Please wait before trying again', 'Too many registration requests were received. Please wait a little while, then try again.'],
  }[state];

  return <div className="text-center" role="alert">
    <TriangleAlert className="mx-auto h-7 w-7 text-amber-200" aria-hidden="true" />
    <h2 ref={headingRef} tabIndex="-1" className={`mt-4 text-xl font-semibold text-white ${focusRing}`}>{content[0]}</h2>
    <p className="mt-2 text-sm leading-6 text-slate-300">{content[1]}</p>
    <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
      <button type="button" onClick={onRetry} className={`rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300 ${focusRing}`}>Try again</button>
      {state === 'unavailable' && <Link to="/support" className={`rounded-xl px-4 py-3 text-sm font-semibold text-cyan-200 underline decoration-cyan-300/50 underline-offset-4 hover:text-cyan-100 ${focusRing}`}>View support options</Link>}
    </div>
  </div>;
}

function SuccessState({ result, copyState, onCopy, headingRef }) {
  return <div className="text-center" aria-labelledby="registration-token-heading">
    <CheckCircle2 className="mx-auto h-8 w-8 text-cyan-200" aria-hidden="true" />
    <h2 ref={headingRef} tabIndex="-1" id="registration-token-heading" className={`mt-4 text-2xl font-semibold text-white ${focusRing}`}>Registration token ready</h2>
    <p className="mt-2 text-sm leading-6 text-slate-300">Campaign: {result.campaign}</p>
    <div className="mt-6 flex min-w-0 flex-col gap-3 rounded-xl border border-cyan-300/20 bg-slate-950/80 p-3 text-left sm:flex-row sm:items-center">
      <code aria-label="Registration token" className="min-w-0 flex-1 select-all overflow-x-auto whitespace-nowrap rounded-lg px-2 py-2 font-mono text-sm font-semibold text-cyan-100 sm:text-base">{result.token}</code>
      <button type="button" onClick={onCopy} aria-label="Copy registration token" className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 font-semibold text-white hover:bg-white/15 ${focusRing}`}>
        {copyState === 'copied' ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        {copyState === 'copied' ? 'Copied' : 'Copy token'}
      </button>
    </div>
    <p className="mt-3 text-left text-sm text-slate-300 sm:text-center">
      {result.expiresAt && <>Expires <time dateTime={result.expiresAt}>{formatExpiration(result.expiresAt)}</time>.</>}
    </p>
    <p className="mt-2 min-h-6 text-sm text-slate-300" role="status" aria-live="polite">{copyState === 'copied' ? 'Registration token copied.' : copyState === 'unavailable' ? 'Copy unavailable. Select and copy the token manually.' : ''}</p>
    <div className="mt-5 border-t border-white/10 pt-5">
      <p className="text-sm leading-6 text-slate-300">Keep this token available—you’ll enter it during Element registration.</p>
      <a href={ELEMENT_REGISTRATION_URL} className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300 sm:w-auto ${focusRing}`}>
        Continue to Element registration <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  </div>;
}

export default function RegisterEvent() {
  const widgetHost = useRef(null);
  const successHeading = useRef(null);
  const errorHeading = useRef(null);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState('loading');
  const [result, setResult] = useState(null);
  const [copyState, setCopyState] = useState('idle');

  useEffect(() => {
    if (state === 'success') successHeading.current?.focus();
    else if (ERROR_STATES.includes(state)) errorHeading.current?.focus();
  }, [state]);

  useEffect(() => {
    // Each attempt owns its callbacks, widget and request. Cleanup invalidates all
    // of them before a manual retry, route change or Strict Mode remount.
    let active = true;
    let consumedResponse = false;
    let widgetId = null;
    let widgetApi = null;
    let script = null;
    let loadHandler;
    let loadTimeout;
    let configTimeout;
    let requestTimeout;
    let configController;
    let requestController;

    const requestToken = async (turnstileResponse) => {
      if (!active || !turnstileResponse || consumedResponse) return;
      consumedResponse = true;
      setState('verified');
      requestController = new AbortController();
      requestTimeout = setTimeout(() => {
        requestController.abort();
        if (active) setState('unavailable');
      }, REQUEST_TIMEOUT_MS);
      try {
        setState('requesting');
        const response = await fetch(REGISTRATION_EVENT.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ turnstile_token: turnstileResponse }),
          signal: requestController.signal,
        });
        if (!active || requestController.signal.aborted) return;
        if (response.status === 429) { setState('limited'); return; }
        if (!response.ok) { setState(response.status >= 500 ? 'unavailable' : 'rejected'); return; }
        const body = await response.json();
        if (!active || requestController.signal.aborted) return;
        if (typeof body?.registration_token !== 'string' || !body.registration_token) { setState('unavailable'); return; }
        setResult({
          campaign: typeof body.campaign === 'string' && body.campaign.trim() ? body.campaign : REGISTRATION_EVENT.campaign,
          token: body.registration_token,
          expiresAt: typeof body.expires_at === 'string' && body.expires_at.trim() ? body.expires_at : null,
        });
        setState('success');
      } catch {
        if (active) setState('unavailable');
      } finally {
        clearTimeout(requestTimeout);
      }
    };

    const invalidateChallenge = (nextState) => {
      // Once submitted, challenge callbacks must not overwrite the backend
      // outcome or remove a separately issued registration token.
      if (!active || consumedResponse) return;
      consumedResponse = true;
      setState(nextState);
    };

    function stopLoading() {
      clearTimeout(loadTimeout);
      if (loadHandler) script?.removeEventListener('load', loadHandler);
      script?.removeEventListener('error', failLoading);
    }

    function failLoading() {
      if (!active) return;
      stopLoading();
      // A failed script cannot be reused: the next attempt must make a new load.
      script?.remove();
      setState('unavailable');
    }

    function renderWidget(sitekey) {
      if (!active || widgetId !== null) return;
      stopLoading();
      widgetApi = window.turnstile;
      if (!widgetApi?.render || !widgetHost.current) { failLoading(); return; }
      try {
        setState('ready');
        widgetId = widgetApi.render(widgetHost.current, {
          sitekey,
          action: REGISTRATION_EVENT.action,
          // Compact is the only widget size that safely fits the 320px layout.
          size: 'compact',
          retry: 'never',
          'refresh-expired': 'never',
          'refresh-timeout': 'never',
          callback: requestToken,
          'expired-callback': () => invalidateChallenge('expired'),
          'timeout-callback': () => invalidateChallenge('expired'),
          'error-callback': () => invalidateChallenge('rejected'),
        });
      } catch {
        setState('unavailable');
      }
    }

    const initialize = async () => {
      configController = new AbortController();
      configTimeout = setTimeout(() => {
        configController.abort();
        if (active) setState('unavailable');
      }, REQUEST_TIMEOUT_MS);
      try {
        const response = await fetch(REGISTRATION_EVENT.configEndpoint, { signal: configController.signal });
        if (!active || configController.signal.aborted) return;
        if (response.status !== 200) throw new Error('invalid configuration response');
        const config = await response.json();
        if (!active || configController.signal.aborted) return;
        if (typeof config?.sitekey !== 'string' || !config.sitekey.trim() || config.action !== REGISTRATION_EVENT.action) throw new Error('invalid configuration');

        const renderConfiguredWidget = () => renderWidget(config.sitekey);
        loadHandler = renderConfiguredWidget;
        if (window.turnstile?.render) {
          renderConfiguredWidget();
        } else {
          const existing = document.querySelector(`script[src="${TURNSTILE_SCRIPT}"]`);
          script = existing || document.createElement('script');
          script.addEventListener('load', renderConfiguredWidget);
          script.addEventListener('error', failLoading);
          loadTimeout = setTimeout(failLoading, SCRIPT_TIMEOUT_MS);
          if (!existing) {
            script.src = TURNSTILE_SCRIPT;
            script.async = true;
            script.defer = true;
            document.head.append(script);
          }
        }
      } catch {
        if (active) setState('unavailable');
      } finally {
        clearTimeout(configTimeout);
      }
    };

    initialize();

    return () => {
      active = false;
      stopLoading();
      clearTimeout(configTimeout);
      clearTimeout(requestTimeout);
      configController?.abort();
      requestController?.abort();
      if (widgetId !== null) widgetApi?.remove(widgetId);
      if (!window.turnstile?.render) script?.remove();
    };
  }, [attempt]);

  const retry = () => {
    setResult(null);
    setCopyState('idle');
    setState('loading');
    setAttempt((previous) => previous + 1);
  };

  const copyToken = async () => {
    if (!navigator.clipboard?.writeText) { setCopyState('unavailable'); return; }
    try { await navigator.clipboard.writeText(result.token); setCopyState('copied'); }
    catch { setCopyState('unavailable'); }
  };

  const challengeVisible = state === 'ready';

  return <>
    <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_55%)]"><div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Free registration event</p>
      <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">{REGISTRATION_EVENT.campaign}</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">Get a free CK Conflux registration token after a quick security check. No payment is required. A token lets you begin registration but does not bypass eligibility requirements or community rules.</p>
    </div></section>
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-xl rounded-2xl border border-cyan-300/25 bg-cyan-400/[0.07] p-5 shadow-lg shadow-slate-950/20 sm:p-8" aria-label="Registration token request">
        {state === 'loading' && <LoadingState />}
        {state === 'ready' && <ChallengeState />}
        {(state === 'verified' || state === 'requesting') && <RequestingState />}
        {ERROR_STATES.includes(state) && <ErrorState state={state} onRetry={retry} headingRef={errorHeading} />}
        {state === 'success' && result && <SuccessState result={result} copyState={copyState} onCopy={copyToken} headingRef={successHeading} />}
        <div className={challengeVisible ? 'mt-5 flex min-w-0 justify-center overflow-hidden' : state === 'loading' ? 'h-0 overflow-hidden' : 'hidden'} aria-hidden={!challengeVisible}>
          <div ref={widgetHost} aria-label="Security check" />
        </div>
        {challengeVisible && <p className="mt-4 text-center text-xs leading-5 text-slate-400">The check helps limit automated registrations and abuse.</p>}
      </section>

      <aside className="mx-auto mt-8 max-w-xl border-t border-white/10 px-1 pt-6" aria-labelledby="before-register-heading">
        <h2 id="before-register-heading" className="text-base font-semibold text-white">Before you register</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400"><strong className="font-semibold text-slate-200">Payment is not required.</strong> A token permits a registration attempt; the Terms, Server Rules, age, and other eligibility requirements still apply. Registration tokens rotate and eventually expire.</p>
      </aside>
    </div>
  </>;
}
