import { useEffect, useRef, useState } from 'react';

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

const signUpFields = [
  { key: 'username', label: 'Choose a username', value: '@yourname:ckconflux.com', helper: 'This becomes your permanent Matrix ID, also called your MXID. Your display name can change later, but your MXID does not.' },
  { key: 'password', label: 'Create a safe password', value: 'correct-horse-battery-lantern', helper: 'Use a long passphrase that is easy for you to remember. We require a strong-but-usable password score.' },
  { key: 'email', label: 'Add your email', value: '[email protected]', helper: 'Used for verification and account recovery.' },
];

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
      await wait(350);
      for (let i = 0; i < signUpFields.length; i += 1) {
        const field = signUpFields[i];
        setVisibleFields(i + 1);
        await wait(250);
        for (let charIndex = 1; charIndex <= field.value.length; charIndex += 1) {
          if (cancelled) {
            return;
          }
          const partialValue = field.value.slice(0, charIndex);
          setTypedValues((prev) => ({ ...prev, [field.key]: partialValue }));
          await wait(38);
        }
        await wait(700);
      }

      setVisibleFields(signUpFields.length + 1);
      await wait(900);
      setCaptchaChecked(true);
    };

    runSequence();

    return () => {
      cancelled = true;
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [hasEnteredView, prefersReducedMotion]);

  return (
    <div ref={cardRef} className="rounded-[1.8rem] border border-cyan-300/20 bg-slate-900/90 p-6 shadow-2xl shadow-cyan-950/30">
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Simple, secure sign up</div>
      <h3 className="mt-3 text-2xl font-semibold text-white">matrix auth</h3>
      <div className="mt-6 space-y-4">
        {signUpFields.map((field, index) => {
          const isVisible = visibleFields > index;
          const value = typedValues[field.key];
          return (
            <div key={field.key} className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-sm font-medium text-slate-300">{field.label}</div>
              <div className="mt-2 flex h-11 items-center rounded-xl border border-white/10 bg-slate-950 px-3 font-mono text-sm text-slate-100">
                {value}
                {isVisible && value.length < field.value.length && <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-cyan-200" />}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{field.helper}</p>
            </div>
          );
        })}

        <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition duration-500 ${visibleFields > signUpFields.length ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-sm font-medium text-slate-300">Complete CAPTCHA</div>
          <div className="mt-2 rounded-xl border border-white/15 bg-slate-950/90 p-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded border text-sm transition ${captchaChecked ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' : 'border-slate-500 bg-slate-800 text-transparent'}`}>
                  ✓
                </div>
                <span className="text-sm text-slate-100">I am human</span>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-400">CAPTCHA</div>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-400">This helps keep bots and spam out.</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-300">After that, verify your email and continue into Element Web.</p>
      <a
        href="https://buymeacoffee.com/conflux"
        className="mt-4 inline-flex rounded-xl bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
      >
        Get a registration token
      </a>
    </div>
  );
}

export default function CkConfluxLandingPage() {
  const matrixFeatures = [
    {
      title: 'Private by design',
      body: 'Element is a secure messenger built on Matrix, an open communication network designed for encrypted, decentralised chat and calling. It gives you a modern app experience without locking your identity into one company.',
    },
    {
      title: 'Feels familiar if you use Discord',
      body: 'You get rooms, direct messages, spaces, file sharing, voice, video, and communities. The difference is that your identity travels with you as @user:ckconflux.com instead of being trapped inside a single platform.',
    },
    {
      title: 'Built-in voice and video',
      body: 'Element supports voice and video calling, including Element Call for modern MatrixRTC-based calling and fallback VoIP support for wider compatibility across clients.',
    },
  ];

  const onboardingSteps = [
    {
      title: 'What is Element and Matrix?',
      body: 'Element is the app you use. Matrix is the open network underneath it. Think of it like using a modern chat app on a network that is not owned by a single company.',
    },
    {
      title: 'Why should I care?',
      body: 'You get a Discord-like experience with more control over privacy, identity, and community ownership. No ads, less lock-in, and a healthier long-term home for communities.',
    },
    {
      title: 'How do I sign in?',
      body: 'Open Element Web, create an account, choose your username and password, complete the CAPTCHA, verify your email, and you are in.',
    },
  ];

  const learnSections = [
    {
      title: 'Start with Element chat',
      body: 'Use Element Web at element.ckconflux.com for messaging, rooms, spaces, file sharing, voice messages, and secure direct chats. It is the easiest place for most people to begin.',
      cta: 'Open Element Web',
      href: 'https://element.ckconflux.com',
    },
    {
      title: 'Join Mastodon for social updates',
      body: 'Mastodon is a federated social network, similar to Twitter or Bluesky in day-to-day use, but community-run. Register on masto.colonelkrud.com to follow updates, discover people, and join conversations beyond chat rooms.',
      cta: 'Register for Mastodon',
      href: 'https://masto.colonelkrud.com/auth/sign_up',
    },
    {
      title: 'Use TeamSpeak for voice-first sessions',
      body: 'TeamSpeak is still one of the best tools for low-overhead voice chat for gaming and live coordination. Download the client, then connect to ts3.ckconflux.com to join the server.',
      cta: 'Download TeamSpeak',
      href: 'https://www.teamspeak.com/en/downloads/',
    },
  ];

  const mxidComparison = [
    {
      label: 'MXID',
      discord: 'Username lives inside Discord',
      matrix: 'Your permanent Matrix identity is @user:ckconflux.com',
    },
    {
      label: 'Display name',
      discord: 'Nickname can vary by server',
      matrix: 'Display name is what people usually see and can be changed later',
    },
    {
      label: 'Communities',
      discord: 'Servers contain channels',
      matrix: 'Spaces contain rooms',
    },
    {
      label: 'Voice and video',
      discord: 'Separate voice channels',
      matrix: 'Call rooms can live right inside your room flow',
    },
  ];

  const spaceExamples = [
    {
      title: 'CK Conflux Community',
      rooms: ['General Chat', 'Help', 'Tech News', 'Programmer Humor', 'Voice Chat', 'Science Sharing'],
    },
    {
      title: '332 Gamers Community',
      rooms: ['332 Gamers #General', 'Video Games', 'Factorio', '332 Gamers #Public'],
    },
    {
      title: 'CK Admin Community',
      rooms: ['General Chat', 'Git', 'Development', 'Moderators', 'Draupnir', 'Plex Requests'],
    },
  ];

  const publicRoomExamples = ['#draupnir:matrix.org', '#synapse:codestorm.net', '#matrix-on-kubernetes:fiksel.info'];

  const faqs = [
    {
      q: 'What should I use first?',
      a: 'Start with Element Web at element.ckconflux.com. That is the main chat experience for messaging, rooms, communities, voice, and video.',
    },
    {
      q: 'What is my username?',
      a: 'Your permanent Matrix ID is called an MXID. It looks like @yourname:ckconflux.com. It does not change later, but your display name can.',
    },
    {
      q: 'Why do you ask for email verification?',
      a: 'Email verification helps confirm that you control the account and gives you a recovery path if you lose access later.',
    },
    {
      q: 'Is this basically Discord?',
      a: 'For most people, yes in everyday use. You still get communities, rooms, DMs, media sharing, and calls. The big difference is stronger privacy, open standards, and community ownership.',
    },
    {
      q: 'What is a room, space, or call room?',
      a: 'A space is like a Discord server. A room is like a channel. A call room gives you voice or video inside the Matrix room flow instead of making voice chat feel like a separate product.',
    },
    {
      q: 'Can I discover communities outside this server?',
      a: 'Yes. Matrix lets you join public rooms and spaces from other servers, so your account on ckconflux.com can still participate across the wider network.',
    },
    {
      q: 'How do I join Mastodon here?',
      a: 'Go to masto.colonelkrud.com and register for an account. Accounts are manually approved so expect a review step before access is granted.',
    },
    {
      q: 'How do I join TeamSpeak?',
      a: 'Install the TeamSpeak client, open it, choose to connect to a server, and enter ts3.ckconflux.com as the server address.',
    },
    {
      q: 'How do I get a registration token?',
      a: 'New Matrix accounts need a registration token. You can request one from an existing member, or get token access through any supported tier at buymeacoffee.com/conflux.',
    },
    {
      q: 'Do files stay forever?',
      a: 'You can send images and files just like Discord. If a file is accessed regularly, it stays available. If no one views it for over a year, it is automatically removed. We used to store files forever, but storage costs became too high to sustain long term.',
    },
    {
      q: 'How is moderation handled?',
      a: 'Moderation is best effort. CK Conflux uses Draupnir for community moderation, which is part of the Matrix moderation ecosystem and helps with coordinated, shared protections across rooms and communities. We also participate in the Mastodon Garden Fence Project blocklist ecosystem. The goal is to reduce abuse, spam, and harmful content, but moderation is never perfect.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#top" className="text-lg font-semibold tracking-tight text-white">
            CK Conflux
          </a>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#why" className="transition hover:text-white">
              Why switch
            </a>
            <a href="#spaces" className="transition hover:text-white">
              Spaces & rooms
            </a>
            <a href="#signin" className="transition hover:text-white">
              How to sign in
            </a>
            <a href="#services" className="transition hover:text-white">
              Services
            </a>
            <a href="#faq" className="transition hover:text-white">
              FAQ
            </a>
          </nav>
          <a
            href="https://element.ckconflux.com"
            className="rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5"
          >
            Open Element
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.18),transparent_25%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-28">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                Community-run chat, social, and voice
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                A safer, more private community home for people who are tired of Discord lock-in.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                CK Conflux brings together <span className="font-semibold text-white">Element chat on Matrix</span>,{' '}
                <span className="font-semibold text-white">Mastodon social networking</span>, and <span className="font-semibold text-white">TeamSpeak voice</span>. It is built for people who want familiar community tools with more privacy, more ownership, and less dependence on a single company.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="https://element.ckconflux.com" className="rounded-2xl bg-cyan-400 px-6 py-3 text-base font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5">
                  Start with Element
                </a>
                <a href="#signin" className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10">
                  See the sign-up steps
                </a>
              </div>
              <p className="mt-3 text-sm text-slate-400">No ads. Community-run since 2015.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-slate-400">Chat identity</div>
                  <div className="mt-1 font-medium text-white">@user:ckconflux.com</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-slate-400">Social network</div>
                  <div className="mt-1 font-medium text-white">masto.colonelkrud.com</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-slate-400">Voice server</div>
                  <div className="mt-1 font-medium text-white">ts3.ckconflux.com</div>
                </div>
              </div>
            </div>

            <div />
          </div>
        </section>

        <section id="why" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Why switch</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">What is Element and Matrix, and why should you care?</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">Element is the app. Matrix is the open communication network that powers it. Together, they give you modern chat and calling with more privacy, better portability, and a community that is not owned by a single platform.</p>
          </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {matrixFeatures.map((feature) => (
                <div key={feature.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{feature.body}</p>
                </div>
              ))}
            </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">How it compares</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Familiar like Discord, different where it matters</h2>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {onboardingSteps.map((step) => (
                <div key={step.title} className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{step.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-4">
              {mxidComparison.map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">{item.label}</div>
                  <div className="mt-4 text-sm font-medium text-slate-400">Discord</div>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{item.discord}</p>
                  <div className="mt-4 text-sm font-medium text-slate-400">Matrix</div>
                  <p className="mt-1 text-sm leading-6 text-white">{item.matrix}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="signin" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">How to sign in</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Getting started should feel simple, not confusing.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">We guide you through creating your account step by step so you can see exactly what to expect before you begin.</p>
              <div className="mt-8 space-y-4">
                {[
                  'Choose a username first. It becomes your permanent Matrix ID (MXID).',
                  'Use a long passphrase for a strong-but-usable password score.',
                  'Add your email for verification and account recovery.',
                  'Complete the CAPTCHA to reduce bots and spam.',
                  'Verify your email, then continue into Element Web.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="mt-0.5 h-5 w-5 flex-none text-cyan-200">•</span>
                    <p className="text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
                New Matrix accounts require a registration token. Existing members can share one, and every supported tier on{' '}
                <a href="https://buymeacoffee.com/conflux" className="font-semibold underline decoration-amber-200/70 underline-offset-2">
                  Buy Me a Coffee
                </a>{' '}
                includes registration-token access.
              </div>
            </div>
            <SignUpFlowCard />
          </div>
        </section>

        <section id="spaces" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Spaces, rooms, and calls</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Learn Matrix with Discord terms first</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">A <span className="font-semibold text-white">space</span> is like a Discord server. A <span className="font-semibold text-white">room</span> is like a channel. A <span className="font-semibold text-white">call room</span> gives you voice and video directly inside the room flow, so joining a conversation feels more natural.</p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">•</div>
              <h3 className="mt-5 text-xl font-semibold text-white">Spaces = servers</h3>
              <p className="mt-3 leading-7 text-slate-300">Spaces group related rooms together so your community feels organized. They work like Discord servers, but can also point to rooms that live elsewhere on Matrix.</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">•</div>
              <h3 className="mt-5 text-xl font-semibold text-white">Rooms = channels</h3>
              <p className="mt-3 leading-7 text-slate-300">Rooms can be public or private. They can be used for general chat, announcements, help, media sharing, support, or topic-specific discussion.</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">•</div>
              <h3 className="mt-5 text-xl font-semibold text-white">Call rooms = voice and video</h3>
              <p className="mt-3 leading-7 text-slate-300">Element supports voice, video, and screen sharing. Instead of treating calls as a separate world, Matrix can attach the call experience right to the room your group already uses.</p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {spaceExamples.map((space) => (
              <div key={space.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Space</div>
                <h3 className="mt-3 text-xl font-semibold text-white">{space.title}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {space.rooms.map((room) => (
                    <span key={room} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm text-slate-300">
                      {room}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Discovery</div>
              <h3 className="mt-3 text-2xl font-semibold text-white">Find rooms and communities beyond one server</h3>
              <p className="mt-3 leading-7 text-slate-300">This is one of Matrix’s biggest differences from Discord. Your ckconflux.com account can still join public rooms and communities hosted on other Matrix servers.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {publicRoomExamples.map((room) => (
                  <span key={room} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm text-slate-300">{room}</span>
                ))}
              </div>
              <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-400">
                <p>
                  Browse public rooms with{' '}
                  <a href="https://matrixrooms.info/" className="font-medium text-cyan-200 underline decoration-cyan-300/60 underline-offset-2">
                    matrixrooms.info
                  </a>
                  , then join what fits your interests.
                </p>
                <p>Create your own room, choose public or private visibility, and organize rooms into spaces just like channels under a server.</p>
                <p>
                  Try this room first:{' '}
                  <a href="https://matrix.to/#/%23draupnir:matrix.org" className="font-medium text-cyan-200 underline decoration-cyan-300/60 underline-offset-2">
                    #draupnir:matrix.org
                  </a>
                </p>
              </div>
            </div>
            <div />
          </div>
        </section>

        <section id="services" className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Get started by service</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Choose the tool that matches how you want to connect</h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">Chat, social posting, and voice each have a different job. The easiest acquisition path is to explain the benefit first, then the next action.</p>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {learnSections.map((section) => (
                <a
                  key={section.title}
                  href={section.href}
                  className="group block rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.07]"
                >
                  <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{section.body}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-200">{section.cta}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">•</div>
              <h3 className="mt-5 text-xl font-semibold text-white">Element on Matrix</h3>
              <p className="mt-3 leading-7 text-slate-300">Best for persistent chat, communities, direct messages, media sharing, spaces, voice messages, and secure collaboration. Great default choice for most users.</p>
              <div className="mt-5 space-y-2 text-sm text-cyan-200">
                <a href="https://element.ckconflux.com" className="block">Open Element Web</a>
                <a href="https://element.io/en/user-guide" className="block">Element user guide</a>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">•</div>
              <div className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Best for social updates</div>
              <h3 className="mt-5 text-xl font-semibold text-white">Mastodon</h3>
              <p className="mt-3 leading-7 text-slate-300">Best for public posting, following updates, and lightweight social discovery. It is a federated social network, which means you can follow people across many servers while keeping your home account here.</p>
              <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">New accounts require manual approval.</div>
              <div className="mt-5 space-y-2 text-sm text-cyan-200">
                <a href="https://masto.colonelkrud.com/auth/sign_up" className="block">Register on Mastodon</a>
                <a href="https://docs.joinmastodon.org/user/" className="block">Mastodon user guide</a>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">•</div>
              <div className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Best for voice coordination</div>
              <h3 className="mt-5 text-xl font-semibold text-white">TeamSpeak</h3>
              <p className="mt-3 leading-7 text-slate-300">Best for low-latency voice sessions, gaming, and live coordination. If your group is voice-first, this is the fastest path from install to talking.</p>
              <div className="mt-5 space-y-2 text-sm text-cyan-200">
                <a href="https://www.teamspeak.com/en/downloads/" className="block">Download TeamSpeak</a>
                <a href="https://www.teamspeak.com/en/support/get-started/" className="block">TeamSpeak getting started guide</a>
                <div className="pt-1 text-slate-400">Server address: <span className="font-medium text-white">ts3.ckconflux.com</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Common questions from new users</h2>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold text-white">{faq.q}</h3>
                <p className="mt-3 leading-7 text-slate-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
          <div className="rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-purple-500/10 p-8 shadow-2xl shadow-cyan-950/30">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Community supported</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Independently run and transparent</h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">This community is independently run and costs about $700 per month to operate.</p>
                <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-300">It’s a passion project maintained by Colonelkrud since 2015.</p>
                <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-300">We focus on reliability and transparency:</p>
                <ul className="mt-3 list-disc space-y-2 pl-6 text-lg leading-8 text-slate-300">
                  <li>
                    99.999%{' '}
                    <a href="https://status.colonelkrud.com" className="font-medium text-cyan-200 underline decoration-cyan-300/60 underline-offset-2">
                      uptime
                    </a>{' '}
                    over the past year
                  </li>
                  <li>Mean time between failures: 121.67 days</li>
                </ul>
                <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-300">
                  Check the{' '}
                  <a href="https://status.colonelkrud.com" className="font-medium text-cyan-200 underline decoration-cyan-300/60 underline-offset-2">
                    status page
                  </a>{' '}
                  for live uptime, maintenance updates, and incident history.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm text-cyan-200">
                  <a href="#" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">Download ToS</a>
                  <a href="#" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">Download Privacy Policy</a>
                  <a href="#" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">Download Security Policy</a>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <a href="https://element.ckconflux.com" className="rounded-2xl bg-cyan-400 px-6 py-3 text-center text-base font-semibold text-slate-950 transition hover:-translate-y-0.5">Join with Element</a>
                <a href="https://buymeacoffee.com/conflux" className="rounded-2xl bg-amber-300 px-6 py-3 text-center text-base font-semibold text-slate-950 transition hover:-translate-y-0.5">
                  <span className="inline-flex items-center gap-2">Support us</span>
                </a>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm leading-6 text-slate-300">Also available: social posting on <span className="font-medium text-white">masto.colonelkrud.com</span> and voice chat on <span className="font-medium text-white">ts3.ckconflux.com</span>.</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
