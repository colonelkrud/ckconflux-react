import { describe, expect, it } from 'vitest';
import { PUBLIC_CONTACTS } from './community';

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
