import { motion as Motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, CircleHelp, XCircle } from 'lucide-react';

export const STATUS_STATE_META = {
  operational: {
    card: 'border-emerald-300/35 bg-emerald-400/[0.09] text-emerald-100 shadow-[0_18px_60px_-34px_rgba(52,211,153,0.55)]',
    icon: 'border-emerald-300/45 bg-emerald-300/10 text-emerald-100',
    ring: 'bg-emerald-300/25',
    bar: 'bg-emerald-300',
    glow: 'bg-emerald-400/20',
    pill: 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100',
  },
  degraded: {
    card: 'border-amber-300/40 bg-amber-400/10 text-amber-100 shadow-[0_18px_60px_-34px_rgba(251,191,36,0.55)]',
    icon: 'border-amber-300/50 bg-amber-300/10 text-amber-100',
    ring: 'bg-amber-300/25',
    bar: 'bg-amber-300',
    glow: 'bg-amber-400/20',
    pill: 'border-amber-300/35 bg-amber-400/10 text-amber-100',
  },
  unavailable: {
    card: 'border-rose-300/40 bg-rose-400/10 text-rose-100 shadow-[0_18px_60px_-32px_rgba(251,113,133,0.65)]',
    icon: 'border-rose-300/50 bg-rose-300/10 text-rose-100',
    ring: 'bg-rose-300/30',
    bar: 'bg-rose-300',
    glow: 'bg-rose-400/25',
    pill: 'border-rose-300/35 bg-rose-400/10 text-rose-100',
  },
  unknown: {
    card: 'border-slate-300/30 bg-slate-400/10 text-slate-100',
    icon: 'border-slate-300/40 bg-slate-300/10 text-slate-100',
    ring: 'bg-slate-300/20',
    bar: 'bg-slate-300',
    glow: 'bg-slate-400/15',
    pill: 'border-slate-300/30 bg-slate-400/10 text-slate-100',
  },
};

const STATE_ICONS = {
  operational: CheckCircle2,
  degraded: AlertTriangle,
  unavailable: XCircle,
  unknown: CircleHelp,
};

const SIGNAL_MOTION = {
  operational: { scale: [1, 1.18, 1], opacity: [0.2, 0.04, 0.2], duration: 3.6 },
  degraded: { scale: [1, 1.22, 1], opacity: [0.24, 0.05, 0.24], duration: 2.4 },
  unavailable: { scale: [1, 1.3, 1], opacity: [0.32, 0.03, 0.32], duration: 1.55 },
  unknown: { scale: [1, 1.14, 1], opacity: [0.16, 0.04, 0.16], duration: 4.2 },
};

export function StatusStateSignal({ state, large = false, reducedMotion = false }) {
  const Icon = STATE_ICONS[state] ?? CircleHelp;
  const meta = STATUS_STATE_META[state] ?? STATUS_STATE_META.unknown;
  const signalMotion = SIGNAL_MOTION[state] ?? SIGNAL_MOTION.unknown;
  const size = large ? 'h-12 w-12' : 'h-9 w-9';
  const iconSize = large ? 24 : 18;

  return <span aria-hidden="true" className={`relative flex shrink-0 items-center justify-center ${size}`}>
    {reducedMotion
      ? <span className={`absolute inset-0 rounded-full ${meta.ring}`} />
      : <Motion.span
          className={`absolute inset-0 rounded-full ${meta.ring}`}
          animate={{ scale: signalMotion.scale, opacity: signalMotion.opacity }}
          transition={{ duration: signalMotion.duration, repeat: Infinity, ease: 'easeInOut' }}
        />}
    <span className={`relative flex h-full w-full items-center justify-center rounded-full border ${meta.icon}`}>
      <Icon size={iconSize} strokeWidth={2.1} />
    </span>
  </span>;
}

export function StatusAmbientGlow({ state, reducedMotion = false, className = '' }) {
  const meta = STATUS_STATE_META[state] ?? STATUS_STATE_META.unknown;
  const duration = state === 'unavailable' ? 2.4 : state === 'degraded' ? 3.4 : 4.8;
  const classes = `pointer-events-none absolute rounded-full blur-3xl ${meta.glow} ${className}`;

  if (reducedMotion) return <span aria-hidden="true" className={classes} />;

  return <Motion.span
    aria-hidden="true"
    className={classes}
    animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.75, 0.45] }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
  />;
}
