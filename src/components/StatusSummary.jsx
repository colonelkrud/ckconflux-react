import { Link } from '../router/Router';
import { statusHeadline } from '../status/status';
import { useLocalStatus } from '../status/useLocalStatus';

export default function StatusSummary() {
  const status = useLocalStatus();
  const affected = status.components.filter(({ state }) => state === 'degraded' || state === 'unavailable');
  let message = status.phase === 'loading' ? 'Checking service status…' : status.phase === 'error' ? 'Status is temporarily unavailable' : statusHeadline(status.overall);
  if (affected.length === 1) message = `${affected[0].name} ${affected[0].state === 'degraded' ? 'is degraded' : 'is unavailable'}`;
  const supporting = status.phase === 'ready' && affected.length === 1
    ? (affected[0].id === 'calls' ? 'Messaging and sign-in remain operational.' : 'Other services may remain operational; view details for the full status.')
    : status.phase === 'ready' && affected.length > 1 ? `${affected.length} services are affected.` : null;
  return <div className="min-h-24 rounded-2xl border border-white/10 bg-white/5 p-5">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Live service status</p>
    <p className="mt-2 text-lg font-semibold text-white" aria-live="polite">{message}</p>
    {supporting && <p className="mt-1 text-sm text-slate-300">{supporting}</p>}
    {status.phase === 'ready' && !supporting && <p className="mt-1 text-sm text-slate-400">Updated recently</p>}
    <Link to="/status" className="mt-3 inline-flex text-sm font-semibold text-cyan-200 hover:text-cyan-100">View details →</Link>
  </div>;
}
