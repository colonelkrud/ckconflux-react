import { ExternalLink } from '../components/SiteLink';
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
const ICONS = { operational: '✓', degraded: '!', unavailable: '×', unknown: '?' };
const STATE_STYLE = {
  operational: 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100',
  degraded: 'border-amber-300/40 bg-amber-400/10 text-amber-100',
  unavailable: 'border-rose-300/40 bg-rose-400/10 text-rose-100',
  unknown: 'border-slate-300/30 bg-slate-400/10 text-slate-100',
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

export default function Status() {
  const status = useLocalStatus({ refreshIntervalMs: 60000 });
  const error = status.phase === 'error';
  const snapshotMissing = status.phase === 'ready' && status.noSnapshot;
  const hasUnknownComponent = status.components.some(({ state }) => state === 'unknown');
  const websiteOperational = status.components.some(({ id, state }) => id === 'website' && state === 'operational');
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
        ? 'Several CK Conflux services are currently unavailable. The website remains available.'
        : status.overall === 'unknown' && !hasUnknownComponent
        ? 'Status information is incomplete; the status feed did not confirm a complete platform state.'
        : DETAILS[status.overall];
  const statusStyle = status.stale ? STATE_STYLE.degraded : STATE_STYLE[status.overall];
  const statusIcon = status.stale ? '!' : ICONS[status.overall];
  const staleNotice = snapshotMissing
    ? 'A status snapshot is not available yet.'
    : 'Showing the last reported service status.';

  return <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
    <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Availability</p><h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Service status</h1><p className="mt-4 leading-7 text-slate-300">Current user-facing health reported by CK Conflux.</p></header>

    <section className="mt-8" aria-labelledby="overall-status">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="overall-status" className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Overall CK Conflux status</h2><button type="button" onClick={status.refresh} disabled={status.isRefreshing} className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-cyan-200 disabled:cursor-wait disabled:opacity-60">{status.isRefreshing ? 'Refreshing…' : 'Refresh'}</button></div>
      {status.phase === 'loading' && <div className="mt-4 min-h-32 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300" role="status">Checking CK Conflux service health…</div>}
      {error && <div className="mt-4 rounded-2xl border border-amber-300/40 bg-amber-400/10 p-6" role="alert"><div className="flex items-start gap-4"><span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-200 font-bold text-amber-100">!</span><div><h3 className="text-xl font-semibold text-white">Status information unavailable</h3><p className="mt-2 leading-7 text-slate-200">We couldn't load the current service status.</p><button type="button" onClick={status.refresh} className="mt-4 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-cyan-200">Retry</button></div></div></div>}
      {status.phase === 'ready' && <div className={`mt-4 rounded-2xl border p-6 ${statusStyle}`}><div className="flex items-start gap-4"><span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-current text-xl font-bold">{statusIcon}</span><div><h3 className="text-2xl font-semibold text-white" aria-live="polite" aria-atomic="true">{headline}</h3><p className="mt-2 leading-7 text-slate-200">{detail}</p><div className="mt-3"><Freshness status={status} /></div>{status.stale && <p className="mt-3 font-semibold text-amber-100" role="status">{staleNotice}</p>}{status.refreshError && <p className="mt-3 font-semibold text-amber-100" role="status">Unable to refresh status. Showing the last known update.</p>}{status.isRefreshing && <p className="mt-3 text-sm text-slate-300" role="status">Refreshing status…</p>}</div></div></div>}
    </section>

    {status.phase === 'ready' && status.components.length > 0 && <section className="mt-10" aria-labelledby="services-status"><h2 id="services-status" className="text-2xl font-semibold text-white">Services</h2><p className="mt-2 text-slate-300">Health is grouped by the CK Conflux features people use.</p><ul className="mt-5 grid gap-3 sm:grid-cols-2">{status.components.map((component) => {
      const affected = component.state === 'degraded' || component.state === 'unavailable';
      return <li key={component.id} className={`rounded-xl border p-4 ${affected ? STATE_STYLE[component.state] : 'border-white/10 bg-white/5'}`}><div className="flex items-center justify-between gap-4"><span className="font-medium text-white">{component.name}</span><strong className="flex items-center gap-2 text-sm text-white"><span aria-hidden="true">{ICONS[component.state]}</span>{stateLabel(component.state)}</strong></div>{affected && <p className="mt-3 text-sm leading-6 text-slate-200">{IMPACT[component.id] || 'This service may not work normally.'}</p>}</li>;
    })}</ul></section>}

    <div className="mt-10 border-t border-white/10 pt-6"><ExternalLink href={INDEPENDENT_STATUS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex text-sm font-semibold text-cyan-200 hover:text-cyan-100">View uptime history ↗ <span className="sr-only">(opens in a new tab)</span></ExternalLink></div>
  </div>;
}
