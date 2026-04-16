import { motion } from 'framer-motion';
import {
  Shield,
  MessageSquare,
  Users,
  Video,
  Mic,
  Globe,
  ChevronRight,
  CheckCircle2,
  UserRound,
  KeyRound,
  Mail,
  Captions,
  HeartHandshake,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

function SignInFlowCard() {
  const fields = [
    {
      icon: <UserRound className="h-5 w-5" />,
      label: 'Choose a username',
      value: '@yourname:ckconflux.com',
      note: 'This becomes your permanent Matrix ID, also called your MXID. Your display name can change later, but your MXID does not.',
    },
    {
      icon: <KeyRound className="h-5 w-5" />,
      label: 'Create a safe password',
      value: 'correct-horse-battery-lantern',
      note: 'Use a long passphrase that is easy for you to remember. We require a strong-but-usable password score.',
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Add your email',
      value: '[email protected]',
      note: 'Used for verification and account recovery.',
    },
    {
      icon: <Captions className="h-5 w-5" />,
      label: 'Complete CAPTCHA',
      value: 'I am human',
      note: 'This helps keep bots and spam out.',
    },
  ];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="rounded-[2rem] border border-cyan-300/15 bg-slate-900/80 p-5 shadow-2xl shadow-cyan-950/40"
    >
      <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-400">Create your account</div>
            <div className="mt-1 text-xl font-semibold text-white">Simple, secure sign up</div>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-cyan-200">matrix auth</div>
        </div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="space-y-3">
          {fields.map((field, index) => (
            <motion.div
              key={field.label}
              variants={fadeUp}
              transition={{ delay: index * 0.12 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl bg-cyan-400/10 p-2 text-cyan-200">{field.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-300">{field.label}</div>
                  <motion.div
                    initial={{ width: 0, opacity: 0.35 }}
                    whileInView={{ width: '100%', opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.75, delay: 0.1 + index * 0.15 }}
                    className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                  >
                    {field.value}
                  </motion.div>
                  <div className="mt-2 text-sm leading-6 text-slate-400">{field.note}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100"
        >
          After that, verify your email and continue into Element Web.
        </motion.div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, body }) {
  return (
    <motion.div variants={fadeUp} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
      <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">{icon}</div>
      <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 leading-7 text-slate-300">{body}</p>
    </motion.div>
  );
}

function GettingStartedCard({ title, body, cta, href }) {
  return (
    <motion.a
      variants={fadeUp}
      href={href}
      className="group block rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.07]"
    >
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 leading-7 text-slate-300">{body}</p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-200">
        {cta}
        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </motion.a>
  );
}

function LearnMoreCard() {
  return (
    <motion.div variants={fadeUp} className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
      <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/5 p-5">
        <div className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-200">Learn more</div>
        <h3 className="mt-3 text-2xl font-semibold text-white">MXID details for people who want the technical version</h3>
        <p className="mt-3 leading-7 text-slate-300">
          Your Matrix ID uses the format <span className="font-medium text-white">@localpart:domain</span>. In{' '}
          <span className="font-medium text-white">@yourname:ckconflux.com</span>, the username is the localpart and{' '}
          <span className="font-medium text-white">ckconflux.com</span> is the homeserver domain.
        </p>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="text-sm font-semibold text-white">Immutable identity</div>
          <p className="mt-2 text-sm leading-6 text-slate-400">Your MXID is effectively permanent. If you want a different MXID later, that means making a new account.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="text-sm font-semibold text-white">Display name is flexible</div>
          <p className="mt-2 text-sm leading-6 text-slate-400">What people usually see in chat can be changed later without replacing your account identity.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="text-sm font-semibold text-white">Works across servers</div>
          <p className="mt-2 text-sm leading-6 text-slate-400">Your identity is stable when you join rooms from other Matrix servers, which is one of the biggest differences from Discord.</p>
        </div>
      </div>
    </motion.div>
  );
}

function SpaceCard({ title, rooms }) {
  return (
    <motion.div variants={fadeUp} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Space</div>
      <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
      <div className="mt-5 flex flex-wrap gap-2">
        {rooms.map((room) => (
          <span key={room} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm text-slate-300">
            {room}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function CkConfluxLandingPage() {
  const matrixFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Private by design',
      body: 'Element is a secure messenger built on Matrix, an open communication network designed for encrypted, decentralised chat and calling. It gives you a modern app experience without locking your identity into one company.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Feels familiar if you use Discord',
      body: 'You get rooms, direct messages, spaces, file sharing, voice, video, and communities. The difference is that your identity travels with you as @user:ckconflux.com instead of being trapped inside a single platform.',
    },
    {
      icon: <Video className="h-6 w-6" />,
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
      href: 'https://masto.colonelkrud.com',
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
      q: 'How is moderation handled?',
      a: 'Moderation is best effort and community driven. We work to keep the space healthy, but this is not a giant corporate platform with a massive trust and safety department.',
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
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
              <motion.div variants={fadeUp} className="mb-6 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                Community-run chat, social, and voice
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                A safer, more private community home for people who are tired of Discord lock-in.
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                CK Conflux brings together <span className="font-semibold text-white">Element chat on Matrix</span>,{' '}
                <span className="font-semibold text-white">Mastodon social networking</span>, and <span className="font-semibold text-white">TeamSpeak voice</span>. It is built for people who want familiar community tools with more privacy, more ownership, and less dependence on a single company.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="https://element.ckconflux.com" className="rounded-2xl bg-cyan-400 px-6 py-3 text-base font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5">
                  Start with Element
                </a>
                <a href="#signin" className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10">
                  See the sign-up steps
                </a>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-8 grid gap-4 sm:grid-cols-3">
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
              </motion.div>
            </motion.div>

            <SignInFlowCard />
          </div>
        </section>

        <section id="why" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Why switch</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">What is Element and Matrix, and why should you care?</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">Element is the app. Matrix is the open communication network that powers it. Together, they give you modern chat and calling with more privacy, better portability, and a community that is not owned by a single platform.</p>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="mt-10 grid gap-6 lg:grid-cols-3">
            {matrixFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </motion.div>
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
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="mt-10 grid gap-4 lg:grid-cols-4">
              {mxidComparison.map((item) => (
                <motion.div key={item.label} variants={fadeUp} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">{item.label}</div>
                  <div className="mt-4 text-sm font-medium text-slate-400">Discord</div>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{item.discord}</p>
                  <div className="mt-4 text-sm font-medium text-slate-400">Matrix</div>
                  <p className="mt-1 text-sm leading-6 text-white">{item.matrix}</p>
                </motion.div>
              ))}
            </motion.div>
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
              <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-200"><Users className="h-6 w-6" /></div>
              <h3 className="mt-5 text-xl font-semibold text-white">Spaces = servers</h3>
              <p className="mt-3 leading-7 text-slate-300">Spaces group related rooms together so your community feels organized. They work like Discord servers, but can also point to rooms that live elsewhere on Matrix.</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-200"><MessageSquare className="h-6 w-6" /></div>
              <h3 className="mt-5 text-xl font-semibold text-white">Rooms = channels</h3>
              <p className="mt-3 leading-7 text-slate-300">Rooms can be public or private. They can be used for general chat, announcements, help, media sharing, support, or topic-specific discussion.</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-200"><Video className="h-6 w-6" /></div>
              <h3 className="mt-5 text-xl font-semibold text-white">Call rooms = voice and video</h3>
              <p className="mt-3 leading-7 text-slate-300">Element supports voice, video, and screen sharing. Instead of treating calls as a separate world, Matrix can attach the call experience right to the room your group already uses.</p>
            </div>
          </div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="mt-10 grid gap-6 lg:grid-cols-3">
            {spaceExamples.map((space) => (
              <SpaceCard key={space.title} {...space} />
            ))}
          </motion.div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Discovery</div>
              <h3 className="mt-3 text-2xl font-semibold text-white">Find rooms and communities beyond one server</h3>
              <p className="mt-3 leading-7 text-slate-300">This is one of Matrix’s biggest differences from Discord. Your account can live on ckconflux.com while you still browse and join public rooms from other servers.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {publicRoomExamples.map((room) => (
                  <span key={room} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm text-slate-300">{room}</span>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-400">You can also create your own room, choose whether it is public or private, and add it to a space just like building out channels in a Discord server.</div>
            </div>
            <LearnMoreCard />
          </div>
        </section>

        <section id="signin" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
              <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">How to sign in</motion.p>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Clear, friendly onboarding beats technical jargon</motion.h2>
              <motion.p variants={fadeUp} className="mt-4 text-lg leading-8 text-slate-300">We modeled this section after the Matrix account registration flow: username, email address, password, confirm password, terms, and CAPTCHA before you continue. Instead of dumping raw form fields on people, this page explains why each step matters.</motion.p>
              <motion.div variants={stagger} className="mt-8 space-y-4">
                {[
                  'Pick a username. This becomes your permanent Matrix ID, also called your MXID.',
                  'Use a long passphrase as your password. Long and memorable is safer than short and tricky.',
                  'Complete the CAPTCHA to stop bots and spam signups.',
                  'Verify your email so you can confirm the account and recover it later.',
                  'Then open Element and start chatting with your new @user:ckconflux.com identity.',
                ].map((item) => (
                  <motion.div key={item} variants={fadeUp} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-cyan-200" />
                    <p className="text-slate-300">{item}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            <SignInFlowCard />
          </div>
        </section>

        <section id="services" className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Get started by service</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Choose the tool that matches how you want to connect</h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">Chat, social posting, and voice each have a different job. The easiest acquisition path is to explain the benefit first, then the next action.</p>
            </div>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="mt-10 grid gap-6 lg:grid-cols-3">
              {learnSections.map((section) => (
                <GettingStartedCard key={section.title} {...section} />
              ))}
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-200"><MessageSquare className="h-6 w-6" /></div>
              <h3 className="mt-5 text-xl font-semibold text-white">Element on Matrix</h3>
              <p className="mt-3 leading-7 text-slate-300">Best for persistent chat, communities, direct messages, media sharing, spaces, voice messages, and secure collaboration. Great default choice for most users.</p>
              <div className="mt-5 space-y-2 text-sm text-cyan-200">
                <a href="https://element.ckconflux.com" className="block">Open Element Web</a>
                <a href="https://element.io/en/user-guide" className="block">Element user guide</a>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-200"><Globe className="h-6 w-6" /></div>
              <h3 className="mt-5 text-xl font-semibold text-white">Mastodon</h3>
              <p className="mt-3 leading-7 text-slate-300">Best for public posting, following updates, and lightweight social discovery. It is a federated social network, which means you can follow people across many servers while keeping your home account here.</p>
              <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">New accounts require manual approval.</div>
              <div className="mt-5 space-y-2 text-sm text-cyan-200">
                <a href="https://masto.colonelkrud.com" className="block">Register on Mastodon</a>
                <a href="https://docs.joinmastodon.org/user/" className="block">Mastodon user guide</a>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-200"><Mic className="h-6 w-6" /></div>
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
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Community-run, privacy-minded, and built to last</h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">Moderation is best effort. Terms of Service, Privacy Policy, and Security Policy links can live here as downloadable documents. If you want to help keep the project running, you can support it directly.</p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm text-cyan-200">
                  <a href="#" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">Download ToS</a>
                  <a href="#" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">Download Privacy Policy</a>
                  <a href="#" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">Download Security Policy</a>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <a href="https://element.ckconflux.com" className="rounded-2xl bg-cyan-400 px-6 py-3 text-center text-base font-semibold text-slate-950 transition hover:-translate-y-0.5">Join with Element</a>
                <a href="https://buymeacoffee.com/conflux" className="rounded-2xl bg-amber-300 px-6 py-3 text-center text-base font-semibold text-slate-950 transition hover:-translate-y-0.5">
                  <span className="inline-flex items-center gap-2"><HeartHandshake className="h-5 w-5" /> Support us</span>
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
