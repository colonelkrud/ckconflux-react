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

function LegalLayout({ title, lastUpdated, children }) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-slate-300">Last updated {lastUpdated}</p>
      </header>
      <div className="mt-6 space-y-5 text-sm leading-7 text-slate-200 sm:text-base">{children}</div>
    </section>
  );
}

const signUpFields = [
  { key: 'username', label: 'Choose a username', value: '@yourname:ckconflux.com', helper: 'Permanent Matrix user ID (<abbr>MXID</abbr>).' },
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
  {
    q: 'What should I use first?',
    a: (
      <p>
        Start with <a className="font-semibold text-cyan-200 underline" href="https://element.ckconflux.com">element.ckconflux.com</a>. It is the default path for chat, DMs, spaces, voice, and video. Most users should complete onboarding there first, then optionally add Mastodon or TeamSpeak.
      </p>
    ),
  },
  {
    q: 'What is MatrixRTC / Element Call?',
    a: (
      <p>
        MatrixRTC is Matrix real-time calling technology. In Element this appears as Element Call for room-based voice/video. It keeps calls in your room workflow instead of forcing separate apps.
      </p>
    ),
  },
  { q: 'Does Element support screen sharing?', a: <p>Yes, on supported browsers/platforms. Start a call, choose share screen/window/tab, then confirm permission prompts.</p> },
  {
    q: 'Can I use different display names in different rooms?',
    a: <p>Your <abbr title="Matrix user ID">MXID</abbr> stays fixed (for example <code>@name:ckconflux.com</code>). Your display name is usually global, though some clients/room settings can present room-specific profile details.</p>,
  },
  {
    q: 'How do direct messages work in Element?',
    a: <p>Use Start Chat/New Message, select a user, and Element creates a DM room. DM rooms still follow Matrix safety/reporting tools and server rules.</p>,
  },
  {
    q: 'How do I invite friends with registration codes?',
    a: <p>Share a registration code from an approved source. Your friend opens element.ckconflux.com, chooses Create account, and enters the code during signup.</p>,
  },
  {
    q: 'Can registration codes be revoked?',
    a: <p>Yes. Codes are access controls and may be revoked for abuse, spam, or policy violations. See <a className="font-semibold text-cyan-200 underline" href="/terms">Terms of Use</a>.</p>,
  },
  {
    q: 'How do I get a registration token?',
    a: <p>Ask an existing member or use a supported tier at <a className="font-semibold text-cyan-200 underline" href="https://buymeacoffee.com/conflux">Buy Me a Coffee</a>.</p>,
  },
  {
    q: 'Can I discover communities outside this server?',
    a: <p>Yes. Matrix is federated. Start with your local room directory, then discover remote/public rooms via <a className="font-semibold text-cyan-200 underline" href="https://matrixrooms.info/">matrixrooms.info</a>.</p>,
  },
  {
    q: 'Can I use another Matrix client besides Element?',
    a: <p>Yes. You are not locked into one app. Matrix supports many clients; browse options at <a className="font-semibold text-cyan-200 underline" href="https://matrix.org/ecosystem/clients/">matrix.org/ecosystem/clients</a>.</p>,
  },
  {
    q: 'What mobile apps can I use?',
    a: <p>Recommended mobile start is Element X (iOS/Android). Your account can also work with other Matrix clients from the ecosystem list. For web, use element.ckconflux.com.</p>,
  },
  {
    q: 'What mobile apps can I use for Mastodon?',
    a: <p>Use the official Mastodon app or other compatible apps depending on iOS/Android preferences. App features vary, but account compatibility is broad.</p>,
  },
  {
    q: 'Is there a mobile app for TeamSpeak?',
    a: <p>Yes. TeamSpeak has mobile clients, and desktop clients remain best for longer sessions and advanced setups.</p>,
  },
  {
    q: 'TeamSpeak 6 vs TeamSpeak 3?',
    a: <p>Both are used. If you want modern UI, try TeamSpeak 6 first. If your workflow or plugin setup depends on TS3 stability, TS3 remains acceptable.</p>,
  },
  {
    q: 'How do I report content in Mastodon?',
    a: <p>Use Report from post/account menus, include context, and reference policy concerns when needed. Community conduct standards are in <a className="font-semibold text-cyan-200 underline" href="/rules">Server Rules</a>.</p>,
  },
  {
    q: 'How do I report content in Element?',
    a: <p>Use message/user actions to report, then provide room links/timestamps to moderators if needed. Enforcement references <a className="font-semibold text-cyan-200 underline" href="/rules">Server Rules</a> and <a className="font-semibold text-cyan-200 underline" href="/terms">Terms of Use</a>.</p>,
  },
  {
    q: 'How do I report content in TeamSpeak?',
    a: <p>Report to server admins/moderators with usernames, channel details, and time of incident. Behavioral expectations are described in the <a className="font-semibold text-cyan-200 underline" href="/rules">Server Rules</a>.</p>,
  },
  {
    q: 'How do I ignore users in Element?',
    a: <p>Open user profile → add to ignore list. This hides messages and reduces unwanted contact. For persistent harassment, report using moderation flows and the Rules/Terms pages.</p>,
  },
  {
    q: 'How do I ignore users in Mastodon?',
    a: <p>Use Mute for softer filtering or Block for stronger prevention. If behavior violates policy, submit a report and reference applicable <a className="font-semibold text-cyan-200 underline" href="/rules">Rules</a>.</p>,
  },
  {
    q: 'How do notifications work in Element?',
    a: <p>Configure both global and per-room settings (mute, mentions-only, custom rules). Tune noisy rooms first so onboarding rooms stay useful.</p>,
  },
  {
    q: 'Do files stay forever?',
    a: <p>Do not assume indefinite retention. Storage and retention are best-effort and may vary by policy, server operations, and federation behavior. See the <a className="font-semibold text-cyan-200 underline" href="/privacy">Privacy Policy</a> and <a className="font-semibold text-cyan-200 underline" href="/terms">Terms of Use</a>.</p>,
  },
  {
    q: 'How is moderation handled?',
    a: <p>Moderation is best-effort with tools like Draupnir plus admin review. Actions can include content removal or account restrictions. Community expectations live in <a className="font-semibold text-cyan-200 underline" href="/rules">Server Rules</a>; enforcement and account obligations are in <a className="font-semibold text-cyan-200 underline" href="/terms">Terms</a>.</p>,
  },
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
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">CK Conflux is built around Element on Matrix. Start there first, then add Mastodon or TeamSpeak if needed.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="https://element.ckconflux.com" className="rounded-xl bg-cyan-400 px-5 py-3 text-center text-base font-semibold text-slate-950 shadow-xl shadow-cyan-500/25 transition hover:-translate-y-0.5">Start with Element</a>
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
                'Pick your username. This becomes your permanent Matrix user ID (<abbr>MXID</abbr>).',
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
            <p className="mt-2 text-sm leading-6 text-slate-300">Voice-first low latency comms. Server: ts3.ckconflux.com.</p>
            <a href="https://www.teamspeak.com/en/downloads/" className="mt-4 inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white">Download TeamSpeak</a>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 sm:text-sm">Need help?</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Read the full Help & FAQ center</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">Includes onboarding guidance, policy links, and beginner-friendly troubleshooting.</p>
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
      </header>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-xl font-semibold text-white">Policies & Rules</h2>
        <p className="mt-2 text-sm text-slate-300">For account obligations, moderation expectations, and data handling:</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href="/terms" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white">Terms of Use</a>
          <a href="/rules" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white">Server Rules</a>
          <a href="/privacy" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white">Privacy Policy</a>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-xl font-semibold text-white">Official docs and ecosystem links</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>Official Element FAQ: <a className="font-semibold text-cyan-200 underline" href="https://docs.element.io/latest/element-support/frequently-asked-questions/">docs.element.io</a></li>
          <li>Matrix clients directory: <a className="font-semibold text-cyan-200 underline" href="https://matrix.org/ecosystem/clients/">matrix.org/ecosystem/clients</a></li>
          <li>Room discovery: <a className="font-semibold text-cyan-200 underline" href="https://matrixrooms.info/">matrixrooms.info</a></li>
          <li>Optional paid client with built-in bridges/integrations: <a className="font-semibold text-cyan-200 underline" href="https://www.beeper.com/">Beeper</a></li>
        </ul>
        <p className="mt-3 text-sm text-slate-300">Matrix is open-standard: you are not locked to one app. Recommended: Element X on mobile and element.ckconflux.com on web. Bridging is allowed on this server, and you can request additional bridges from admins.</p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-white">FAQ</h2>
        <div className="mt-4 space-y-3">
          {faqItems.map((item, index) => (
            <AccordionItem key={item.q} title={item.q} defaultOpen={index === 0}>
              {item.a}
            </AccordionItem>
          ))}
        </div>
      </section>
    </section>
  );
}

function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="Mar 16, 2025">
      <p>
        This Privacy Policy describes how masto.colonelkrud.com (&quot;masto.colonelkrud.com&quot;, &quot;we&quot;, &quot;us&quot;) collects, protects, and uses the personally identifiable information you may provide through the masto.colonelkrud.com website or its API. This policy also outlines your rights and choices regarding your personal data.
      </p>
      <p>This policy applies to all users accessing the service from the United States. It does not apply to third-party services we do not control.</p>

      <section>
        <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
        <h3 className="mt-3 text-lg font-semibold text-white">Basic Account Information</h3>
        <ul className="mt-2 list-disc pl-5">
          <li>Username</li>
          <li>Email address</li>
          <li>Password (hashed and not stored in plain text)</li>
          <li>Additional optional profile information (display name, biography, profile picture, header image)</li>
        </ul>
        <p className="mt-2">Your username, display name, biography, and profile picture are always public.</p>

        <h3 className="mt-3 text-lg font-semibold text-white">Public Content</h3>
        <ul className="mt-2 list-disc pl-5">
          <li>Your posts (text, media attachments)</li>
          <li>Lists of followers and people you follow</li>
          <li>The date, time, and client application used to submit messages</li>
        </ul>
        <p className="mt-2">Public and unlisted posts are publicly accessible. Featured posts are also visible to the public.</p>

        <h3 className="mt-3 text-lg font-semibold text-white">Private &amp; Restricted Content</h3>
        <p className="mt-2">Followers-only posts are shared with your followers and mentioned users. Direct messages are sent only to mentioned users.</p>
        <p className="mt-2">Important: Due to the decentralized nature of the platform, some posts may be stored on other servers. Other server operators and users may have access to your posts, screenshots, or logs.</p>

        <h3 className="mt-3 text-lg font-semibold text-white">Metadata &amp; Logging</h3>
        <ul className="mt-2 list-disc pl-5">
          <li>Your IP address upon login (stored for up to 12 months)</li>
          <li>User-agent (browser application details)</li>
          <li>Server logs (IP addresses of requests retained for up to 90 days)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Provide core functionality, such as message delivery and user interactions</li>
          <li>Maintain security and prevent abuse (e.g., ban evasion detection)</li>
          <li>Send account-related notifications and respond to inquiries</li>
        </ul>
        <p className="mt-2">We never sell or trade your personal data.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">3. How We Protect Your Data</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Encryption: All traffic is secured with SSL/TLS.</li>
          <li>Password Protection: Passwords are hashed using a secure one-way algorithm.</li>
          <li>Two-Factor Authentication: Available for additional account security.</li>
        </ul>
        <p className="mt-2">In case of a data breach, we will notify affected users as required by law.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">4. Data Retention Policy</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Server logs containing IP addresses are retained for up to 90 days.</li>
          <li>Registered users&apos; latest IP addresses are stored for up to 12 months.</li>
          <li>You can request an archive of your data, including posts and media.</li>
          <li>You may permanently delete your account at any time.</li>
        </ul>
        <p className="mt-2">Once deleted, your account cannot be restored. Some content shared with other servers may persist.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">5. Use of Cookies</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Recognize logged-in sessions</li>
          <li>Save user preferences for future visits</li>
        </ul>
        <p className="mt-2">You can disable cookies in your browser settings, but some features may not function properly.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">6. Sharing of Data</h2>
        <p>We do not sell or share personally identifiable information except in the following cases:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>With trusted third-party service providers who assist in maintaining and securing the platform (under strict confidentiality agreements)</li>
          <li>When required to comply with legal obligations (court orders, law enforcement requests)</li>
          <li>To protect the rights, property, or safety of masto.colonelkrud.com, its users, or the public</li>
        </ul>
        <p className="mt-2">Public posts and some user interactions (such as follows and favorites) may be shared with other servers as part of the decentralized network.</p>
        <h3 className="mt-3 text-lg font-semibold text-white">Third-Party Applications</h3>
        <p className="mt-2">When you authorize an application to use your account, it may access your public profile information, follower/following lists, posts, and favorites. Applications cannot access your email address or password.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">7. Children&apos;s Privacy</h2>
        <p>Per COPPA (Children&apos;s Online Privacy Protection Act), this service is not intended for users under 18 years old. If you are under 18, do not use this service.</p>
        <p className="mt-2">If we learn that a user under 18 has provided personal information, we will take immediate steps to delete their account and data.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">8. Your Rights &amp; Choices</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Access &amp; Download Your Data: Request a copy of your stored information.</li>
          <li>Correct Your Information: Edit your profile at any time.</li>
          <li>Delete Your Account: Remove all associated data permanently.</li>
        </ul>
        <p className="mt-2">For inquiries regarding data access or deletion, contact admin@colonelkrud.com.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">9. Changes to This Policy</h2>
        <p>We may update this Privacy Policy periodically. Any significant changes will be communicated via email or platform announcements.</p>
        <p className="mt-2">Your continued use of masto.colonelkrud.com constitutes acceptance of the revised policy.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">10. Contact Information</h2>
        <p>Email: admin@colonelkrud.com</p>
        <p>Website: masto.colonelkrud.com</p>
      </section>
    </LegalLayout>
  );
}

function TermsPage() {
  return (
    <LegalLayout title="CK Conflux Terms of Use" lastUpdated="April 16, 2026">
      <p>By accessing CK Conflux services—including Element at element.ckconflux.com, Matrix homeserver services at ckconflux.com (Synapse), Mastodon at masto.colonelkrud.com, and related community services—you explicitly agree to these Terms and our legal policies. We may modify these terms at any time and may suspend or discontinue services at our discretion without prior notice.</p>

      <section>
        <h2 className="text-xl font-semibold text-white">User Eligibility &amp; Responsibilities</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Users must be at least 18 years old. Accounts violating this requirement will be terminated immediately.</li>
          <li>You must maintain confidentiality and security of login credentials and notify us immediately of unauthorized access.</li>
          <li>Content provided is informational only; seek professional advice for important decisions.</li>
          <li>You are responsible for your actions and contributions on CK Conflux.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Prohibited Uses</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Illegal, fraudulent, or deceptive practices.</li>
          <li>Child exploitation or harming minors in any way.</li>
          <li>Bullying, harassment, hate speech, discrimination, or intimidation.</li>
          <li>Distributing spam, unsolicited promotions, or advertisements.</li>
          <li>Uploading malware, viruses, or harmful software.</li>
          <li>Unauthorized system or network access, disruption, or attacks.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Interactive Services Disclaimer</h2>
        <p>CK Conflux provides interactive features like chats and forums. We do not actively moderate all user content and expressly disclaim responsibility for user-generated content. Moderation efforts in public or federated rooms are best-effort and not guaranteed.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Content Standards for User Contributions (Acceptable Use Policy)</h2>
        <p>You may not contribute content that includes:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Illegal activities or promotion of harmful actions toward others.</li>
          <li>Intellectual property infringement or unauthorized proprietary content.</li>
          <li>Defamatory, abusive, hateful, violent, obscene, or invasive of privacy.</li>
          <li>Malicious content intended to damage systems, software, or networks.</li>
          <li>Unauthorized attempts to probe, scan, or breach security measures of our platform or cloud infrastructure.</li>
          <li>Forging headers, identities, or misleading metadata.</li>
          <li>Actions designed to overload or disrupt our services or provider infrastructure.</li>
          <li>Circumvention of storage or usage restrictions.</li>
          <li>Spam or unsolicited promotional content.</li>
        </ul>
        <p className="mt-2">CK Conflux enforces a zero-tolerance policy toward violations of these content standards.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Reporting Abuse and GDPR Requests</h2>
        <p>Report inappropriate content or GDPR requests via built-in reporting methods, by mentioning moderation bot @draupnir:ckconflux.com, or by emailing abuse@mg.colonelkrud.com.</p>
        <p className="mt-2">Content is typically reviewed and purged within 24 hours of reporting. GDPR data requests are delivered via your registered email. If your account is deleted before a GDPR request is fulfilled, your content may already have been permanently removed.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">User Privacy and Data Handling Practices</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Expect no privacy in public rooms; communications there are publicly accessible.</li>
          <li>Logs including IP addresses are retained for 30 days for performance, troubleshooting, and security.</li>
          <li>Private messages and calls use end-to-end encryption (e2ee) by default where supported.</li>
          <li>We use industry-standard encryption and security practices to protect user data.</li>
          <li>We comply with GDPR data removal requests upon written request.</li>
          <li>We comply fully with lawful law enforcement requests.</li>
          <li>Data retention is best-effort; no explicit guarantees are provided.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Third-Party and Federated Content</h2>
        <p>CK Conflux participates in Matrix federation, enabling interaction with third-party servers beyond our direct control. Federated content is the responsibility of originating servers, and CK Conflux disclaims liability for those interactions.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Suspension and Termination</h2>
        <p>CK Conflux may suspend or terminate accounts at its sole discretion without notice for violations of these Terms, abuse, legal noncompliance, or lawful requests. We enforce zero tolerance for severe or repeated content-standard violations.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Indemnification</h2>
        <p>You agree to indemnify and hold harmless CK Conflux and its operators from claims arising from:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Your violation of these Terms or applicable laws.</li>
          <li>Your misuse of CK Conflux services or related infrastructure.</li>
          <li>Unauthorized access or security breaches.</li>
          <li>Defamatory, illegal, or harmful content posted by you.</li>
          <li>Violations of provider acceptable use and security requirements.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">User Privacy and Expectations in Public Rooms</h2>
        <p>Public rooms are publicly visible and messages should not be considered private. Exercise caution when sharing personal information.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">No Guarantee of Uptime or Service Levels</h2>
        <p>CK Conflux services are provided without explicit or implicit uptime or performance guarantees. For transparency on disruptions and outages, see status.colonelkrud.com.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Governing Law and Dispute Resolution</h2>
        <p>These Terms are governed by laws of the United States and the Commonwealth of Virginia. Disputes will be resolved exclusively in courts located in Ashburn, Virginia. If any provision is invalid or unenforceable, the remaining provisions remain in full force and effect, and any invalidity applies only to the specific unenforceable circumstances.</p>
      </section>

      <p>Notice: You have already consented to the CK Conflux Terms of Use.</p>
    </LegalLayout>
  );
}

function RulesPage() {
  const rules = [
    ['Maintain Privacy', 'Do not share personal information of others without their explicit consent. This includes photos, real names, and contact details.'],
    ['No Impersonation', 'Impersonating other users, celebrities, or public figures is strictly prohibited. Be yourself and respect everyone’s identity.'],
    ['Keep Content Appropriate', 'Post content suitable for all audiences. Avoid explicit, graphic, or violent content unless clearly marked and compliant with guidelines.'],
    ['Respect Copyrights', 'Do not post or share copyrighted material without permission from the copyright holder.'],
    ['No Hate Speech', 'Speech that promotes or incites harm against protected groups is forbidden and will result in a ban.'],
    ['Respect Everyone’s Time', 'Do not tag or mention users excessively and unnecessarily. Be considerate of notifications and online space.'],
    ['Constructive Conversations', 'Engage in constructive discussions. Avoid propagating fake news or misinformation.'],
    ['No Advertisements or Spam', 'Commercial ads are not allowed without prior staff approval, including unsolicited promotions or repetitive messages.'],
    ['Accountability for Content', 'You are responsible for the content you publish. Inappropriate content may be removed and can lead to suspension.'],
    ['Follow Platform Updates', 'Stay informed about updates to community rules and features. Compliance with new rules is expected.'],
    ['Maximum File Size Limit', 'All uploads (images, videos, documents) must not exceed 100MB per file to support server operation and accessibility.'],
    ['CSAM Scanning Enforcement', 'All uploaded content is scanned for CSAM using Cloudflare. Identified CSAM triggers immediate termination and legal reporting.'],
  ];

  return (
    <LegalLayout title="Server Rules" lastUpdated="April 16, 2026">
      <p>These rules apply across CK Conflux community services and are enforced alongside our Terms of Use.</p>
      <div className="grid gap-3">
        {rules.map(([title, body], index) => (
          <article key={title} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold text-white">{index + 1}. {title}</h2>
            <p className="mt-2 text-slate-300">{body}</p>
          </article>
        ))}
      </div>
    </LegalLayout>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-400 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>CK Conflux community platform</span>
        <div className="flex flex-wrap gap-3">
          <a href="/help" className="hover:text-white">Help</a>
          <a href="/terms" className="hover:text-white">Terms of Use</a>
          <a href="/privacy" className="hover:text-white">Privacy Policy</a>
          <a href="/rules" className="hover:text-white">Server Rules</a>
        </div>
      </div>
    </footer>
  );
}

void SignUpFlowCard;
void HomePage;
void HelpPage;
void PrivacyPage;
void TermsPage;
void RulesPage;
void Footer;
void LegalLayout;

export default function CkConfluxLandingPage() {
  const pathname = usePathname();

  const pageMap = {
    '/help': <HelpPage />,
    '/privacy': <PrivacyPage />,
    '/terms': <TermsPage />,
    '/rules': <RulesPage />,
  };

  const content = pageMap[pathname] ?? <HomePage />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <a href="/" className="text-base font-semibold tracking-tight text-white sm:text-lg">CK Conflux</a>
          <nav className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
            <a href="/" className="transition hover:text-white">Home</a>
            <a href="/help" className="transition hover:text-white">Help</a>
            <a href="/terms" className="transition hover:text-white">Terms</a>
            <a href="/privacy" className="transition hover:text-white">Privacy</a>
            <a href="/rules" className="transition hover:text-white">Rules</a>
          </nav>
          <a href="https://element.ckconflux.com" className="rounded-xl bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 sm:px-4">Open Element</a>
        </div>
      </header>
      <main id="top">{content}</main>
      <Footer />
    </div>
  );
}
