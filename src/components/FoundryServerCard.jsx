import { CalendarDays, ExternalLink as ExternalLinkIcon, Server } from 'lucide-react';
import { ExternalLink } from './SiteLink';
import { FOUNDRY_STATUS } from '../foundry/foundryStatus';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const statusStyles = {
  checking: 'border-slate-400/30 bg-slate-400/10 text-slate-200',
  online: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200',
  offline: 'border-rose-300/30 bg-rose-300/10 text-rose-200',
  unknown: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
};

export default function FoundryServerCard({ server, status = 'unknown' }) {
  const statusCopy = FOUNDRY_STATUS[status] ?? FOUNDRY_STATUS.unknown;
  const prefersReducedMotion = usePrefersReducedMotion();
  const checkingMotion = status === 'checking' && !prefersReducedMotion ? 'animate-pulse' : '';
  return <article className="group flex h-full flex-col rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur sm:p-8">
    <div className="flex items-start justify-between gap-4">
      <span className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200" aria-hidden="true"><Server size={24} /></span>
      <div role="status" aria-live="polite" className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${statusStyles[status] ?? statusStyles.unknown}`}>
        <span className={`mr-2 inline-block ${checkingMotion}`} data-status-indicator={status} aria-hidden="true">●</span>{statusCopy.label}
      </div>
    </div>
    <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">{server.id}</p>
    <h2 className="mt-2 text-2xl font-semibold text-white">{server.name}</h2>
    <p className="mt-2 text-sm leading-6 text-slate-400">{statusCopy.description}</p>
    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <CalendarDays className="mt-0.5 shrink-0 text-cyan-200" size={20} aria-hidden="true" />
      <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Weekly schedule</p><p className="mt-1 font-semibold text-white">{server.schedule.day}</p><p className="text-sm text-slate-300">{server.schedule.time}</p></div>
    </div>
    <ExternalLink href={server.url} target="_blank" rel="noreferrer" aria-label={`Enter ${server.name} (opens in a new tab)`} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950">
      Enter Server <ExternalLinkIcon size={18} aria-hidden="true" />
    </ExternalLink>
  </article>;
}
