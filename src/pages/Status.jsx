import { motion as Motion } from 'framer-motion';
import { Clock3, RefreshCw } from 'lucide-react';
import { ExternalLink } from '../components/SiteLink';
import {
  StatusAmbientGlow,
  STATUS_STATE_META,
  StatusStateSignal,
} from '../components/StatusStateVisual';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import {
  INDEPENDENT_STATUS_URL,
  serviceImpact,
  stateLabel,
  statusHeadline,
} from '../status/status';
import { useLocalStatus } from '../status/useLocalStatus';

const DETAILS = {
  operational: 'All reported services are healthy.',
  degraded: 'CK Conflux is available, but one or more services may not work normally.',
  unavailable: 'One or more CK Conflux services are currently unavailable.',
  unknown: 'Some service checks returned an unknown state.',
};

function relativeTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return null;
  const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return 'Updated just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Updated ${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  return `Updated ${hours} hour${hours === 1 ? '' : 's'} ago`;
}

function Freshness({ status }) {
  const timestamp = status.generatedAt || (!status.stale ? status.checkedAt : null);
  const date = timestamp ? new Date(timestamp) : null;
  const valid = date && !Number.isNaN(date.getTime());
  if (!valid) return null;
  return <p className="text-sm text-slate-300">
    <time dateTime={timestamp} title={date.toLocaleString()}>{relativeTime(timestamp)}</time>
    {!status.generatedAt && <span className="text-slate-400"> (last checked)</span>}
  </p>;
}

function StateCount({ state, count }) {
  if (!count) return null;
  const meta = STATUS_STATE_META[state] ?? STATUS_STATE_META.unknown;
  return <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${meta.pill}`}>
    <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${meta.bar}`} />
    {count} {stateLabel(state).toLowerCase()}
  </span>;
}

function MaintenanceNotice() {
  return <section className="mt-10 rounded-2xl border border-cyan-200/20 bg-white/[0.04] p-5 sm:p-6" aria-labelledby="maintenance-window">
    <div className="flex items-start gap-4">
      <div className="rounded-xl border border-cyan-200/20 bg-cyan-300/[0.07] p-2.5 text-cyan-200">
        <Clock3 aria-hidden="true" size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <h2 id="maintenance-window" className="text-xl font-semibold text-white">Daily maintenance window</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Window start</dt><dd className="mt-1 font-semibold text-cyan-100">6:00 AM UTC</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Window duration</dt><dd className="mt-1 font-semibold text-cyan-100">4 hours</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Frequency</dt><dd className="mt-1 font-semibold text-cyan-100">Daily</dd></div>
        </dl>
        <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm leading-6 text-slate-300 sm:text-base">
          <p>Maintenance usually lasts under 10 minutes, and most applications do not experience any downtime.</p>
          <p>Some real-time services, such as voice calling and screen sharing, may disconnect briefly while you are moved to another server.</p>
        </div>
      </div>
    </div>
  </section>;
}

export default function Status() {
  const status = useLocalStatus({ refreshIntervalMs: 60000 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const error = status.phase === 'error';
  const snapshotMissing = status.phase === 'ready' && status.noSnapshot;
  const affectedCount = status.components.filter(({ state }) => state === 'degraded' || state === 'unavailable').length;
  const hasUnknownComponent = status.components.some(({ state }) => state === 'unknown');
  const webOperational = status.components.some(({ id, state }) => id === 'website' && state === 'operational');
  const stateCounts = status.components.reduce((counts, component) => {
    counts[component.state] = (counts[component.state] ?? 0) + 1;
    return counts;
  }, { operational: 0, degraded: 0, unavailable: 0, unknown: 0 });
  const headline = snapshotMissing
    ? 'Status information unavailable'
    : status.stale
      ? 'Status information may be out of date'
      : statusHeadline(status.overall);
  const detail = snapshotMissing
    ? 'Current service status is not available yet.'
    : status.stale
      ? `Showing the last reported service status. Last reported state: ${statusHeadline(status.overall)}.`
      : status.overall === 'unavailable' && webOperational
        ? affectedCount > 1
          ? `${affectedCount} CK Conflux services are currently affected. Web services remain available.`
          : 'One or more CK Conflux services are currently unavailable. Web services remain available.'
        : status.overall === 'unknown' && !hasUnknownComponent
          ? 'Status information is incomplete; the status feed did not confirm a complete platform state.'
          : DETAILS[status.overall];
  const displayState = status.stale ? 'degraded' : status.overall;
  const statusMeta = STATUS_STATE_META[displayState] ?? STATUS_STATE_META.unknown;
  const staleNotice = snapshotMissing
    ? 'A status snapshot is not available yet.'
    : 'Showing the last reported service status.';
  const entrance = prefersReducedMotion
    ? {}
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: 'easeOut' } };

  return <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
    <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Availability</p><h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Service status</h1><p className="mt-4 leading-7 text-slate-300">Current user-facing health reported by CK Conflux.</p></header>

    <section className="mt-8" aria-labelledby="overall-status">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="overall-status" className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Overall CK Conflux status</h2><button type="button" onClick={status.refresh} disabled={status.isRefreshing} className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-200 hover:bg-cyan-300/[0.05] disabled:cursor-wait disabled:opacity-60"><RefreshCw aria-hidden="true" size={16} className={status.isRefreshing ? 'animate-spin' : ''} />{status.isRefreshing ? 'Refreshing…' : 'Refresh'}</button></div>
      {status.phase === 'loading' && <div className="mt-4 min-h-32 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300" role="status">Checking CK Conflux service health…</div>}
      {error && <div className="mt-4 rounded-2xl border border-amber-300/40 bg-amber-400/10 p-6" role="alert"><div className="flex items-start gap-4"><StatusStateSignal state="degraded" large reducedMotion={prefersReducedMotion} /><div><h3 className="text-xl font-semibold text-white">Status information unavailable</h3><p className="mt-2 leading-7 text-slate-200">We couldn't load the current service status.</p><button type="button" onClick={status.refresh} className="mt-4 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-cyan-200">Retry</button></div></div></div>}
      {status.phase === 'ready' && <Motion.div {...entrance} className={`relative mt-4 overflow-hidden rounded-2xl border p-5 sm:p-6 ${statusMeta.card}`}>
        <StatusAmbientGlow state={displayState} reducedMotion={prefersReducedMotion} className="-right-16 -top-24 h-56 w-56" />
        <div className="relative flex items-start gap-4"><StatusStateSignal state={displayState} large reducedMotion={prefersReducedMotion} /><div><h3 className="text-2xl font-semibold text-white" aria-live="polite" aria-atomic="true">{headline}</h3><p className="mt-2 max-w-3xl leading-7 text-slate-200">{detail}</p><div className="mt-3"><Freshness status={status} /></div>{status.stale && <p className="mt-3 font-semibold text-amber-100" role="status">{staleNotice}</p>}{status.refreshError && <p className="mt-3 font-semibold text-amber-100" role="status">Unable to refresh status. Showing the last known update.</p>}{status.isRefreshing && <p className="mt-3 text-sm text-slate-300" role="status">Refreshing status…</p>}</div></div>
      </Motion.div>}
    </section>

    {status.phase === 'ready' && status.components.length > 0 && <section className="mt-10" aria-labelledby="services-status">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="services-status" className="text-2xl font-semibold text-white">Services</h2><p className="mt-2 text-slate-300">Health is grouped by the CK Conflux features people use.</p></div><div className="flex flex-wrap gap-2" aria-label="Service state summary"><StateCount state="operational" count={stateCounts.operational} /><StateCount state="degraded" count={stateCounts.degraded} /><StateCount state="unavailable" count={stateCounts.unavailable} /><StateCount state="unknown" count={stateCounts.unknown} /></div></div>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{status.components.map((component, index) => {
        const affected = component.state === 'degraded' || component.state === 'unavailable';
        const meta = STATUS_STATE_META[component.state] ?? STATUS_STATE_META.unknown;
        const itemEntrance = prefersReducedMotion
          ? {}
          : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: Math.min(index * 0.055, 0.3), ease: 'easeOut' } };
        return <Motion.li {...itemEntrance} key={component.id} data-state={component.state} className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 ${meta.card}`}>
          <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 ${meta.bar}`} />
          <div className="flex items-center justify-between gap-4"><span className="font-medium text-white">{component.name}</span><strong className="flex items-center gap-2 text-sm"><StatusStateSignal state={component.state} reducedMotion={prefersReducedMotion} />{stateLabel(component.state)}</strong></div>{affected && <p className="mt-3 text-sm leading-6 text-slate-200">{serviceImpact(component, status)}</p>}
        </Motion.li>;
      })}</ul>
    </section>}

    <MaintenanceNotice />

    <div className="mt-10 border-t border-white/10 pt-6"><ExternalLink href={INDEPENDENT_STATUS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex text-sm font-semibold text-cyan-200 hover:text-cyan-100">View uptime history ↗ <span className="sr-only">(opens in a new tab)</span></ExternalLink></div>
  </div>;
}
