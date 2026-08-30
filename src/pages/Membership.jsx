import { Database, Gauge, Globe2, HardDrive, Heart, Server, ShieldCheck, Wifi } from 'lucide-react';
import { createElement } from 'react';
import { ExternalLink, SiteLink } from '../components/SiteLink';
import { ACCOUNT_PORTAL_URL, COMMUNITY_MEDIA_ALLOWANCES, COMMUNITY_MEDIA_POLICY, SUPPORTER_URL } from '../config/community';

const infrastructure = [
  [Server, 'Hosting & compute'],
  [Database, 'Databases'],
  [HardDrive, 'Media storage'],
  [Wifi, 'Bandwidth'],
  [Gauge, 'Monitoring'],
  [ShieldCheck, 'Backups & operations'],
  [Globe2, 'Domains & related infrastructure'],
];

const ILLUSTRATIVE_PHOTO_BYTES = 1024 ** 2;
const PHOTO_COUNT_ROUNDING = 1000;
const illustrativePhotoCount = Math.round(
  COMMUNITY_MEDIA_ALLOWANCES.total.bytes / ILLUSTRATIVE_PHOTO_BYTES / PHOTO_COUNT_ROUNDING,
) * PHOTO_COUNT_ROUNDING;

export default function Membership() {
  return <>
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_.8fr] lg:px-8 lg:py-20">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Community membership & storage</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Membership</h1>
        <h2 className="mt-4 max-w-3xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">Communication is for the community—not a paid unlock.</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Critical messaging, calls, and community participation remain free. Support is voluntary and helps keep CK Conflux running; supporter benefits may add durable allocated account and media capacity, but “durable” does not mean permanent or stored forever. Media remains subject to the lifecycle policy below.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ExternalLink href={ACCOUNT_PORTAL_URL} className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20">My Account</ExternalLink>
          <ExternalLink href={SUPPORTER_URL} className="rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 font-semibold text-cyan-100">Support CK Conflux</ExternalLink>
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
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-200">Included community media</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Default media allowances</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {Object.values(COMMUNITY_MEDIA_ALLOWANCES).map((allowance) => <div key={allowance.label} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4"><dt className="text-sm font-semibold text-cyan-100">{allowance.label}</dt><dd className="mt-2 text-2xl font-semibold text-white">{allowance.gibibytes} GiB</dd><dd className="mt-1 font-mono text-xs text-slate-400">{allowance.bytes.toLocaleString('en-US')} bytes</dd></div>)}
        </dl>
        <p className="mt-5 leading-7 text-slate-300">The total capacity is how much media can remain stored in your account. The monthly allowance limits media added during a month. You can therefore reach the monthly limit after adding {COMMUNITY_MEDIA_ALLOWANCES.monthly.gibibytes} GiB even when you still have room within the {COMMUNITY_MEDIA_ALLOWANCES.total.gibibytes} GiB total capacity.</p>
        <p className="mt-4 leading-7 text-slate-300"><strong className="font-semibold text-white">{COMMUNITY_MEDIA_POLICY.perFile.label}: {COMMUNITY_MEDIA_POLICY.perFile.megabytes} MB.</strong> This applies to each individual upload and is separate from both allowances: {COMMUNITY_MEDIA_ALLOWANCES.total.gibibytes} GiB total capacity does not permit one file that large. A higher backend technical ceiling may exist for compatibility, but it is not a user entitlement.</p>
        <p className="mt-4 leading-7 text-slate-300">At roughly 1 MB per photo, the {COMMUNITY_MEDIA_ALLOWANCES.total.gibibytes} GiB <strong className="font-semibold text-white">total capacity</strong> is on the order of {illustrativePhotoCount.toLocaleString('en-US')} stored photos.</p>
        <p className="mt-4 rounded-xl border border-amber-200/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50"><strong>This total-capacity example is only an illustration, not a monthly upload guarantee.</strong> Actual image sizes vary substantially with resolution, compression, format, device, and quality settings. It is not a guaranteed file count, and allowances may change as the service evolves.</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-200">Two clear destinations</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Manage or communicate</h2>
        <div className="mt-6 space-y-6">
          <div><h3 className="font-semibold text-white">My Account</h3><p className="mt-1 text-sm leading-6 text-slate-300">Membership, storage, and account administration. My Account is authoritative for your signed-in account’s actual current total capacity, monthly allowance, usage, and entitlement. It also provides supporter association and supported gift or benefit workflows when available.</p><ExternalLink href={ACCOUNT_PORTAL_URL} className="mt-3 inline-flex font-semibold text-cyan-200 underline underline-offset-4">Go to My Account</ExternalLink></div>
          <div className="border-t border-white/10 pt-6"><h3 className="font-semibold text-white">Open Element</h3><p className="mt-1 text-sm leading-6 text-slate-300">Messaging, community rooms, and calls. Use Element to participate—not to administer membership or storage.</p><ExternalLink href="https://element.ckconflux.com" className="mt-3 inline-flex font-semibold text-cyan-200 underline underline-offset-4">Open Element</ExternalLink></div>
        </div>
        <p className="mt-6 text-xs leading-5 text-slate-400">Sign-in and user-specific account data stay in the dedicated account portal; this public site does not retrieve them.</p>
      </div>
      <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-7">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-200">Media lifecycle</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Local media and federated caches differ</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <p className="rounded-2xl border border-white/10 p-4 leading-7 text-slate-300"><strong className="text-white">{COMMUNITY_MEDIA_POLICY.localLifetime.label}: {COMMUNITY_MEDIA_POLICY.localLifetime.value}.</strong> Media uploaded by a CK Conflux user and stored locally is subject to this lifecycle; allocated capacity is not a promise of permanent retention.</p>
          <p className="rounded-2xl border border-white/10 p-4 leading-7 text-slate-300"><strong className="text-white">{COMMUNITY_MEDIA_POLICY.remoteCacheLifetime.label}: {COMMUNITY_MEDIA_POLICY.remoteCacheLifetime.value}.</strong> Media retrieved from another homeserver is a local cache. Eviction does not necessarily delete the original from its source homeserver.</p>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300">Federation means CK Conflux cannot promise global deletion. Copies already received by another homeserver or recipient, or included in an export or backup, may remain outside CK Conflux’s unilateral control. Encrypted Matrix media may be stored as ciphertext; lifecycle handling does not imply CK Conflux can inspect its plaintext.</p>
      </div>
      <div className="lg:col-span-2 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-6 text-center"><h2 className="text-xl font-semibold text-white">Need help choosing where to go?</h2><p className="mt-2 text-sm text-slate-300">Visit the help center for service guidance, or My Account for your actual current total capacity, monthly allowance, usage, and entitlement.</p><SiteLink to="/help" className="mt-4 inline-flex rounded-lg border border-white/20 px-4 py-2 font-semibold text-white">Visit Help</SiteLink></div>
    </section>
  </>;
}
