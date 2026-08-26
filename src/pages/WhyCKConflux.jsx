import { Link } from '../router/Router';

const commitments = [
  ['No sale of personal information', 'CK Conflux does not sell user personal information.'],
  ['No private-content AI training', 'CK Conflux does not use users’ private conversations or content to train AI models.'],
  ['No community-service advertising', 'CK Conflux does not display advertising on its community services.'],
];

export default function WhyCKConfluxPage() {
  return <>
    <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,.16),transparent_45%)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Why CK Conflux</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">Why CK Conflux</h1><p className="mt-3 max-w-3xl text-2xl font-semibold text-slate-100">Communication run for a community, not an advertising platform</p>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">CK Conflux is a community-operated Matrix homeserver and community. Your account has a home here, while Matrix federation lets compatible communities communicate without placing everyone inside one provider’s closed silo.</p>
      </div>
    </section>
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="text-xl font-semibold text-white">A federated network</h2><p className="mt-3 leading-7 text-slate-300">People on CK Conflux can participate across federated Matrix servers, subject to each room’s and server’s policies. Federation expands who you can reach; it also means other participating servers have their own operators and practices.</p></article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="text-xl font-semibold text-white">Community operated</h2><p className="mt-3 leading-7 text-slate-300">The service is operated for its community rather than around advertising or monetizing user data. Core communication remains free.</p></article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="text-xl font-semibold text-white">Voluntarily supported</h2><p className="mt-3 leading-7 text-slate-300">Voluntary support primarily pays infrastructure costs and provides additional persistent capacity. Supporting is not required for core communication.</p></article>
      </div>
      <section className="mt-10 rounded-2xl border border-cyan-300/25 bg-cyan-400/10 p-6"><h2 className="text-2xl font-semibold text-white">Our narrow commitments</h2><div className="mt-4 grid gap-4 md:grid-cols-3">{commitments.map(([title, copy]) => <article key={title}><h3 className="font-semibold text-cyan-100">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-200">{copy}</p></article>)}</div></section>
      <aside className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-5"><h2 className="text-lg font-semibold text-white">Privacy does not mean no metadata</h2><p className="mt-2 leading-7 text-slate-300">Operating accounts, securing access, delivering messages, and federating rooms requires some account, connection, and room metadata. End-to-end encryption protects message content where enabled, but does not make all metadata disappear. Read the service-specific boundaries before deciding what to share.</p></aside>
      <nav aria-label="Learn more" className="mt-8 flex flex-wrap gap-3">{[['How Matrix works','/matrix'],['Security model','/security'],['Privacy model','/privacy'],['Membership','/membership']].map(([label,to]) => <Link key={to} to={to} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-white hover:bg-white/10">{label}</Link>)}</nav>
    </section>
  </>;
}
