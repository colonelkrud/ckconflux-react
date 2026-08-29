const GIBIBYTE_IN_BYTES = 1024 ** 3;

const mediaAllowance = (label, gibibytes) => Object.freeze({
  label,
  gibibytes,
  bytes: gibibytes * GIBIBYTE_IN_BYTES,
});

export const ACCOUNT_PORTAL_URL = 'https://account.ckconflux.com';
export const MASTODON_SERVICE_URL = 'https://masto.colonelkrud.com';

export const COMMUNITY_MEDIA_ALLOWANCES = Object.freeze({
  total: mediaAllowance('Total stored-media capacity', 10),
  monthly: mediaAllowance('Monthly media allowance', 1),
});
