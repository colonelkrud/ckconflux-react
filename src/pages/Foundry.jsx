import { Coffee, Dice5 } from 'lucide-react';
import FoundryServerCard from '../components/FoundryServerCard';
import { ExternalLink } from '../components/SiteLink';
import { FOUNDRY_SERVERS } from '../config/foundry';
import { SUPPORTER_URL } from '../config/community';
import { useFoundryStatus } from '../foundry/useFoundryStatus';

export default function Foundry() {
  const statuses = useFoundryStatus();
  return <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200"><Dice5 size={18} aria-hidden="true" /> Community tabletop</div>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Foundry VTT</h1>
      <p className="mt-5 text-lg leading-8 text-slate-300">Choose a CK Conflux Foundry Virtual Tabletop server for your weekly game. Live health is advisory, so you can always attempt to connect.</p>
    </div>

    <div className="mt-10 grid gap-6 md:grid-cols-2">
      {FOUNDRY_SERVERS.map((server) => <FoundryServerCard key={server.id} server={server} status={statuses[server.id]} />)}
    </div>

    <aside className="mt-12 flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8" aria-labelledby="foundry-support-heading">
      <div className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Community-supported infrastructure</p><h2 id="foundry-support-heading" className="mt-2 text-2xl font-semibold text-white">Help keep the tables running</h2><p className="mt-2 text-sm leading-6 text-slate-300">CK Conflux infrastructure is supported by the community. Support is always voluntary, and payment is not required to use either Foundry server.</p></div>
      <ExternalLink href={SUPPORTER_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 font-semibold text-cyan-100 hover:bg-cyan-300/15 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"><Coffee size={18} aria-hidden="true" />Buy Me a Coffee</ExternalLink>
    </aside>
  </section>;
}
