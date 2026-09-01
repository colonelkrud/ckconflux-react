import Header from '../components/Header';
import Footer from '../components/Footer';
import NetworkGlobeBackground from '../components/NetworkGlobeBackground';

export default function SiteLayout({ children }) {
  return <div className="relative isolate min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
    <NetworkGlobeBackground />
    <a href="#main-content" className="sr-only z-50 rounded bg-cyan-300 p-3 text-slate-950 focus:not-sr-only focus:fixed focus:left-3 focus:top-3">Skip to content</a>
    <Header />
    <main id="main-content" className="relative z-10">{children}</main>
    <div className="relative z-10"><Footer /></div>
  </div>;
}
