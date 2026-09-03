import { Database, Gauge, Gift, Globe2, HardDrive, Heart, KeyRound, Server, ShieldCheck, UserRound, Wifi } from 'lucide-react';
import { createElement } from 'react';
import { ExternalLink, SiteLink } from '../components/SiteLink';
import { ACCOUNT_PORTAL_URL, COMMUNITY_MEDIA_ALLOWANCES, COMMUNITY_MEDIA_POLICY, PASSWORD_RECOVERY_URL, SUPPORTER_URL } from '../config/community';

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
      <div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/[0.06] p-7">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-200">CK Conflux account services</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">My Account</h2>
        <p className="mt-3 text-lg font-semibold text-slate-100">Manage your membership and community account benefits</p>
        <p className="mt-3 text-sm leading-6 text-slate-300">My Account is the home for membership and community services associated with your CK Conflux Matrix account.</p>
        <div className="mt-6 grid gap-4">
          <article className="rounded-2xl border border-white/10 bg-slate-950/35 p-4"><UserRound aria-hidden="true" className="h-5 w-5 text-cyan-200" /><h3 className="mt-2 font-semibold text-white">Membership and subscriptions</h3><p className="mt-1 text-sm leading-6 text-slate-300">View your membership and supporter status, check subscription state, manage supported membership associations, and access subscription management where available. You can also connect and manage an eligible Buy Me a Coffee membership.</p></article>
          <article className="rounded-2xl border border-white/10 bg-slate-950/35 p-4"><KeyRound aria-hidden="true" className="h-5 w-5 text-cyan-200" /><h3 className="mt-2 font-semibold text-white">Registration codes (invite codes)</h3><p className="mt-1 text-sm leading-6 text-slate-300">Create, view, and manage registration codes, then share them privately to invite others to CK Conflux.</p></article>
          <article className="rounded-2xl border border-white/10 bg-slate-950/35 p-4"><Gift aria-hidden="true" className="h-5 w-5 text-cyan-200" /><h3 className="mt-2 font-semibold text-white">Storage and benefits</h3><p className="mt-1 text-sm leading-6 text-slate-300">See your current storage allowance, current media usage, and the membership benefits and entitlements associated with your account.</p></article>
        </div>
        <ExternalLink href={ACCOUNT_PORTAL_URL} className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200">Open My Account</ExternalLink>
        <aside className="mt-6 rounded-2xl border border-amber-200/20 bg-amber-300/[0.06] p-5" aria-labelledby="password-help-heading"><h3 id="password-help-heading" className="font-semibold text-white">Password or sign-in help?</h3><p className="mt-2 text-sm leading-6 text-slate-300">My Account does not manage Matrix passwords. Password resets and account recovery use the existing Matrix Authentication Service (MAS)-backed authentication and recovery flow.</p><ExternalLink href={PASSWORD_RECOVERY_URL} className="mt-3 inline-flex font-semibold text-amber-100 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200">Reset password</ExternalLink></aside>
        <p className="mt-5 text-sm leading-6 text-slate-300"><strong className="text-white">For messaging, rooms, and calls, use Element.</strong> My Account is for membership, registration codes, storage, and benefits; authentication and recovery handle sign-in credentials.</p>
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
