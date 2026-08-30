const COMPONENTS = {
  messaging: { name: 'Messaging', order: 1, aliases: ['matrix', 'messaging', 'homeserver', 'synapse'] },
  signin: { name: 'Sign in', order: 2, aliases: ['authentication', 'auth', 'signin', 'login'] },
  calls: { name: 'Voice & video', order: 3, aliases: ['calls', 'call', 'matrixrtc', 'livekit', 'turnify'] },
  media: { name: 'Media & uploads', order: 4, aliases: ['media', 'uploads'] },
  account: { name: 'Account & membership', order: 5, aliases: ['membership', 'account', 'accounts'] },
  website: { name: 'Website', order: 6, aliases: ['website', 'web', 'frontend'] },
};

const ALIASES = Object.entries(COMPONENTS)
  .flatMap(([id, component]) => component.aliases.map((alias) => ({ alias, id })))
  .sort((a, b) => b.alias.length - a.alias.length);
const STATE_PRIORITY = { operational: 0, unknown: 1, degraded: 2, unavailable: 3 };
const CONTRACT_STATES = new Set(['ok', 'degraded', 'down', 'unknown']);
const LEGACY_METADATA_KEYS = new Set([
  'status', 'state', 'health', 'generatedat', 'updatedat', 'timestamp',
  'snapshotageseconds', 'stale', 'messages', 'message',
]);

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

function normalizedKey(key) {
  return String(key ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function canonicalComponent(key) {
  const normalized = normalizedKey(key);
  return ALIASES.find(({ alias }) => normalized === alias || normalized.includes(alias)) ?? null;
}

function isLegacyHealthEntry(key, value) {
  if (canonicalComponent(key)) return true;
  if (LEGACY_METADATA_KEYS.has(normalizedKey(key))) return false;
  return healthState(value) !== 'unknown';
}

function normalizeComponent(key) {
  const raw = String(key ?? '').trim();
  const normalized = normalizedKey(raw);
  const match = canonicalComponent(raw);
  if (match) return { id: match.id, name: COMPONENTS[match.id].name, order: COMPONENTS[match.id].order };
  const infrastructureName = /(kubernetes|deployment|namespace|\bpod\b|worker|internal)/i.test(raw);
  const name = infrastructureName ? 'Additional service' : raw
    ? raw.replace(/[_-]+/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/\b\w/g, (letter) => letter.toUpperCase())
    : 'Unknown component';
  return { id: `other-${normalized || 'unknown'}`, name, order: 100 };
}

function overallState(states) {
  if (!states.length) return 'unknown';
  return states.reduce((worst, state) => STATE_PRIORITY[state] > STATE_PRIORITY[worst] ? state : worst, 'operational');
}

function isCurrentContractPayload(payload) {
  const rawStatus = typeof payload.status === 'string' ? payload.status.toLowerCase().trim() : null;
  return Boolean(
    payload.checks
    && typeof payload.checks === 'object'
    && !Array.isArray(payload.checks)
    && typeof payload.stale === 'boolean'
    && rawStatus
    && CONTRACT_STATES.has(rawStatus),
  );
}

function isNoSnapshotPayload(payload) {
  return isCurrentContractPayload(payload)
    && payload.status.toLowerCase().trim() === 'unknown'
    && payload.stale === true
    && Object.keys(payload.checks).length === 0;
}

export function parseStatus(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  const noSnapshot = isNoSnapshotPayload(payload);
  const explicitSource = payload.components ?? payload.services ?? payload.checks;
  const source = explicitSource ?? Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => isLegacyHealthEntry(key, value)),
  );
  if (!source || typeof source !== 'object') return null;

  const entries = Array.isArray(source)
    ? source.map((item) => [item?.name ?? item?.component ?? item?.id, item])
    : Object.entries(source);
  if (!entries.length && !noSnapshot) return null;

  const byId = new Map();
  entries.forEach(([key, value]) => {
    const component = normalizeComponent(key);
    const next = { id: component.id, name: component.name, state: healthState(value), order: component.order };
    const current = byId.get(component.id);
    if (!current || STATE_PRIORITY[next.state] > STATE_PRIORITY[current.state]) byId.set(component.id, next);
  });
  const components = [...byId.values()]
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
    .map(({ id, name, state }) => ({ id, name, state }));

  const generatedAt = payload.generatedAt ?? payload.generated_at ?? payload.updatedAt ?? payload.updated_at ?? payload.timestamp ?? null;
  const states = components.map(({ state }) => state);
  const feedStateValue = payload.status ?? payload.state ?? payload.health;
  if (feedStateValue !== undefined && feedStateValue !== null) states.push(healthState(feedStateValue));
  const overall = overallState(states);
  const snapshotAgeValue = payload.snapshotAgeSeconds ?? payload.snapshot_age_seconds;
  const snapshotAgeSeconds = typeof snapshotAgeValue === 'number' && Number.isFinite(snapshotAgeValue) && snapshotAgeValue >= 0
    ? snapshotAgeValue
    : null;
  const messages = Array.isArray(payload.messages)
    ? payload.messages.filter((message) => typeof message === 'string' && message.trim()).map((message) => message.trim())
    : [];

  return {
    overall,
    components,
    generatedAt,
    snapshotAgeSeconds,
    stale: payload.stale === true,
    messages,
  };
}

export const stateLabel = (state) => ({ operational: 'Operational', degraded: 'Degraded', unavailable: 'Unavailable', unknown: 'Unknown' }[state] ?? 'Unknown');

export const statusHeadline = (state) => ({
  operational: 'All systems operational',
  degraded: 'Some services are degraded',
  unavailable: 'Service outage detected',
  unknown: 'Status information incomplete',
}[state] ?? 'Status information incomplete');
