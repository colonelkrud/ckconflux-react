import { useEffect, useState } from 'react';
import { ExternalLink, SiteLink } from './SiteLink';
import MobileNavigation from './MobileNavigation';
import { StatusStateSignal } from './StatusStateVisual';
import { ACCOUNT_PORTAL_URL, ELEMENT_URL } from '../config/community';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { stateLabel } from '../status/status';
import { useLocalStatus } from '../status/useLocalStatus';

const primaryLinks = [
  { label: 'Why CK Conflux', to: '/why-ck-conflux' }, { label: 'Matrix', to: '/matrix' },
  { label: 'Calls', to: '/calls' }, { label: 'Membership', to: '/membership' }, { label: 'Help', to: '/help' },
];

function affectedSummary(components) {
  if (!components.length) return 'Some CK Conflux services are affected.';
  if (components.length === 1) {
    const [component] = components;
    return `${component.name} is ${stateLabel(component.state).toLowerCase()}.`;
  }
  if (components.length === 2) return `${components[0].name} and ${components[1].name} are affected.`;
  return `${components[0].name}, ${components[1].name}, and ${components.length - 2} more service${components.length === 3 ? '' : 's'} are affected.`;
}

function IncidentStatusBanner() {
  const status = useLocalStatus({ refreshIntervalMs: 60000 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const affected = status.components.filter(({ state }) => state === 'degraded' || state === 'unavailable');
  const incidentState = status.overall === 'unavailable' ? 'unavailable' : 'degraded';
  const showIncident = status.phase === 'ready'
    && !status.stale
    && !status.noSnapshot
    && (status.overall === 'degraded' || status.overall === 'unavailable');
  const incidentClass = incidentState === 'unavailable'
    ? 'border-rose-300/35 bg-rose-400/10 text-rose-50'
    : 'border-amber-300/35 bg-amber-400/10 text-amber-50';

  if (!showIncident) return null;

  return <div className={`border-t ${incidentClass}`} role="alert" aria-live="assertive">
    <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
      <StatusStateSignal state={incidentState} reducedMotion={prefersReducedMotion} />
      <p className="min-w-0 flex-1 text-sm leading-5">
        <strong className="font-semibold">{incidentState === 'unavailable' ? 'Service outage detected.' : 'Service disruption detected.'}</strong>{' '}
        <span className="text-slate-100">{affectedSummary(affected)}</span>
      </p>
      <SiteLink to="/status" className="shrink-0 rounded-lg border border-white/15 bg-slate-950/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10 sm:text-sm">View status</SiteLink>
    </div>
  </div>;
}

export default function Header() {
  const [monitorStatus, setMonitorStatus] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMonitorStatus(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  return <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur">
    <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
      <SiteLink to="/" className="mr-auto text-base font-semibold tracking-tight text-white sm:text-lg">CK Conflux</SiteLink>
      <nav aria-label="Primary navigation" className="hidden items-center gap-4 text-sm text-slate-300 lg:flex">
        {primaryLinks.map((link) => <SiteLink key={link.to} to={link.to} className="rounded transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">{link.label}</SiteLink>)}
      </nav>
      <ExternalLink href={ACCOUNT_PORTAL_URL} className="hidden rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 lg:inline-flex">My Account</ExternalLink>
      <ExternalLink href={ELEMENT_URL} className="hidden rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 sm:inline-flex">Open Element</ExternalLink>
      <SiteLink to="/join" className="hidden rounded-xl bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition motion-safe:hover:-translate-y-0.5 lg:inline-flex">Join CK Conflux</SiteLink>
      <MobileNavigation links={[{ label: 'Join CK Conflux', to: '/join' }, ...primaryLinks, { label: 'Open Element', to: ELEMENT_URL, external: true }, { label: 'My Account', to: ACCOUNT_PORTAL_URL, external: true }]} />
    </div>
    {monitorStatus && <IncidentStatusBanner />}
  </header>;
}
