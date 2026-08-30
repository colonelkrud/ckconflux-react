import { describe, expect, it } from 'vitest';
import { COMMUNITY_MEDIA_ALLOWANCES, COMMUNITY_MEDIA_POLICY, PUBLIC_CONTACTS, SUPPORTER_URL } from './community';

describe('canonical public contacts', () => {
  it('maps each intent to the canonical public endpoint', () => {
    expect(PUBLIC_CONTACTS).toEqual({
      support: { email: 'support@ckconflux.com', mailto: 'mailto:support@ckconflux.com' },
      abuse: { email: 'abuse@mg.ckconflux.com', mailto: 'mailto:abuse@mg.ckconflux.com' },
      security: { email: 'abuse@mg.ckconflux.com', mailto: 'mailto:abuse@mg.ckconflux.com' },
      privacy: { email: 'abuse@mg.ckconflux.com', mailto: 'mailto:abuse@mg.ckconflux.com' },
    });

    expect(PUBLIC_CONTACTS.security).toBe(PUBLIC_CONTACTS.abuse);
    expect(PUBLIC_CONTACTS.privacy).toBe(PUBLIC_CONTACTS.abuse);
  });

  it('does not publish invented intent aliases', () => {
    const publishedEmails = Object.values(PUBLIC_CONTACTS).map(({ email }) => email);

    expect(publishedEmails).not.toContain('abuse@ckconflux.com');
    expect(publishedEmails).not.toContain('security@ckconflux.com');
    expect(publishedEmails).not.toContain('privacy@ckconflux.com');
  });
});

describe('maintained community media and supporter policy', () => {
  it('keeps allowances separate from the intentional public per-file rule', () => {
    expect(COMMUNITY_MEDIA_ALLOWANCES.total).toMatchObject({ gibibytes: 10, bytes: 10737418240 });
    expect(COMMUNITY_MEDIA_ALLOWANCES.monthly).toMatchObject({ gibibytes: 1, bytes: 1073741824 });
    // 100 MB is the community policy; the backend 500M compatibility ceiling is
    // deliberately not represented as an allowance or user entitlement.
    expect(COMMUNITY_MEDIA_POLICY.perFile).toEqual({ label: 'Community per-file limit', megabytes: 100 });
    expect(COMMUNITY_MEDIA_POLICY).not.toHaveProperty('technicalCeiling');
  });

  it('maintains distinct local and federated-cache lifecycles and one supporter URL', () => {
    expect(COMMUNITY_MEDIA_POLICY.localLifetime.value).toBe('1 year');
    expect(COMMUNITY_MEDIA_POLICY.remoteCacheLifetime.value).toBe('2 days');
    expect(SUPPORTER_URL).toBe('https://buymeacoffee.com/conflux');
  });
});
