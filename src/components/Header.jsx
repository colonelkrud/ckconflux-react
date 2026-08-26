import { ExternalLink, SiteLink } from './SiteLink';
import MobileNavigation from './MobileNavigation';

const primaryLinks = [
  { label: 'Why CK Conflux', to: '/why-ck-conflux' }, { label: 'Matrix', to: '/matrix' },
  { label: 'Calls', to: '/calls' }, { label: 'Help', to: '/help' },
];
export default function Header() {
  return <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur">
    <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
      <SiteLink to="/" className="mr-auto text-base font-semibold tracking-tight text-white sm:text-lg">CK Conflux</SiteLink>
      <nav aria-label="Primary navigation" className="hidden items-center gap-4 text-sm text-slate-300 lg:flex">
        {primaryLinks.map((link) => <SiteLink key={link.to} to={link.to} className="rounded transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">{link.label}</SiteLink>)}
      </nav>
      <ExternalLink href="https://account.ckconflux.com" className="hidden rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 lg:inline-flex">My Account</ExternalLink>
      <ExternalLink href="https://element.ckconflux.com" className="rounded-xl bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition motion-safe:hover:-translate-y-0.5">Open Element</ExternalLink>
      <MobileNavigation links={[...primaryLinks, { label: 'My Account', to: 'https://account.ckconflux.com', external: true }]} />
    </div>
  </header>;
}
