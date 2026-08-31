const GIBIBYTE_IN_BYTES = 1024 ** 3;

const mediaAllowance = (label, gibibytes) => Object.freeze({
  label,
  gibibytes,
  bytes: gibibytes * GIBIBYTE_IN_BYTES,
});

export const ACCOUNT_PORTAL_URL = 'https://account.ckconflux.com';
export const MASTODON_SERVICE_URL = 'https://masto.colonelkrud.com';
export const ELEMENT_URL = 'https://element.ckconflux.com';
export const PASSWORD_RECOVERY_URL = `${ELEMENT_URL}/#/forgot_password`;
export const ELEMENT_RECOVERY_GUIDES = Object.freeze({
  noRecoveryMethod: 'https://docs.element.io/latest/element-support/matrix-account-management/resetting-your-identity/',
  recoveryKey: 'https://docs.element.io/latest/element-support/matrix-account-management/secure-backup/',
  newSession: 'https://docs.element.io/latest/element-support/device-verification/how-to-verify-devices/',
  anotherUser: 'https://docs.element.io/latest/element-support/matrix-rooms/room-members/verifying-a-user/',
});
export const SUPPORTER_URL = 'https://buymeacoffee.com/conflux';

const contact = (email) => Object.freeze({ email, mailto: `mailto:${email}` });
const sharedAbuseContact = contact('abuse@mg.ckconflux.com');

// Canonical public contacts defined by ck-conflux-apps-gitops#372.
export const PUBLIC_CONTACTS = Object.freeze({
  support: contact('support@ckconflux.com'),
  abuse: sharedAbuseContact,
  security: sharedAbuseContact,
  privacy: sharedAbuseContact,
});

export const COMMUNITY_MEDIA_ALLOWANCES = Object.freeze({
  total: mediaAllowance('Total stored-media capacity', 10),
  monthly: mediaAllowance('Monthly media allowance', 1),
});

// The public per-file rule is intentionally a community policy below the
// backend's 500M compatibility ceiling. The ceiling is not a user entitlement.
export const COMMUNITY_MEDIA_POLICY = Object.freeze({
  perFile: Object.freeze({ label: 'Community per-file limit', megabytes: 100 }),
  localLifetime: Object.freeze({ label: 'CK Conflux local media lifecycle', value: '1 year' }),
  remoteCacheLifetime: Object.freeze({ label: 'Federated media cache lifecycle', value: '2 days' }),
});
