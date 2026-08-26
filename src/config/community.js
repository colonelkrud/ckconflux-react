const GIBIBYTE_IN_BYTES = 1024 ** 3;
const COMMUNITY_MEDIA_GIBIBYTES = 10;

export const ACCOUNT_PORTAL_URL = 'https://account.ckconflux.com';

export const COMMUNITY_MEDIA_QUOTA = Object.freeze({
  gibibytes: COMMUNITY_MEDIA_GIBIBYTES,
  bytes: COMMUNITY_MEDIA_GIBIBYTES * GIBIBYTE_IN_BYTES,
});