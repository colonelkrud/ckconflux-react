import { useEffect, useId, useRef, useState } from 'react';

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(Boolean(mediaQuery.matches));

    const handleChange = (event) => setPrefersReducedMotion(event.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }

    return undefined;
  }, []);

  return prefersReducedMotion;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);

  return isMobile;
}

const signUpFields = [
  {
    key: 'username',
    label: 'Choose a username',
    value: '@yourname:ckconflux.com',
    helper: 'This becomes your permanent MXID. Your display name can change later.',
  },
  {
    key: 'password',
    label: 'Create a password',
    value: 'correct-horse-battery-lantern',
    helper: 'Use a long passphrase that is strong and memorable.',
  },
  {
    key: 'email',
    label: 'Add your email',
    value: '[email protected]',
    helper: 'Used for verification and account recovery.',
  },
];

function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-4 text-left text-base font-semibold text-white transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <span>{title}</span>
          <span className="text-cyan-200">{isOpen ? '−' : '+'}</span>
        </button>
      </h3>
      <div id={contentId} className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="px-4 pb-4 text-sm leading-6 text-slate-300">{children}</div>
        </div>
      </div>
    </div>
  );
}

void AccordionItem;

export function SignUpFlowCard() {
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
      setTypedValues({
        username: signUpFields[0].value,
        password: signUpFields[1].value,
        email: signUpFields[2].value,
      });
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

    const runSequence = async () => {
      await wait(250);
      for (let i = 0; i < signUpFields.length; i += 1) {
        const field = signUpFields[i];
        setVisibleFields(i + 1);
        await wait(180);
        for (let charIndex = 1; charIndex <= field.value.length; charIndex += 1) {
          if (cancelled) {
            return;
          }
          setTypedValues((prev) => ({ ...prev, [field.key]: field.value.slice(0, charIndex) }));
          await wait(30);
        }
        await wait(420);
      }

      setVisibleFields(signUpFields.length + 1);
      await wait(600);
      setCaptchaChecked(true);
    };

    runSequence();

    return () => {
      cancelled = true;
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [hasEnteredView, prefersReducedMotion]);

  return (
    <div ref={cardRef} className="rounded-[1.6rem] border border-cyan-300/20 bg-slate-900/90 p-4 shadow-2xl shadow-cyan-950/30 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Preview: first-time sign up</p>
      <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">Create your Matrix account</h3>
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
              <p className="mt-2 text-xs leading-5 text-slate-400 sm:text-sm">{field.helper}</p>
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
            <div className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-400">CAPTCHA</div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-300">After verification, you continue directly into Element Web.</p>
    </div>
  );
}

export default function CkConfluxLandingPage() {
  const isMobile = useIsMobile();

  const mxidRows = [
    {
      term: 'MXID',
      example: '@alex:ckconflux.com',
      meaning: 'Your permanent account identity on Matrix.',
    },
    {
      term: 'Email',
      example: '[email protected]',
      meaning: 'For account verification and recovery.',
    },
    {
      term: 'Display name',
      example: 'Alex',
      meaning: 'What people usually see in rooms. You can change it later.',
    },
  ];

  const faqItems = [
    {
      q: 'Do I need to use Mastodon or TeamSpeak first?',
      a: 'No. Start with Element/Matrix first. Most users can do everything they need there and then add other tools later.',
    },
    {
      q: 'How do I get a registration token?',
      a: 'Ask an existing member or use a supported tier at buymeacoffee.com/conflux to get token access.',
    },
    {
      q: 'Can I use mobile apps?',
      a: 'Yes. Element has iOS and Android apps, and your same account works across desktop and web clients too.',
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" className="text-base font-semibold tracking-tight text-white sm:text-lg">
            CK Conflux
          </a>
          <nav className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
            <a href="#start-here" className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">Start here</a>
            <a href="#signin" className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">Sign in</a>
            <a href="#mxid" className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">MXID help</a>
            <a href="#tools" className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">Other tools</a>
          </nav>
          <a href="https://element.ckconflux.com" className="rounded-xl bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:px-4">
            Open Element
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.2),transparent_38%),radial-gradient(circle_at_80%_15%,rgba(168,85,247,0.18),transparent_24%)]" />
          <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200 sm:text-sm">
                Discord-like, with more privacy and ownership
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Private community chat and calls without platform lock-in.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                CK Conflux is a community-run home built around Element on Matrix. You get familiar rooms, DMs, voice, and video while keeping control of your identity.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="https://element.ckconflux.com" className="rounded-xl bg-cyan-400 px-5 py-3 text-center text-base font-semibold text-slate-950 shadow-xl shadow-cyan-500/25 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
                  Start with Element
                </a>
                <a href="#signin" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-center text-base font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
                  View sign-in steps
                </a>
              </div>
            </div>
            <div className="grid gap-3 self-end sm:grid-cols-3 lg:grid-cols-1">
              {[
                ['What this is', 'Community-run Matrix server + onboarding hub'],
                ['Why it matters', 'Privacy-first identity and long-term community ownership'],
                ['How to begin', 'Use Element first, then add optional tools if needed'],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="start-here" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 rounded-3xl border border-cyan-300/20 bg-cyan-400/[0.07] p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 sm:text-sm">Start here (recommended)</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Begin with Element on Matrix</h2>
              <p className="mt-3 text-sm leading-7 text-slate-200 sm:text-base">
                For almost everyone, Element is the right first step. It covers day-to-day chat, DMs, communities, voice, and video in one place.
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300 sm:text-base">
                <li>• One account: <span className="font-medium text-white">@you:ckconflux.com</span></li>
                <li>• Works across web, desktop, and mobile</li>
                <li>• Familiar community structure: spaces and rooms</li>
              </ul>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a href="https://element.ckconflux.com" className="rounded-xl bg-cyan-400 px-5 py-3 text-center text-base font-semibold text-slate-950 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">Open Element and create account</a>
                <a href="https://element.io/en/user-guide" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-center text-base font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">Read Element guide</a>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-5">
              <h3 className="text-lg font-semibold text-white">First action</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">Go to element.ckconflux.com and choose “Create account.” Keep this page open to follow the quick steps below.</p>
            </div>
          </div>
        </section>

        <section id="signin" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 sm:text-sm">Sign in / account creation</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Simple step-by-step onboarding</h2>
              <ol className="mt-4 space-y-3">
                {[
                  'Open Element Web and choose Create account.',
                  'Pick your username. This becomes your permanent MXID.',
                  'Set a strong passphrase and add your recovery email.',
                  'Complete CAPTCHA, verify email, and enter Element.',
                ].map((step, index) => (
                  <li key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
                    <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-cyan-400/20 text-xs font-semibold text-cyan-200">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
                New Matrix accounts need a registration token. Get one from an existing member or via a supported tier at{' '}
                <a href="https://buymeacoffee.com/conflux" className="font-semibold underline decoration-amber-200/70 underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200">buymeacoffee.com/conflux</a>.
              </div>
            </div>
            <SignUpFlowCard />
          </div>
        </section>

        <section id="mxid" className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 sm:text-sm">MXID explained</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">MXID vs email vs display name</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">Quick mental model: your MXID is your fixed account identity, email helps recovery, and display name is your flexible nickname.</p>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {mxidRows.map((row) => (
                <article key={row.term} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <h3 className="text-base font-semibold text-white">{row.term}</h3>
                  <p className="mt-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-cyan-100">{row.example}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{row.meaning}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="tools" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-sm">Other community tools (optional)</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Add social posting or voice-first tools when needed</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">These are useful companions, but they are not required for onboarding. Start with Element first.</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Mastodon</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Use for public social posts and discovery. Best as a companion to Matrix chat.</p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a href="https://masto.colonelkrud.com/auth/sign_up" className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200">Open Mastodon</a>
                <a href="https://docs.joinmastodon.org/user/" className="rounded-xl border border-white/15 bg-transparent px-4 py-2 text-center text-sm font-semibold text-slate-300 transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200">Mastodon guide</a>
              </div>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">TeamSpeak</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Use for voice-first coordination and low-latency group comms. Server: ts3.ckconflux.com.</p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a href="https://www.teamspeak.com/en/downloads/" className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200">Download TeamSpeak</a>
                <a href="https://www.teamspeak.com/en/support/get-started/" className="rounded-xl border border-white/15 bg-transparent px-4 py-2 text-center text-sm font-semibold text-slate-300 transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200">TeamSpeak guide</a>
              </div>
            </article>
          </div>
        </section>

        <section id="faq" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 sm:text-sm">Quick FAQ</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Common onboarding questions</h2>
          </div>
          <div className="mt-6 space-y-3">
            {isMobile
              ? faqItems.map((faq, index) => (
                  <AccordionItem key={faq.q} title={faq.q} defaultOpen={index === 0}>
                    {faq.a}
                  </AccordionItem>
                ))
              : faqItems.map((faq) => (
                  <article key={faq.q} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <h3 className="text-lg font-semibold text-white">{faq.q}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{faq.a}</p>
                  </article>
                ))}
          </div>
        </section>
      </main>
    </div>
  );
}
