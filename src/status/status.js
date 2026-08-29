const COMPONENT_LABELS = {
  website: 'Website', web: 'Website', frontend: 'Website',
  authentication: 'Sign-in / authentication', auth: 'Sign-in / authentication', signin: 'Sign-in / authentication', login: 'Sign-in / authentication',
  matrix: 'Matrix messaging', messaging: 'Matrix messaging', homeserver: 'Matrix messaging', synapse: 'Matrix messaging',
  media: 'Media uploads', uploads: 'Media uploads',
  calls: 'Voice / video calls', call: 'Voice / video calls', matrixrtc: 'Voice / video calls', livekit: 'Voice / video calls',
  membership: 'Membership / account services', account: 'Membership / account services', accounts: 'Membership / account services',
  teamspeak: 'TeamSpeak',
};

const COMPONENT_ALIASES = Object.keys(COMPONENT_LABELS).sort((a, b) => b.length - a.length);

export const STATUS_ENDPOINT = '/status.json';
export const INDEPENDENT_STATUS_URL = 'https://status.ckconflux.com';
export const INDEPENDENT_STATUS_BADGE_URL = 'https://badge.uptimerobot.com/psp/177dfd29052bc6cc25407cf35076378b.svg?style=text&theme=dark';
export const INDEPENDENT_STATUS_BADGE_LINK = `${INDEPENDENT_STATUS_URL}?utm_source=status_badge&utm_medium=referral`;

export function healthState(value) {
  const raw = typeof value === 'object' && value ? value.status ?? value.state ?? value.health ?? value.operational : value;
  if (raw === true) return 'operational';
  if (raw === false) return 'unavailable';
  if (typeof raw !== 'string') return 'unknown';
  const state = raw.toLowerCase().replace(/[ _-]/g, '');
  if (['ok', 'up', 'healthy', 'online', 'operational', 'available', 'pass', 'passing'].includes(state)) return 'operational';
  if (['degraded', 'partial', 'partialoutage', 'warning', 'impaired'].includes(state)) return 'degraded';
  if (['down', 'offline', 'failed', 'failing', 'unavailable', 'outage', 'critical'].includes(state)) return 'unavailable';
  return 'unknown';
}

function componentName(key) {
  const raw = String(key ?? '').trim();
  const normalized = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
  const matchingKey = COMPONENT_LABELS[normalized]
    ? normalized
    : COMPONENT_ALIASES.find((candidate) => normalized.includes(candidate));
  if (matchingKey) return COMPONENT_LABELS[matchingKey];
  if (!raw) return 'Unknown component';
  return raw
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function parseStatus(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  const source = payload.components ?? payload.services ?? payload.checks;
  const hasComponentContainer = Array.isArray(source) || (source && typeof source === 'object');
  const entries = Array.isArray(source)
    ? source.map((item) => [item?.name ?? item?.component ?? item?.id, item])
    : source && typeof source === 'object' ? Object.entries(source) : Object.entries(payload);
  const components = entries.map(([key, value]) => ({ name: componentName(key), state: healthState(value) }));
  if (!hasComponentContainer && components.every(({ state }) => state === 'unknown')) return null;
  const unique = [...new Map(components.map((component) => [component.name, component])).values()];
  if (!unique.length) return null;
  const generatedAt = payload.generatedAt ?? payload.generated_at ?? payload.updatedAt ?? payload.updated_at ?? payload.timestamp ?? null;
  const states = unique.map(({ state }) => state);
  const overall = states.includes('unavailable') ? 'unavailable' : states.includes('degraded') ? 'degraded' : states.every((state) => state === 'operational') ? 'operational' : 'unknown';
  return { overall, components: unique, generatedAt };
}

export const stateLabel = (state) => ({ operational: 'Operational', degraded: 'Degraded', unavailable: 'Unavailable', unknown: 'Unknown' }[state] ?? 'Unknown');
