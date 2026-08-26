import { Database, Gauge, Globe2, HardDrive, Heart, Server, ShieldCheck, Wifi } from 'lucide-react';
import { createElement } from 'react';
import { ExternalLink, SiteLink } from '../components/SiteLink';
import { ACCOUNT_PORTAL_URL, COMMUNITY_MEDIA_QUOTA } from '../config/community';

const infrastructure = [
  [Server, 'Hosting & compute'],
  [Database, 'Databases'],
  [HardDrive, 'Media storage'],
  [Wifi, 'Bandwidth'],
  [Gauge, 'Monitoring'],
  [ShieldCheck, 'Backups & operations'],
  [Globe2, 'Domains & related infrastructure'],
];

export default function Membership() {
  return <>
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_.8fr] lg:px-8 lg:py-20">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Community membership & storage</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Membership</h1>
        <h2 className="mt-4 max-w-3xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">Communication is for the community—not a paid unlock.</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Critical messaging, calls, and community participation remain free. Voluntary support helps keep CK Conflux running; supporter entitlements primarily add persistent storage and capacity.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ExternalLink href={ACCOUNT_PORTAL_URL} className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20">My Account</ExternalLink>
          <ExternalLink href="https://element.ckconflux.com" className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white">Open Element</ExternalLink>
        </div>
      </div>
      <aside className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-7">
        <Heart aria-hidden="true" className="h-8 w-8 text-cyan-200" />
        <h2 className="mt-5 text-2xl font-semibold text-white">Supported by people, not surveillance</h2>
        <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-200">
          <li>Community services have no advertising.</li>
          <li>CK Conflux does not sell user information.</li>
          <li>Private conversations and content are not used to train AI models.</li>
        </ul>
      </aside>
    </section>

    <section className="border-y border-white/10 bg-white/[0.025]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-white">What community support helps pay for</h2>
        <p className="mt-3 max-w-3xl leading-7 text-slate-300">Contributions help meet the real infrastructure costs behind a community-operated service. They are voluntary support, not a toll for essential communication.</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {infrastructure.map(([icon, label]) => <li key={label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-sm font-semibold text-white">{createElement(icon, { 'aria-hidden': true, className: 'mb-3 h-5 w-5 text-cyan-200' })}{label}</li>)}
        </ul>
      </div>
    </section>

    <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-200">Included community capacity</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">{COMMUNITY_MEDIA_QUOTA.gibibytes} GiB of media storage</h2>
        <p className="mt-2 font-mono text-sm text-slate-400">{COMMUNITY_MEDIA_QUOTA.bytes.toLocaleString('en-US')} bytes</p>
        <p className="mt-5 leading-7 text-slate-300">At roughly 1 MB per photo, 10 GiB is on the order of 10,000 photos, or about 27 photos per day for a year.</p>
        <p className="mt-4 rounded-xl border border-amber-200/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50"><strong>This is only an illustration.</strong> Actual image sizes vary substantially with resolution, compression, format, device, and quality settings. It is not a guaranteed file count, and quotas may change as the service evolves.</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-200">Two clear destinations</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Manage or communicate</h2>
        <div className="mt-6 space-y-6">
          <div><h3 className="font-semibold text-white">My Account</h3><p className="mt-1 text-sm leading-6 text-slate-300">Membership, storage, and account administration. The portal can show your authenticated Matrix account/MXID, storage usage and allowance, and current entitlement, and provides supporter association and supported gift or benefit workflows when available.</p><ExternalLink href={ACCOUNT_PORTAL_URL} className="mt-3 inline-flex font-semibold text-cyan-200 underline underline-offset-4">Go to My Account</ExternalLink></div>
          <div className="border-t border-white/10 pt-6"><h3 className="font-semibold text-white">Open Element</h3><p className="mt-1 text-sm leading-6 text-slate-300">Messaging, community rooms, and calls. Use Element to participate—not to administer membership or storage.</p><ExternalLink href="https://element.ckconflux.com" className="mt-3 inline-flex font-semibold text-cyan-200 underline underline-offset-4">Open Element</ExternalLink></div>
        </div>
        <p className="mt-6 text-xs leading-5 text-slate-400">Sign-in and user-specific account data stay in the dedicated account portal; this public site does not retrieve them.</p>
      </div>
      <div className="lg:col-span-2 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-6 text-center"><h2 className="text-xl font-semibold text-white">Need help choosing where to go?</h2><p className="mt-2 text-sm text-slate-300">Visit the help center for service guidance, or My Account for your own allowance and entitlement.</p><SiteLink to="/help" className="mt-4 inline-flex rounded-lg border border-white/20 px-4 py-2 font-semibold text-white">Visit Help</SiteLink></div>
    </section>
  </>;
}
