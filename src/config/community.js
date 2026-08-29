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
export const ELEMENT_IDENTITY_RESET_GUIDE_URL = 'https://docs.element.io/latest/element-support/matrix-account-management/managing-a-matrix-account/#resetting-your-identity';

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
