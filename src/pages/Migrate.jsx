import { useState } from 'react';

export const MIGRATION_TOKEN = 'COLONELKRUD-TO-CONFLUX';
export const REGISTRATION_URL = 'https://element.ckconflux.com/#/register';
const steps = ['Copy the migration registration code.', 'Open CK Conflux registration.', 'Choose an available username, enter an email address, and create a password.', 'Enter the migration code when registration asks for a token.', 'Verify the email address.', 'After signing in, configure and save the Matrix encryption recovery key.'];

export default function Migrate() {
  const [copyState, setCopyState] = useState('idle');
  const copyToken = async () => {
    if (!navigator.clipboard?.writeText) { setCopyState('unavailable'); return; }
    try { await navigator.clipboard.writeText(MIGRATION_TOKEN); setCopyState('copied'); }
    catch { setCopyState('failed'); }
  };
  const feedback = copyState === 'copied' ? 'Migration code copied.' : copyState === 'idle' ? '' : 'Copy unavailable. Select and copy the code manually.';

  return <>
    <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_55%)]"><div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
      <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Legacy service migration</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">ColonelKrud has moved to CK Conflux</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Users of legacy ColonelKrud services can create a new CK Conflux Matrix account using the migration registration code below.</p></div>
      <div className="migration-flow self-center" aria-hidden="true"><span>colonelkrud.com</span><span className="migration-flow__track"><i /></span><span>ckconflux.com</span></div>
    </div></section>
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="code-heading"><div className="rounded-2xl border border-cyan-300/25 bg-cyan-400/[0.07] p-6 sm:p-8">
      <h2 id="code-heading" className="text-xl font-semibold text-white">Your migration registration code</h2><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"><code className="min-w-0 select-all overflow-x-auto rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-base font-semibold text-cyan-200 sm:text-lg">{MIGRATION_TOKEN}</code><button type="button" onClick={copyToken} aria-label="Copy migration registration code" className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/15">{copyState === 'copied' ? 'Copied!' : 'Copy code'}</button></div>
      <p className="mt-3 min-h-6 text-sm text-slate-300" role="status" aria-live="polite">{feedback}</p><a href={REGISTRATION_URL} className="mt-3 inline-flex w-full justify-center rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 sm:w-auto">Create my CK Conflux account</a>
    </div></section>
    <section className="mx-auto grid max-w-5xl gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8"><div><h2 className="text-2xl font-semibold text-white">Move to CK Conflux in six steps</h2><ol className="mt-5 space-y-3">{steps.map((step, index) => <li key={step} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4"><span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-semibold text-slate-950">{index + 1}</span><p className="pt-0.5 leading-6 text-slate-300">{step}</p></li>)}</ol></div>
      <div className="space-y-5"><article className="rounded-2xl border border-white/10 bg-white/5 p-6"><h2 className="text-xl font-semibold text-white">Your new Matrix ID</h2><p className="mt-3 leading-7 text-slate-300">Your new identity will look like <code className="select-all rounded bg-slate-900 px-2 py-1 text-cyan-200">@username:ckconflux.com</code>.</p></article><aside className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-6" aria-labelledby="separate-identities"><h2 id="separate-identities" className="text-xl font-semibold text-white">Separate accounts and history</h2><p className="mt-3 text-sm leading-6 text-slate-300">Your legacy account and new CK Conflux account are separate identities. Creating the new account does not automatically migrate old login sessions, account identity, or encrypted message history.</p></aside></div>
    </section>
  </>;
}
