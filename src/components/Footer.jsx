import { ExternalLink, SiteLink } from './SiteLink';
import { ACCOUNT_PORTAL_URL } from '../config/community';
import { INDEPENDENT_STATUS_BADGE_LINK, INDEPENDENT_STATUS_BADGE_URL } from '../status/status';
const groups = [
  ['Explore', [['About','/about'],['Join','/join'],['Membership','/membership'],['My Account',ACCOUNT_PORTAL_URL, true],['Security','/security'],['Status','/status']]],
  ['Community', [['Help','/help'],['Support','/support'],['TeamSpeak 6 Beta','/teamspeak']]],
  ['Legal', [['Privacy','/privacy'],['Terms','/terms'],['Rules','/rules']]],
];
export default function Footer() {
  return <footer className="border-t border-white/10 bg-slate-950/70">
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-slate-400">CK Conflux community platform</p>
        <ExternalLink href={INDEPENDENT_STATUS_BADGE_LINK} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block">
          <img src={INDEPENDENT_STATUS_BADGE_URL} alt="CK Conflux service status" className="h-auto max-w-full" />
        </ExternalLink>
      </div>
      {groups.map(([heading, links]) => <nav key={heading} aria-label={`${heading} links`}><h2 className="text-sm font-semibold text-white">{heading}</h2><ul className="mt-2 space-y-2 text-sm text-slate-400">{links.map(([label,to,external]) => <li key={to}>{external ? <ExternalLink href={to} className="hover:text-white">{label}</ExternalLink> : <SiteLink to={to} className="hover:text-white">{label}</SiteLink>}</li>)}</ul></nav>)}
    </div>
  </footer>;
}
