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
      q: 'How do I find and join rooms?',
      a: 'You can browse public rooms using https://matrixrooms.info/, a directory that lets you search communities by topic or interest. There are thousands of rooms across many servers. You can join existing communities or create your own with friends. Some large rooms require approval to join. If a room has more than 1,000 members, you may receive a direct message with instructions after requesting access.',
    },
    {
      q: 'Do files stay forever?',
      a: 'You can send images and files just like Discord. If a file is accessed regularly, it stays available. If no one views it for over a year, it is automatically removed. We used to store files forever, but storage costs became too high to sustain long term.',
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
              <p className="mt-3 leading-7 text-slate-300">This is one of Matrix’s biggest differences from Discord. Your account can live on ckconflux.com while you still browse and join public rooms from other servers.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {publicRoomExamples.map((room) => (
                  <span key={room} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm text-slate-300">{room}</span>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-400">You can also create your own room, choose whether it is public or private, and add it to a space just like building out channels in a Discord server.</div>
            </div>
            <div />
          </div>
        </section>

        <section id="signin" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">How to sign in</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Getting started should feel simple, not confusing.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">We guide you through creating your account step by step — username, email, password, and a quick verification. Each step is explained clearly so you know exactly what’s happening and why.</p>
              <div className="mt-8 space-y-4">
                {[
                  'Pick a username. This becomes your permanent Matrix ID, also called your MXID.',
                  'Use a long passphrase as your password. Long and memorable is safer than short and tricky.',
                  'Complete the CAPTCHA to stop bots and spam signups.',
                  'Verify your email so you can confirm the account and recover it later.',
                  'Then open Element and start chatting with your new @user:ckconflux.com identity.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="mt-0.5 h-5 w-5 flex-none text-cyan-200">•</span>
                    <p className="text-slate-300">{item}</p>
                  </div>
                ))}
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
                  <li>99.999% uptime over the past year</li>
                  <li>3 incidents totaling 3 minutes and 14 seconds</li>
                  <li>Mean time between failures: 121.67 days</li>
                </ul>
                <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-300">You can view uptime, maintenance, and incidents at https://status.colonelkrud.com</p>
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
