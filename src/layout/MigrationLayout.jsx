import { Link } from '../router/Router';

const links = [['Help', '/help'], ['Support', '/support'], ['Terms', '/terms'], ['Rules', '/rules'], ['Privacy', '/privacy']];

export default function MigrationLayout({ children }) {
  return <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
    <a href="#main-content" className="sr-only z-50 rounded bg-cyan-300 p-3 text-slate-950 focus:not-sr-only focus:fixed focus:left-3 focus:top-3">Skip to content</a>
    <header className="border-b border-white/10"><div className="mx-auto flex max-w-5xl items-center px-4 py-4 sm:px-6 lg:px-8"><Link to="/" className="font-semibold text-white">CK Conflux</Link><span className="ml-auto text-xs uppercase tracking-[0.16em] text-slate-400">Migration guide</span></div></header>
    <main id="main-content">{children}</main>
    <footer className="border-t border-white/10"><nav aria-label="Migration page links" className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-5 gap-y-2 px-4 py-7 text-sm text-slate-400">{links.map(([label, to]) => <Link key={to} to={to} className="rounded hover:text-white">{label}</Link>)}</nav></footer>
  </div>;
}
