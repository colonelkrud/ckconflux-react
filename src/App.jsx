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

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return prefersReducedMotion;
}

function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return pathname;
}

const signUpFields = [
  { key: 'username', label: 'Choose a username', value: '@yourname:ckconflux.com', helper: 'Permanent Matrix ID (MXID).' },
  { key: 'password', label: 'Create a password', value: 'correct-horse-battery-lantern', helper: 'Use a long, memorable passphrase.' },
  { key: 'email', label: 'Add your email', value: '[email protected]', helper: 'For verification and recovery.' },
];

function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();
  const buttonId = useId();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <h3>
        <button
          id={buttonId}
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
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        aria-hidden={!isOpen}
        className={`px-4 pb-4 text-sm leading-6 text-slate-300 ${isOpen ? 'animate-[fadeIn_.2s_ease-out]' : ''}`}
      >
        {children}
      </div>
    </div>
  );
}

void AccordionItem;

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

const faqItems = [
  ['What should I use first?', 'Start with Element Web at element.ckconflux.com. It is the default choice for chat, DMs, communities, voice, and video.'],
  ['What is MatrixRTC / Element Call?', 'MatrixRTC is real-time calling for Matrix. In Element, this appears as Element Call for room-based voice/video.'],
  ['Does Element support screen sharing?', 'Yes, on supported platforms and browsers.'],
  ['Can I use different display names in different rooms?', 'Your MXID stays the same, and room/profile display behavior can vary by client/settings.'],
  ['How do direct messages work in Element?', 'Use Start Chat / New Message, pick a user, and Element creates a DM room.'],
  ['How do I invite friends with registration codes?', 'Share a registration code, then they use it during account creation on element.ckconflux.com.'],
  ['Can registration codes be revoked?', 'Yes. Codes are access controls and can be revoked for abuse or spam.'],
  ['How do I get a registration token?', 'Ask an existing member or use a supported tier at buymeacoffee.com/conflux.'],
  ['Can I discover communities outside this server?', 'Yes. Your account can join public rooms/spaces hosted on other Matrix servers.'],
  ['Can I use another Matrix client besides Element?', 'Yes. Matrix is an open standard, so you are not locked to one app/client.'],
  ['What mobile apps can I use?', 'Element and many Matrix clients support iOS/Android, plus desktop and web.'],
  ['What mobile apps can I use for Mastodon?', 'Use the official Mastodon mobile app or compatible alternatives.'],
  ['Is there a mobile app for TeamSpeak?', 'Yes. TeamSpeak offers mobile clients plus desktop clients.'],
  ['TeamSpeak 6 vs TeamSpeak 3?', 'Use whichever client is most stable and preferred for your setup.'],
  ['How do I report content in Mastodon?', 'Use Report from a post/profile menu and include context.'],
  ['How do I report content in Element?', 'Use message/user actions to report and optionally notify moderators with room/time context.'],
  ['How do I report content in TeamSpeak?', 'Report to admins/moderators with usernames, channel details, and timestamp.'],
  ['How do I ignore users in Element?', 'Open profile and add user to your ignore list.'],
  ['How do I ignore users in Mastodon?', 'Use Mute (soft) or Block (strong) from profile menu.'],
  ['How do notifications work in Element?', 'Configure globally and per-room (mute, mentions-only, custom rules).'],
  ['Do files stay forever?', 'Frequently accessed files stay available; inactive files are pruned over long periods.'],
  ['How is moderation handled?', 'Best-effort moderation with Draupnir and community blocklist practices.'],
];

function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.2),transparent_38%),radial-gradient(circle_at_80%_15%,rgba(168,85,247,0.18),transparent_24%)]" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200 sm:text-sm">Discord-like, with more privacy and ownership</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">Private community chat and calls without platform lock-in.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">CK Conflux is a community-run home built around Element on Matrix. Start there first, then add Mastodon or TeamSpeak as optional companions.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="https://element.ckconflux.com" className="rounded-xl bg-cyan-400 px-5 py-3 text-center text-base font-semibold text-slate-950 shadow-xl shadow-cyan-500/25 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">Start with Element</a>
              <a href="#signin" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-center text-base font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">View sign-in steps</a>
            </div>
          </div>
        </div>
      </section>

      <section id="start-here" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 rounded-3xl border border-cyan-300/20 bg-cyan-400/[0.07] p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 sm:text-sm">Start here (recommended)</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Begin with Element on Matrix</h2>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300 sm:text-base">
              <li>• One identity: <span className="font-medium text-white">@you:ckconflux.com</span></li>
              <li>• Works across web, desktop, and mobile</li>
              <li>• Covers rooms, DMs, voice, and video</li>
            </ul>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a href="https://element.ckconflux.com" className="rounded-xl bg-cyan-400 px-5 py-3 text-center text-base font-semibold text-slate-950 transition hover:-translate-y-0.5">Open Element and create account</a>
              <a href="https://element.io/en/user-guide" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-center text-base font-semibold text-white transition hover:bg-white/10">Read Element guide</a>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-5">
            <h3 className="text-lg font-semibold text-white">First action</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">Go to element.ckconflux.com and choose Create account.</p>
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
              ].map((step, i) => (
                <li key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
                  <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-cyan-400/20 text-xs font-semibold text-cyan-200">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
              New Matrix accounts need a registration token. Get one from an existing member or through{' '}
              <a href="https://buymeacoffee.com/conflux" className="font-semibold underline decoration-amber-200/70 underline-offset-2">Buy Me a Coffee</a>.
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
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              ['MXID', '@alex:ckconflux.com', 'Your permanent Matrix account identity.'],
              ['Email', '[email protected]', 'Used for verification and account recovery.'],
              ['Display name', 'Alex', 'What others usually see in rooms. Can be changed later.'],
            ].map(([term, example, meaning]) => (
              <article key={term} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                <h3 className="text-base font-semibold text-white">{term}</h3>
                <p className="mt-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-cyan-100">{example}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{meaning}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="tools" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-sm">Other community tools (optional)</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Mastodon and TeamSpeak</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">Useful companions, but not required for onboarding. Start with Element first.</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Mastodon</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">Social posting and discovery companion.</p>
            <a href="https://masto.colonelkrud.com/auth/sign_up" className="mt-4 inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white">Open Mastodon</a>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">TeamSpeak</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">Voice-first low latency comms. Server: ts3.ckconflux.com.</p>
            <a href="https://www.teamspeak.com/en/downloads/" className="mt-4 inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white">Download TeamSpeak</a>
          </article>
        </div>
      </section>

      <section id="faq-preview" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 sm:text-sm">Need help?</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Read the full FAQ and beginner guide</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">Get onboarding help, client recommendations, room discovery guidance, and troubleshooting tips.</p>
          <a href="/help" className="mt-4 inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-base font-semibold text-slate-950">Open Help Center</a>
        </div>
      </section>
    </>
  );
}

function HelpPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 sm:text-sm">Help center</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Matrix onboarding, FAQ, and support resources</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">This page is for deeper help. Start with Element first, then use these guides to customize your setup.</p>
      </header>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-white">FAQ</h2>
        <div className="mt-4 space-y-3">
          {faqItems.map(([q, a], index) => (
            <AccordionItem key={q} title={q} defaultOpen={index === 0}>
              {a}
            </AccordionItem>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold text-white">Official Element documentation</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">For official Element support answers, use the Element FAQ/docs.</p>
          <a href="https://docs.element.io/latest/element-support/frequently-asked-questions/" className="mt-3 inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white">Open official Element FAQ</a>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold text-white">Matrix clients and flexibility</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Matrix is an open standard. Many clients work with your account, so you are not locked into one app.</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>• Recommended mobile: <span className="font-semibold text-white">Element X</span></li>
            <li>• Recommended web: <a className="font-semibold text-cyan-200 underline" href="https://element.ckconflux.com">element.ckconflux.com</a></li>
            <li>• Explore clients: <a className="font-semibold text-cyan-200 underline" href="https://matrix.org/ecosystem/clients/">matrix.org/ecosystem/clients</a></li>
          </ul>
        </article>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold text-white">Bridges and paid clients</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Some paid clients, like <a href="https://www.beeper.com/" className="font-semibold text-cyan-200 underline">Beeper</a>, include built-in bridges/integrations. Bridging is allowed on this server, and members can request additional bridges from admins.</p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold text-white">Room discovery</h2>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-300">
            <li>Open your local room directory in Element to find CK Conflux rooms first.</li>
            <li>For remote/public discovery, browse <a href="https://matrixrooms.info/" className="font-semibold text-cyan-200 underline">matrixrooms.info</a>.</li>
            <li>Join public rooms/spaces across the wider Matrix network from your same account.</li>
          </ol>
        </article>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-xl font-semibold text-white">Discord terms → Matrix terms</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            ['Server', 'Space'],
            ['Channel', 'Room'],
            ['Username#tag', 'MXID (@user:server)'],
            ['Voice channel', 'Call room / Element Call'],
          ].map(([discord, matrix]) => (
            <article key={discord} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Discord</p>
              <p className="mt-1 text-sm font-semibold text-white">{discord}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Matrix</p>
              <p className="mt-1 text-sm font-semibold text-cyan-100">{matrix}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5">
        <h2 className="text-xl font-semibold text-amber-100">Community effort and support</h2>
        <p className="mt-2 text-sm leading-6 text-amber-100/90">CK Conflux has been run by colonelkrud since 2014 as a community effort. If this space helps you, support ongoing operations via Buy Me a Coffee.</p>
        <a href="https://buymeacoffee.com/conflux" className="mt-4 inline-flex rounded-xl bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950">Support on Buy Me a Coffee</a>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-xl font-semibold text-white">Need more help?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">If you are stuck, start with the official docs, then ask in community help rooms or contact admins for onboarding support.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href="https://docs.element.io/latest/element-support/frequently-asked-questions/" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white">Element docs</a>
          <a href="https://matrix.org/ecosystem/clients/" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white">Client ecosystem</a>
          <a href="https://matrixrooms.info/" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white">Room discovery</a>
        </div>
      </section>
    </section>
  );
}

void SignUpFlowCard;
void HomePage;
void HelpPage;

export default function CkConfluxLandingPage() {
  const pathname = usePathname();
  const onHelpPage = pathname === '/help';

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <a href="/" className="text-base font-semibold tracking-tight text-white sm:text-lg">CK Conflux</a>
          <nav className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
            <a href="/#start-here" className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">Start here</a>
            <a href="/#signin" className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">Sign in</a>
            <a href="/#tools" className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">Other tools</a>
            <a href="/help" className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">Help</a>
          </nav>
          <a href={onHelpPage ? '/' : 'https://element.ckconflux.com'} className="rounded-xl bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:px-4">
            {onHelpPage ? 'Back to home' : 'Open Element'}
          </a>
        </div>
      </header>

      <main id="top">{onHelpPage ? <HelpPage /> : <HomePage />}</main>
    </div>
  );
}
