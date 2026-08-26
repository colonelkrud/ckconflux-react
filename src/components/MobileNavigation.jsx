import { useEffect, useId, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ExternalLink, SiteLink } from './SiteLink';

export default function MobileNavigation({ links }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const containerRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setOpen(false); };
    const closeOutside = (event) => { if (!containerRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOutside);
    return () => { document.removeEventListener('keydown', closeOnEscape); document.removeEventListener('pointerdown', closeOutside); };
  }, [open]);
  return <div className="relative lg:hidden" ref={containerRef}>
    <button type="button" aria-expanded={open} aria-controls={id} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setOpen((value) => !value)} className="rounded-lg p-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
      {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
    </button>
    <nav id={id} aria-label="Mobile navigation" hidden={!open} className="absolute right-0 top-12 w-64 rounded-xl border border-white/10 bg-slate-950 p-3 shadow-2xl">
      {links.map((link) => link.external ? <ExternalLink key={link.to} href={link.to} className="block rounded-lg px-3 py-3 text-slate-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">{link.label}</ExternalLink> : <SiteLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-slate-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">{link.label}</SiteLink>)}
    </nav>
  </div>;
}
