import { Link } from '../router/Router';

const concepts = [
  ['Direct messages', 'DMs are private Matrix rooms for conversations with one or more people.'],
  ['Rooms', 'Rooms keep messages, shared files and media, members, and calls together around a conversation.'],
  ['Spaces', 'Spaces organize related rooms so a community or project is easier to browse.'],
  ['Federation', 'Federation lets independently operated Matrix homeservers communicate, much like email servers do.'],
];

export default function MatrixPage() {
  return <>
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.15),transparent_30%)]" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 sm:text-sm">Element on Matrix</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">Open communication, with a community you know</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">Matrix is an open, federated communication protocol and network. CK Conflux is the community-operated Matrix homeserver and community you can join. Element is our recommended app for using it.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link to="/join" className="rounded-xl bg-cyan-400 px-5 py-3 text-center font-semibold text-slate-950">Create Account</Link>
          <a href="https://element.ckconflux.com" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-center font-semibold text-white">Open Element</a>
          <Link to="/calls" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-center font-semibold text-white">Calls</Link>
        </div>
      </div>
    </section>

    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-5"><p className="text-xs font-semibold uppercase tracking-widest text-cyan-200">The network</p><h2 className="mt-2 text-xl font-semibold text-white">Matrix</h2><p className="mt-2 text-sm leading-6 text-slate-300">The open protocol that connects compatible clients and independently run homeservers.</p></article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Your community</p><h2 className="mt-2 text-xl font-semibold text-white">CK Conflux</h2><p className="mt-2 text-sm leading-6 text-slate-300">A community-operated homeserver where your account lives and local rooms are hosted.</p></article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-xs font-semibold uppercase tracking-widest text-slate-400">The app</p><h2 className="mt-2 text-xl font-semibold text-white">Element</h2><p className="mt-2 text-sm leading-6 text-slate-300">The recommended web and desktop client. On iOS and Android, we recommend Element X.</p></article>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">One portable identity</p><h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Your Matrix ID</h2><p className="mt-3 leading-7 text-slate-300">A Matrix ID, or MXID, looks like <code className="rounded bg-slate-900 px-2 py-1 text-cyan-200">@name:ckconflux.com</code>. It identifies you across Matrix, including when you join federated rooms or talk with people on other homeservers.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">{concepts.map(([title, copy]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><h3 className="font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p></article>)}</div>
      </div>
    </section>

    <section className="border-y border-white/10 bg-white/[0.025]"><div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
      <div><h2 className="text-2xl font-semibold text-white">Not a CK Conflux-only silo</h2><p className="mt-3 leading-7 text-slate-300">Because Matrix is federated, your CK Conflux account can participate in compatible rooms across the wider Matrix network when those rooms and homeservers allow it. You can also choose from multiple compatible Matrix clients rather than being confined to one app.</p><a href="https://matrix.org/ecosystem/clients/" className="mt-4 inline-flex font-semibold text-cyan-200 underline">Browse Matrix clients</a></div>
      <div><h2 className="text-2xl font-semibold text-white">Everything around the room</h2><p className="mt-3 leading-7 text-slate-300">Chat, share files and media, and use end-to-end encrypted rooms where supported and configured. When it is time to talk, a Matrix room can open Element Call for voice, video, and screen sharing.</p><Link to="/calls" className="mt-4 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Explore Element Call</Link></div>
    </div></section>

    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><div className="rounded-2xl border border-white/10 bg-white/5 p-6"><h2 className="text-2xl font-semibold text-white">Need security, recovery, or setup help?</h2><p className="mt-2 text-sm leading-6 text-slate-300">Review the precise security boundaries, or visit the help center for account recovery and everyday guidance.</p><div className="mt-4 flex flex-wrap gap-3"><Link to="/security" className="rounded-xl border border-white/15 px-4 py-2 font-semibold text-white">Security & recovery</Link><Link to="/help" className="rounded-xl border border-white/15 px-4 py-2 font-semibold text-white">Help center</Link></div></div></section>
  </>;
}
