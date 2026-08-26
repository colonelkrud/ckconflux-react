import { useEffect, useRef, useState } from 'react';
import { Link } from '../router/Router';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const signUpFields = [
  { key: 'username', label: 'Choose a username', value: '@yourname:ckconflux.com', helper: 'Permanent Matrix user ID (MXID).' },
  { key: 'password', label: 'Create a password', value: 'correct-horse-battery-lantern', helper: 'Use a long, memorable passphrase.' },
  { key: 'email', label: 'Add your email', value: '[email protected]', helper: 'For verification and recovery.' },
];

function SignUpFlowCard() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const cardRef = useRef(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [visibleFields, setVisibleFields] = useState(0);
  const [typedValues, setTypedValues] = useState({ username: '', password: '', email: '' });
  const [captchaChecked, setCaptchaChecked] = useState(false);

  useEffect(() => {
    if (!cardRef.current || hasEnteredView) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [hasEnteredView]);

  useEffect(() => {
    if (!hasEnteredView) {
      return undefined;
    }

    if (prefersReducedMotion) {
      setVisibleFields(signUpFields.length + 1);
      setTypedValues({ username: signUpFields[0].value, password: signUpFields[1].value, email: signUpFields[2].value });
      setCaptchaChecked(true);
      return undefined;
    }

    let cancelled = false;
    const timers = [];

    const wait = (ms) =>
      new Promise((resolve) => {
        const id = setTimeout(resolve, ms);
        timers.push(id);
      });

    const run = async () => {
      await wait(240);
      for (let i = 0; i < signUpFields.length; i += 1) {
        const field = signUpFields[i];
        setVisibleFields(i + 1);
        await wait(180);
        for (let c = 1; c <= field.value.length; c += 1) {
          if (cancelled) return;
          setTypedValues((prev) => ({ ...prev, [field.key]: field.value.slice(0, c) }));
          await wait(28);
        }
        await wait(350);
      }
      setVisibleFields(signUpFields.length + 1);
      await wait(450);
      setCaptchaChecked(true);
    };

    run();

    return () => {
      cancelled = true;
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [hasEnteredView, prefersReducedMotion]);

  return (
    <div ref={cardRef} className="rounded-[1.6rem] border border-cyan-300/20 bg-slate-900/90 p-4 shadow-2xl shadow-cyan-950/30 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Preview: account setup</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Create your Matrix account</h3>
      <div className="mt-4 space-y-3">
        {signUpFields.map((field, index) => {
          const isVisible = visibleFields > index;
          const value = typedValues[field.key];
          return (
            <div key={field.key} className={`rounded-xl border border-white/10 bg-white/[0.04] p-3 transition duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-sm font-medium text-slate-200">{field.label}</div>
              <div className="mt-2 flex h-10 items-center rounded-lg border border-white/10 bg-slate-950 px-3 font-mono text-xs text-slate-100 sm:text-sm">
                <span className="truncate">{value}</span>
                {isVisible && value.length < field.value.length && <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-cyan-200" />}
              </div>
              <p className="mt-2 text-xs text-slate-400">{field.helper}</p>
            </div>
          );
        })}

        <div className={`rounded-xl border border-white/10 bg-white/[0.04] p-3 transition duration-500 ${visibleFields > signUpFields.length ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-sm font-medium text-slate-200">Complete CAPTCHA</div>
          <div className="mt-2 flex items-center justify-between rounded-lg border border-white/15 bg-slate-950/90 p-3">
            <div className="flex items-center gap-3 text-sm text-slate-100">
              <div className={`flex h-6 w-6 items-center justify-center rounded border text-sm ${captchaChecked ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' : 'border-slate-500 bg-slate-800 text-transparent'}`}>
                ✓
              </div>
              <span>I am human</span>
            </div>
            <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-400">CAPTCHA</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.2),transparent_38%),radial-gradient(circle_at_80%_15%,rgba(168,85,247,0.18),transparent_24%)]" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200 sm:text-sm">Discord-like, with more privacy and ownership</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">Private community chat and calls without platform lock-in.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">CK Conflux is built around Element on Matrix. Start there first, then add Mastodon or TeamSpeak if needed.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="https://element.ckconflux.com/#/register" className="rounded-xl bg-cyan-400 px-5 py-3 text-center text-base font-semibold text-slate-950 shadow-xl shadow-cyan-500/25 transition hover:-translate-y-0.5">Register with Element</a>
              <a href="#signin" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-center text-base font-semibold text-white transition hover:bg-white/10">View sign-in steps</a>
            </div>
          </div>
        </div>
      </section>

      <section id="signin" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 sm:text-sm">Start here</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Simple step-by-step onboarding</h2>
            <ol className="mt-4 space-y-3">
              {[
                'Open Element Web and choose "Create Account".',
                'Pick your username. This becomes your permanent Matrix user ID (MXID).',
                'Set a strong passphrase and add your recovery email.',
                'Complete the CAPTCHA, verify your email, and enter Element.',
              ].map((step, i) => (
                <li key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
                  <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-cyan-400/20 text-xs font-semibold text-cyan-200">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <SignUpFlowCard />
        </div>
      </section>

      <section id="tools" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-sm">Other community tools (optional)</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Mastodon and TeamSpeak</h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold text-white">Mastodon</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">Social posting companion to Matrix chats.</p>
            <a href="https://masto.colonelkrud.com/auth/sign_up" className="mt-4 inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white">Open Mastodon</a>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold text-white">TeamSpeak</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Voice-first low latency comms. Server:{' '}
              <a className="font-semibold text-cyan-200 underline" href="ts3server://ts6.ckconflux.com">ts6.ckconflux.com</a>.
            </p>
            <a href="https://www.teamspeak.com/en/downloads/" className="mt-4 inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white">Download TeamSpeak</a>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 sm:text-sm">Need help?</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Read the full Help & FAQ center</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">Includes onboarding guidance, policy links, and beginner-friendly troubleshooting.</p>
          <Link to="/help" className="mt-4 inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-base font-semibold text-slate-950">Open Help Center</Link>
        </div>
      </section>
    </>
  );
}

