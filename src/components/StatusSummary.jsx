import { Link } from '../router/Router';
import { stateLabel } from '../status/status';
import { useLocalStatus } from '../status/useLocalStatus';

export default function StatusSummary() {
  const status = useLocalStatus();
  const message = status.phase === 'loading' ? 'Checking service status…' : status.overall === 'operational' ? 'All systems operational' : status.overall === 'degraded' ? 'Some systems are degraded' : status.overall === 'unavailable' ? 'Some systems are unavailable' : 'Local status unavailable';
  return <div className="min-h-24 rounded-2xl border border-white/10 bg-white/5 p-5" aria-live="polite">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Live status</p>
    <p className="mt-2 text-lg font-semibold text-white">{message}</p>
    {status.phase !== 'loading' && <p className="mt-1 text-sm text-slate-400">State: {stateLabel(status.overall)}</p>}
    <Link to="/status" className="mt-3 inline-flex text-sm font-semibold text-cyan-200 hover:text-cyan-100">View service status →</Link>
  </div>;
}
