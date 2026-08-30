import { Link } from '../router/Router';
import { statusHeadline } from '../status/status';
import { useLocalStatus } from '../status/useLocalStatus';

function relativeUpdateLabel(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return null;
  const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return 'Updated just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Updated ${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  return `Updated ${hours} hour${hours === 1 ? '' : 's'} ago`;
}

export default function StatusSummary() {
  const status = useLocalStatus({ refreshIntervalMs: 60000 });
  const affected = status.components.filter(({ state }) => state === 'degraded' || state === 'unavailable');
  let message = status.phase === 'loading' ? 'Checking service status…' : status.phase === 'error' ? 'Status is temporarily unavailable' : statusHeadline(status.overall);
  if (affected.length === 1) message = `${affected[0].name} ${affected[0].state === 'degraded' ? 'is degraded' : 'is unavailable'}`;

  const messagingOperational = status.components.some(({ id, state }) => id === 'messaging' && state === 'operational');
  const signinOperational = status.components.some(({ id, state }) => id === 'signin' && state === 'operational');
  const supporting = status.phase === 'ready' && affected.length === 1
    ? (affected[0].id === 'calls' && messagingOperational && signinOperational
      ? 'Messaging and sign-in remain operational.'
      : 'Other services may remain operational; view details for the full status.')
    : status.phase === 'ready' && affected.length > 1 ? `${affected.length} services are affected.` : null;
  const freshness = status.phase === 'ready' && !supporting
    ? relativeUpdateLabel(status.generatedAt || status.checkedAt)
    : null;

  return <div className="min-h-24 rounded-2xl border border-white/10 bg-white/5 p-5">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Live service status</p>
    <p className="mt-2 text-lg font-semibold text-white" aria-live="polite">{message}</p>
    {supporting && <p className="mt-1 text-sm text-slate-300">{supporting}</p>}
    {freshness && <p className="mt-1 text-sm text-slate-400">{freshness}</p>}
    <Link to="/status" className="mt-3 inline-flex text-sm font-semibold text-cyan-200 hover:text-cyan-100">View details →</Link>
  </div>;
}