import { useId, useState } from 'react';
import { Link } from '../router/Router';
import { ACCOUNT_PORTAL_URL, MASTODON_SERVICE_URL, PASSWORD_RECOVERY_URL, PUBLIC_CONTACTS } from '../config/community';

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
  { q: 'I forgot my account password. What should I do?', a: <p>Use <a className="font-semibold text-cyan-200 underline" href={PASSWORD_RECOVERY_URL}>Element’s self-service password recovery</a> first. If it fails after using your verified email, contact <a className="font-semibold text-cyan-200 underline" href={PUBLIC_CONTACTS.support.mailto}>account support</a>. Password recovery does not restore encryption keys or old encrypted messages.</p> },
  { q: 'What are Matrix IDs and display names?', a: <p>Your permanent Matrix ID (MXID) looks like <code>@name:ckconflux.com</code> and identifies you across federation. A display name is the changeable name people see in rooms and is not a unique account identifier.</p> },
  { q: 'How do DMs, rooms, and Spaces differ?', a: <p>A direct message is a room intended for a smaller conversation. Rooms hold conversations and membership; their visibility, permissions, and encryption can differ. Spaces organize related rooms without replacing the rooms themselves.</p> },
  { q: 'How do notifications work?', a: <p>Configure notifications globally and per room. For a busy room, choose mentions-only or another available level rather than muting everything. Client options can differ.</p> },
  { q: 'Can I use another Matrix client?', a: <p>Yes. Matrix is an open protocol and compatible clients can use your account. CK Conflux recommends Element on the web/desktop and Element X on iOS and Android; features, encryption support, calls, and setup can vary in other clients.</p> },
  { q: 'How do Element Call, MatrixRTC, and screen sharing fit together?', a: <p>Element Call is the primary voice/video experience linked from Matrix rooms, and MatrixRTC is the underlying Matrix calling technology. Screen sharing is available from supported clients and browsers; permissions and device support can affect it. See <Link className="font-semibold text-cyan-200 underline" to="/calls">Element Call</Link>.</p> },
  { q: 'How does federation work?', a: <p>Your CK Conflux MXID can join compatible federated rooms when room and server policies allow. Participating homeservers exchange the data required for the room, and CK Conflux does not control third-party servers.</p> },
  { q: 'How do I report, ignore, or block someone?', a: <p>Open the message or user actions in your client to report, ignore, or block. Include room links, timestamps, and relevant context in a report. Blocking or ignoring changes your experience; reporting asks moderators to review conduct under the <Link className="font-semibold text-cyan-200 underline" to="/rules">Rules</Link>. Encrypted reports may require you to provide the content moderators need.</p> },
  { q: 'Do messages and media stay forever?', a: <p>Do not assume indefinite retention. Storage and retention vary by service, room, account state, operations, and federation. Encrypted Matrix media may be stored as ciphertext; this does not mean the server can scan every upload in plaintext. See <Link className="font-semibold text-cyan-200 underline" to="/privacy">Privacy</Link>.</p> },
  { q: 'How do registration codes work?', a: <p>Share a registration code privately, outside Element. A friend enters it during registration. Codes may be revoked for abuse, spam, or policy violations. Existing members or a supported tier at <a className="font-semibold text-cyan-200 underline" href="https://buymeacoffee.com/conflux">Buy Me a Coffee</a> may provide a token.</p> },
  { q: 'What about Mastodon or TeamSpeak support?', a: <p><a className="font-semibold text-cyan-200 underline" href={MASTODON_SERVICE_URL}>Open CK Conflux Mastodon</a> to use the secondary supported social service. Mastodon reports use the post or account report menu; mute and block are also available. TeamSpeak is a separate beta service: provide admins the username, channel, and incident time when reporting. Its identity and recovery are separate from Matrix. See the <Link className="font-semibold text-cyan-200 underline" to="/teamspeak">TeamSpeak page</Link>.</p> },
];

export default function HelpPage() {
  return <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
    <header className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 sm:text-sm">Help center</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Matrix onboarding, FAQ, and support resources</h1><p className="mt-4 text-lg leading-8 text-slate-300">Start safely with Element, then find everyday Matrix and moderation guidance.</p></header>

    <section id="first-five-minutes" className="mt-8 scroll-mt-24" aria-labelledby="first-five-minutes-heading"><h2 id="first-five-minutes-heading" className="text-2xl font-semibold text-white">Your first five minutes in CK Conflux</h2><p className="mt-3 max-w-3xl leading-7 text-slate-300">CK Conflux uses Element for community conversation. These CK-specific steps explain what appears after registration; Element’s maintained guides cover client menus and controls.</p><ol className="mt-4 grid gap-4 md:grid-cols-2">
      {[
        ['Open Element and recognize your identity', <>Open <a className="font-semibold text-cyan-200 underline" href="https://element.ckconflux.com">CK Conflux Element</a>. Your permanent Matrix ID (MXID) looks like <code>@name:ckconflux.com</code>; your changeable display name is not your unique account identity.</>],
        ['Find your welcome room', <><code>#welcome:ckconflux.com</code> is for orientation, important getting-started information, and official introduction and context.</>],
        ['Join the conversation', <><code>#general:ckconflux.com</code> is where normal community conversation happens.</>],
        ['Know where to ask for help', <><code>#help-and-support:ckconflux.com</code> is the CK Conflux-specific community room for service and help questions. For account, abuse, privacy, security, membership, outage, or operator support, use the maintained <Link className="font-semibold text-cyan-200 underline" to="/support">support routes</Link>.</>],
        ['Understand Server Notices', <>Server Notices are generated by the CK Conflux homeserver for important administrative or service communication. They are distinct from ordinary user rooms, so understand their purpose before muting, leaving, or ignoring them. The <a className="font-semibold text-cyan-200 underline" href="https://status.ckconflux.com">independent status page</a> remains the source for availability.</>],
        ['Secure your encrypted history', <>Set up encryption recovery, store the recovery key safely away from your primary device, and establish trust when adding another device or session. <Link className="font-semibold text-cyan-200 underline" to="/security">Read Security &amp; recovery</Link> for the important password and verification distinctions.</>],
        ['Add Element X on mobile', <>Element X is CK Conflux’s recommended current mobile client for iOS and Android. Use the <a className="font-semibold text-cyan-200 underline" href="https://element.io/download">official Element download page</a>, then trust the new session using an already verified session or your recovery method.</>],
        ['Start voice or video calls', <>Element Call, powered by MatrixRTC, is CK Conflux’s primary calling path. Continue to the maintained <Link className="font-semibold text-cyan-200 underline" to="/calls">Element Call guide</Link>.</>],
      ].map(([title, copy], i) => <li key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5"><span className="text-xs font-semibold text-cyan-200">STEP {i + 1}</span><h3 className="mt-2 font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p></li>)}
    </ol></section>

    <section className="mt-10 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-5"><h2 className="text-xl font-semibold text-white">Membership &amp; storage help</h2><p className="mt-2 text-sm leading-6 text-slate-300">Read the <Link className="font-semibold text-cyan-200 underline" to="/membership">membership and storage overview</Link> to understand total stored-media capacity and the separate monthly media allowance. <a className="font-semibold text-cyan-200 underline" href={ACCOUNT_PORTAL_URL}>My Account</a> is authoritative for your signed-in account’s actual current allowances, usage, and entitlement.</p></section>

    <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="text-xl font-semibold text-white">Learn Element</h2><p className="mt-2 text-sm leading-6 text-slate-300">For client controls that change over time, follow first-party documentation rather than an old screenshot guide.</p><ul className="mt-3 grid list-disc gap-2 pl-5 text-sm text-slate-300 sm:grid-cols-2"><li><a className="font-semibold text-cyan-200 underline" href="https://docs.element.io/latest/element-support/quick-start-guide/onboarding/">Element onboarding guide</a></li><li><a className="font-semibold text-cyan-200 underline" href="https://docs.element.io/latest/element-support/quick-start-guide/the-left-panel/">Rooms, DMs, Spaces, and notifications in the left panel</a></li><li><a className="font-semibold text-cyan-200 underline" href="https://docs.element.io/latest/element-support/quick-start-guide/the-right-panel/">Room information in the right panel</a></li><li><a className="font-semibold text-cyan-200 underline" href="https://docs.element.io/latest/element-support/matrix-rooms/understanding-matrix-rooms/">Understanding Matrix rooms</a></li><li><a className="font-semibold text-cyan-200 underline" href="https://docs.element.io/latest/element-support/matrix-messaging/">Element messages and threads</a></li><li><a className="font-semibold text-cyan-200 underline" href="https://matrix.org/docs/chat_basics/">Matrix chat basics</a></li><li><a className="font-semibold text-cyan-200 underline" href="https://docs.element.io/latest/element-support/frequently-asked-questions/">Official Element FAQ</a></li><li><a className="font-semibold text-cyan-200 underline" href="https://matrix.org/ecosystem/clients/">Matrix client directory</a></li></ul></section>

    <section className="mt-10"><h2 className="text-2xl font-semibold text-white">Everyday questions</h2><div className="mt-4 space-y-3">{faqItems.map((item, index) => <AccordionItem key={item.q} title={item.q} defaultOpen={index === 0}>{item.a}</AccordionItem>)}</div></section>
    <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="text-xl font-semibold text-white">Policies</h2><div className="mt-3 flex flex-wrap gap-3">{[['Terms','/terms'],['Rules','/rules'],['Privacy','/privacy'],['Support','/support']].map(([label,to]) => <Link key={to} to={to} className="rounded-lg border border-white/15 px-3 py-2 font-semibold text-white">{label}</Link>)}</div></section>
  </section>;
}
