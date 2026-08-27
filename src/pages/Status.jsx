import { ExternalLink } from '../components/SiteLink';
import { INDEPENDENT_STATUS_URL, stateLabel } from '../status/status';
import { useLocalStatus } from '../status/useLocalStatus';

export default function Status() {
  const status = useLocalStatus();
  const unknown = status.phase === 'error';
  const generatedDate = status.generatedAt ? new Date(status.generatedAt) : null;
  const generatedLabel = generatedDate && !Number.isNaN(generatedDate.getTime()) ? generatedDate.toLocaleString() : String(status.generatedAt ?? '');
  return <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
    <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Availability</p><h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Service status</h1><p className="mt-4 leading-7 text-slate-300">Current health reported from inside the CK Conflux platform.</p></header>
    <section className="mt-8 rounded-2xl border border-cyan-300/20 bg-cyan-400/5 p-6" aria-labelledby="independent-status"><h2 id="independent-status" className="text-xl font-semibold text-white">Can’t reach CK Conflux?</h2><p className="mt-2 max-w-3xl leading-7 text-slate-300">Our independent, out-of-band status page is hosted separately and remains the place to check when CK Conflux itself is unreachable.</p><ExternalLink href={INDEPENDENT_STATUS_URL} className="mt-5 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Open independent status page</ExternalLink></section>
    <section className="mt-8" aria-labelledby="local-status"><h2 id="local-status" className="text-2xl font-semibold text-white">In-platform health</h2>
      {status.phase === 'loading' && <div className="mt-4 min-h-28 rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-300" role="status">Checking local status…</div>}
      {unknown && <div className="mt-4 min-h-28 rounded-2xl border border-amber-300/30 bg-amber-400/5 p-5"><h3 className="font-semibold text-amber-100">Local status unavailable / unknown</h3><p className="mt-2 text-sm leading-6 text-slate-300">The in-platform status response failed, timed out, was malformed, or did not contain recognized component data. Check the independent status page above.</p></div>}
      {status.phase === 'ready' && <><p className="mt-3 text-lg font-semibold text-white">Overall: {stateLabel(status.overall)}</p>{status.generatedAt && <p className="mt-1 text-sm text-slate-400">Status payload updated: <time dateTime={status.generatedAt}>{generatedLabel}</time></p>}<ul className="mt-4 grid gap-3 sm:grid-cols-2">{status.components.map((component) => <li key={component.name} className="flex min-h-16 items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"><span className="text-slate-200">{component.name}</span><strong className="text-white">{stateLabel(component.state)}</strong></li>)}</ul></>}
    </section>
  </div>;
}
