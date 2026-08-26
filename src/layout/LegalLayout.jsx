export default function LegalLayout({ title, lastUpdated, children }) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-slate-300">Last updated {lastUpdated}</p>
      </header>
      <div className="mt-6 space-y-5 text-sm leading-7 text-slate-200 sm:text-base">{children}</div>
    </section>
  );
}
