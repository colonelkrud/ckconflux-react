import { useId, useState } from 'react';
import { Link } from '../router/Router';

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
        MatrixRTC (Matrix real-time calling) is a native Matrix video conferencing application which lets you make secure video calls with one or more people. In Element this appears as Element Call for room-based voice/video. It keeps calls in your room workflow instead of forcing separate apps.
      </p>
    ),
  },
  { q: 'Does Element support screen sharing?', a: <p>Yes, on supported browsers/platforms. Start a call, choose share screen/window/tab, then confirm permission prompts.</p> },
  {
    q: 'Can I use different display names in different rooms?',
    a: <p>Yes, you can change your display name either globally or for each room individually if your client supports it. Note that this is different from your Matrix User ID (<abbr>MXID</abbr>) which stays fixed (for example <code>@name:ckconflux.com</code>).</p>,
  },
  {
    q: 'How do I send direct messages in Element?',
    a: <p>Use &quot;Start Chat/New Message&quot; and select the user you wish to DM. Element creates a DM room which still follows Matrix safety/reporting tools and server rules.</p>,
  },
  {
    q: 'How do I invite friends with registration codes?',
    a: <p>Share a registration code with them privately offline (i.e. not through element). Your friend enters the code when they sign up at element.ckconflux.com.</p>,
  },
  {
    q: 'Can registration codes be revoked?',
    a: <p>Yes. Codes may be revoked for abuse, spam, or policy violations just like any other access control. See <Link className="font-semibold text-cyan-200 underline" to="/terms">Terms of Use</Link>.</p>,
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
    a: <p>Element X (available on iOS and Android) is the recommended mobile app but your account can also work with any Matrix clients from the ecosystem list. For web, use element.ckconflux.com.</p>,
  },
  {
    q: 'What mobile apps can I use for Mastodon?',
    a: <p>Use the official Mastodon app or other compatible apps depending on your iOS/Android preferences. App features vary, but account compatibility is broad.</p>,
  },
  {
    q: 'Is there a mobile app for TeamSpeak?',
    a: <p>Yes. TeamSpeak has mobile clients, although desktop clients remain best for longer sessions and advanced setups.</p>,
  },
  {
    q: 'TeamSpeak 6 vs TeamSpeak 3?',
    a: <p>Both are used. If you want modern UI, try TeamSpeak 6 first. If your workflow or plugin setup depends on TS3 stability, TS3 remains acceptable.</p>,
  },
  {
    q: 'How do I report content in Mastodon?',
    a: <p>Use "Report" from the post/account menus. When writing a report, include context, and reference policy concerns when needed. Community conduct standards are in <Link className="font-semibold text-cyan-200 underline" to="/rules">Server Rules</Link>.</p>,
  },
  {
    q: 'How do I report content in Element?',
    a: <p>Use message/user actions to report, then provide room links/timestamps to moderators if needed. Enforcement references <Link className="font-semibold text-cyan-200 underline" to="/rules">Server Rules</Link> and <Link className="font-semibold text-cyan-200 underline" to="/terms">Terms of Use</Link>.</p>,
  },
  {
    q: 'How do I report content in TeamSpeak?',
    a: <p>Report to server admins/moderators with usernames, channel details, and time of incident. Behavioral expectations are described in the <Link className="font-semibold text-cyan-200 underline" to="/rules">Server Rules</Link>.</p>,
  },
  {
    q: 'How do I ignore users in Element?',
    a: <p>Click on the profile picture of the person you wish to ignore to open their user profile menu and select "ignore". This hides all their messages from you and reduces unwanted contact. For persistent harassment, report using moderation flows and the Rules/Terms pages.</p>,
  },
  {
    q: 'How do I ignore users in Mastodon?',
    a: <p>Use Mute for softer filtering or Block for stronger prevention. If someone&apos;s behavior violates policy, submit a report which references applicable <Link className="font-semibold text-cyan-200 underline" to="/rules">Rules</Link>.</p>,
  },
  {
    q: 'How do notifications work in Element?',
    a: <p>You can configure notification settings globally and for each individual room.
	If you don&apos;t want to mute a room completely,
	you can configure it to only notify you when you are mentioned or set up other custom rules.
	Tune noisy rooms first so onboarding rooms stay useful.</p>,
  },
  {
    q: 'Do files stay forever?',
    a: <p>Do not assume indefinite retention. Storage and retention are best-effort but may vary by policy, server operations, and federation behavior. See the <Link className="font-semibold text-cyan-200 underline" to="/privacy">Privacy Policy</Link> and <Link className="font-semibold text-cyan-200 underline" to="/terms">Terms of Use</Link>.</p>,
  },
  {
    q: 'How is moderation handled?',
    a: <p>Moderation is best-effort with tools like Draupnir plus admin review. Actions can include content removal or account restrictions. Community expectations live in <Link className="font-semibold text-cyan-200 underline" to="/rules">Server Rules</Link>; enforcement and account obligations are in <Link className="font-semibold text-cyan-200 underline" to="/terms">Terms</Link>.</p>,
  },
];

export default function HelpPage() {
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
          <Link to="/terms" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white">Terms of Use</Link>
          <Link to="/rules" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white">Server Rules</Link>
          <Link to="/privacy" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white">Privacy Policy</Link>
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

