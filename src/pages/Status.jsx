import { motion as Motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, CircleHelp, RefreshCw, XCircle } from 'lucide-react';
import { ExternalLink } from '../components/SiteLink';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import {
  INDEPENDENT_STATUS_URL,
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
const IMPACT = {
  messaging: 'Sending or receiving messages may be delayed or fail.',
  signin: 'Signing in or creating an account may fail.',
  calls: 'Calls may fail to connect or may be disrupted.',
  media: 'Uploading or retrieving files and images may fail.',
  account: 'My Account or membership-related workflows may be unavailable.',
  website: 'CK Conflux public web pages may be partially unavailable.',
};
const STATE_META = {
  operational: {
    card: 'border-emerald-300/35 bg-emerald-400/[0.09] text-emerald-100 shadow-[0_18px_60px_-34px_rgba(52,211,153,0.55)]',
    icon: 'border-emerald-300/45 bg-emerald-300/10 text-emerald-100',
    ring: 'bg-emerald-300/25',
    bar: 'bg-emerald-300',
    glow: 'bg-emerald-400/20',
    pill: 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100',
  },
  degraded: {
    card: 'border-amber-300/40 bg-amber-400/10 text-amber-100 shadow-[0_18px_60px_-34px_rgba(251,191,36,0.55)]',
    icon: 'border-amber-300/50 bg-amber-300/10 text-amber-100',
    ring: 'bg-amber-300/25',
    bar: 'bg-amber-300',
    glow: 'bg-amber-400/20',
    pill: 'border-amber-300/35 bg-amber-400/10 text-amber-100',
  },
  unavailable: {
    card: 'border-rose-300/40 bg-rose-400/10 text-rose-100 shadow-[0_18px_60px_-32px_rgba(251,113,133,0.65)]',
    icon: 'border-rose-300/50 bg-rose-300/10 text-rose-100',
    ring: 'bg-rose-300/30',
    bar: 'bg-rose-300',
    glow: 'bg-rose-400/25',
    pill: 'border-rose-300/35 bg-rose-400/10 text-rose-100',
  },
  unknown: {
    card: 'border-slate-300/30 bg-slate-400/10 text-slate-100',
    icon: 'border-slate-300/40 bg-slate-300/10 text-slate-100',
    ring: 'bg-slate-300/20',
    bar: 'bg-slate-300',
    glow: 'bg-slate-400/15',
    pill: 'border-slate-300/30 bg-slate-400/10 text-slate-100',
  },
};
const STATE_ICONS = {
  operational: CheckCircle2,
  degraded: AlertTriangle,
  unavailable: XCircle,
  unknown: CircleHelp,
};
const SIGNAL_MOTION = {
  operational: { scale: [1, 1.18, 1], opacity: [0.2, 0.04, 0.2], duration: 3.6 },
  degraded: { scale: [1, 1.22, 1], opacity: [0.24, 0.05, 0.24], duration: 2.4 },
  unavailable: { scale: [1, 1.3, 1], opacity: [0.32, 0.03, 0.32], duration: 1.55 },
  unknown: { scale: [1, 1.14, 1], opacity: [0.16, 0.04, 0.16], duration: 4.2 },
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

function StateSignal({ state, large = false, reducedMotion = false }) {
  const Icon = STATE_ICONS[state] ?? CircleHelp;
  const meta = STATE_META[state] ?? STATE_META.unknown;
  const signalMotion = SIGNAL_MOTION[state] ?? SIGNAL_MOTION.unknown;
  const size = large ? 'h-12 w-12' : 'h-9 w-9';
  const iconSize = large ? 24 : 18;

  return <span aria-hidden="true" className={`relative flex shrink-0 items-center justify-center ${size}`}>
    {reducedMotion
      ? <span className={`absolute inset-0 rounded-full ${meta.ring}`} />
      : <Motion.span
          className={`absolute inset-0 rounded-full ${meta.ring}`}
          animate={{ scale: signalMotion.scale, opacity: signalMotion.opacity }}
          transition={{ duration: signalMotion.duration, repeat: Infinity, ease: 'easeInOut' }}
        />}
    <span className={`relative flex h-full w-full items-center justify-center rounded-full border ${meta.icon}`}>
      <Icon size={iconSize} strokeWidth={2.1} />
    </span>
  </span>;
}

function StateCount({ state, count }) {
  if (!count) return null;
  const meta = STATE_META[state] ?? STATE_META.unknown;
  return <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${meta.pill}`}>
    <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${meta.bar}`} />
    {count} {stateLabel(state).toLowerCase()}
  </span>;
}

export default function Status() {
  const status = useLocalStatus({ refreshIntervalMs: 60000 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const error = status.phase === 'error';
  const snapshotMissing = status.phase === 'ready' && status.noSnapshot;
  const affectedCount = status.components.filter(({ state }) => state === 'degraded' || state === 'unavailable').length;
  const hasUnknownComponent = status.components.some(({ state }) => state === 'unknown');
  const websiteOperational = status.components.some(({ id, state }) => id === 'website' && state === 'operational');
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
      : status.overall === 'unavailable' && websiteOperational
        ? affectedCount > 1
          ? `${affectedCount} CK Conflux services are currently affected. The website remains available.`
          : 'One or more CK Conflux services are currently unavailable. The website remains available.'
        : status.overall === 'unknown' && !hasUnknownComponent
        ? 'Status information is incomplete; the status feed did not confirm a complete platform state.'
        : DETAILS[status.overall];
  const displayState = status.stale ? 'degraded' : status.overall;
  const statusMeta = STATE_META[displayState] ?? STATE_META.unknown;
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
      {error && <div className="mt-4 rounded-2xl border border-amber-300/40 bg-amber-400/10 p-6" role="alert"><div className="flex items-start gap-4"><StateSignal state="degraded" large reducedMotion={prefersReducedMotion} /><div><h3 className="text-xl font-semibold text-white">Status information unavailable</h3><p className="mt-2 leading-7 text-slate-200">We couldn't load the current service status.</p><button type="button" onClick={status.refresh} className="mt-4 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-cyan-200">Retry</button></div></div></div>}
      {status.phase === 'ready' && <Motion.div {...entrance} className={`relative mt-4 overflow-hidden rounded-2xl border p-5 sm:p-6 ${statusMeta.card}`}>
        {prefersReducedMotion
          ? <span aria-hidden="true" className={`pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full blur-3xl ${statusMeta.glow}`} />
          : <Motion.span aria-hidden="true" className={`pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full blur-3xl ${statusMeta.glow}`} animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.75, 0.45] }} transition={{ duration: displayState === 'unavailable' ? 2.4 : 4.8, repeat: Infinity, ease: 'easeInOut' }} />}
        <div className="relative flex items-start gap-4"><StateSignal state={displayState} large reducedMotion={prefersReducedMotion} /><div><h3 className="text-2xl font-semibold text-white" aria-live="polite" aria-atomic="true">{headline}</h3><p className="mt-2 max-w-3xl leading-7 text-slate-200">{detail}</p><div className="mt-3"><Freshness status={status} /></div>{status.stale && <p className="mt-3 font-semibold text-amber-100" role="status">{staleNotice}</p>}{status.refreshError && <p className="mt-3 font-semibold text-amber-100" role="status">Unable to refresh status. Showing the last known update.</p>}{status.isRefreshing && <p className="mt-3 text-sm text-slate-300" role="status">Refreshing status…</p>}</div></div>
      </Motion.div>}
    </section>

    {status.phase === 'ready' && status.components.length > 0 && <section className="mt-10" aria-labelledby="services-status">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="services-status" className="text-2xl font-semibold text-white">Services</h2><p className="mt-2 text-slate-300">Health is grouped by the CK Conflux features people use.</p></div><div className="flex flex-wrap gap-2" aria-label="Service state summary"><StateCount state="operational" count={stateCounts.operational} /><StateCount state="degraded" count={stateCounts.degraded} /><StateCount state="unavailable" count={stateCounts.unavailable} /><StateCount state="unknown" count={stateCounts.unknown} /></div></div>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{status.components.map((component, index) => {
        const affected = component.state === 'degraded' || component.state === 'unavailable';
        const meta = STATE_META[component.state] ?? STATE_META.unknown;
        const itemEntrance = prefersReducedMotion
          ? {}
          : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: Math.min(index * 0.055, 0.3), ease: 'easeOut' } };
        return <Motion.li {...itemEntrance} key={component.id} data-state={component.state} className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 ${meta.card}`}>
          <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 ${meta.bar}`} />
          <div className="flex items-center justify-between gap-4"><span className="font-medium text-white">{component.name}</span><strong className="flex items-center gap-2 text-sm"><StateSignal state={component.state} reducedMotion={prefersReducedMotion} />{stateLabel(component.state)}</strong></div>{affected && <p className="mt-3 text-sm leading-6 text-slate-200">{IMPACT[component.id] || 'This service may not work normally.'}</p>}
        </Motion.li>;
      })}</ul>
    </section>}

    <div className="mt-10 border-t border-white/10 pt-6"><ExternalLink href={INDEPENDENT_STATUS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex text-sm font-semibold text-cyan-200 hover:text-cyan-100">View uptime history ↗ <span className="sr-only">(opens in a new tab)</span></ExternalLink></div>
  </div>;
}
