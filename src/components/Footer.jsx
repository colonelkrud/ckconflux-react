import { SiteLink } from './SiteLink';
const groups = [
  ['Explore', [['Membership','/membership'],['Security','/security'],['Status','/status']]],
  ['Community', [['Help','/help'],['Support','/support'],['TeamSpeak 6 Beta','/teamspeak']]],
  ['Legal', [['Privacy','/privacy'],['Terms','/terms'],['Rules','/rules']]],
];
export default function Footer() {
  return <footer className="border-t border-white/10 bg-slate-950/70">
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:px-8">
      <p className="text-sm text-slate-400">CK Conflux community platform</p>
      {groups.map(([heading, links]) => <nav key={heading} aria-label={`${heading} links`}><h2 className="text-sm font-semibold text-white">{heading}</h2><ul className="mt-2 space-y-2 text-sm text-slate-400">{links.map(([label,to]) => <li key={to}><SiteLink to={to} className="hover:text-white">{label}</SiteLink></li>)}</ul></nav>)}
    </div>
  </footer>;
}
