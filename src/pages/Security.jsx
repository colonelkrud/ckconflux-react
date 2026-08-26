import { Link } from '../router/Router';

export default function SecurityPage() {
  return <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Security &amp; recovery</p>
    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Security</h1>
    <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">Understand what encryption protects, prepare for account recovery, and know where trust crosses between your device, CK Conflux, and the federated network.</p>

    <section className="mt-10"><h2 className="text-2xl font-semibold text-white">Protect your Matrix account</h2><div className="mt-4 grid gap-4 md:grid-cols-3">
      <article className="rounded-2xl border border-white/10 bg-white/5 p-5"><h3 className="font-semibold text-white">1. Set up secure backup</h3><p className="mt-2 text-sm leading-6 text-slate-300">In Element’s security settings, enable and configure secure backup for your encryption keys. A recovery email and a secure backup serve different purposes.</p></article>
      <article className="rounded-2xl border border-white/10 bg-white/5 p-5"><h3 className="font-semibold text-white">2. Save the recovery key</h3><p className="mt-2 text-sm leading-6 text-slate-300">Keep the recovery key somewhere safe and separate from the device you use for Matrix. CK Conflux cannot recreate a lost recovery key or decrypt history without the necessary keys.</p></article>
      <article className="rounded-2xl border border-white/10 bg-white/5 p-5"><h3 className="font-semibold text-white">3. Verify devices and sessions</h3><p className="mt-2 text-sm leading-6 text-slate-300">Review signed-in sessions and verify a new device from an existing trusted device or with your recovery method. Remove sessions you do not recognize.</p></article>
    </div></section>

    <section className="mt-10 space-y-5"><h2 className="text-2xl font-semibold text-white">What to know day to day</h2>
      <article><h3 className="text-lg font-semibold text-white">End-to-end encryption (E2EE)</h3><p className="mt-2 leading-7 text-slate-300">In an end-to-end encrypted room, participating devices hold the keys needed to read message content. The CK Conflux Matrix server transports and stores encrypted content but cannot necessarily read its plaintext. Encryption status can differ by room, feature, and client, so check the room before sharing sensitive information.</p></article>
      <article><h3 className="text-lg font-semibold text-white">A new device needs your keys</h3><p className="mt-2 leading-7 text-slate-300">After signing in on a new device, verify it and restore encryption keys from secure backup or another verified session. Without those keys, older encrypted history may remain unreadable even though the account sign-in succeeded.</p></article>
      <article><h3 className="text-lg font-semibold text-white">Federation creates trust boundaries</h3><p className="mt-2 leading-7 text-slate-300">Rooms may include people and servers outside CK Conflux. Participating homeservers receive the room data needed for federation, and their policies and controls are outside CK Conflux’s control. E2EE protects eligible content, not all metadata or what recipients choose to copy.</p></article>
      <article><h3 className="text-lg font-semibold text-white">Reporting and moderation</h3><p className="mt-2 leading-7 text-slate-300">Use the client’s report, ignore, and block tools. Reports need enough context for moderators to act; E2EE can limit what a server operator can inspect without user-provided report content. Review the <Link className="font-semibold text-cyan-200 underline" to="/rules">Rules</Link> and use the routes on <Link className="font-semibold text-cyan-200 underline" to="/support">Support</Link>.</p></article>
    </section>

    <details className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5"><summary className="cursor-pointer text-xl font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">Technical details and trust boundaries</summary><div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
      <p><strong className="text-white">Content and metadata:</strong> E2EE can conceal plaintext message content from the homeserver, while account identifiers, room membership and routing events, timestamps, IP/access logs, and other operational metadata may remain visible.</p>
      <p><strong className="text-white">Encrypted media:</strong> Media shared in an encrypted Matrix room can be stored as ciphertext for clients with the keys to decrypt. CK Conflux does not claim it can inspect the plaintext of every encrypted upload. Unencrypted or reported content has different boundaries.</p>
      <p><strong className="text-white">Federation:</strong> Each participating homeserver processes data needed to join and synchronize a federated room. CK Conflux controls its own services, not third-party server retention or security.</p>
      <p><strong className="text-white">Server and client trust:</strong> Protect your device and choose clients you trust: clients handle plaintext and encryption keys. CK Conflux applies operational access, authentication, transport security, monitoring, and abuse controls to its services without publishing sensitive infrastructure details.</p>
    </div></details>
  </section>;
}
