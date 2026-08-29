import { describe, expect, it } from 'vitest';
import { PUBLIC_CONTACTS } from './community';

describe('canonical public contacts', () => {
  it('keeps distinct intent addresses in the shared frontend contract', () => {
    expect(PUBLIC_CONTACTS).toEqual({
      support: { email: 'support@ckconflux.com', mailto: 'mailto:support@ckconflux.com' },
      abuse: { email: 'abuse@ckconflux.com', mailto: 'mailto:abuse@ckconflux.com' },
      security: { email: 'security@ckconflux.com', mailto: 'mailto:security@ckconflux.com' },
      privacy: { email: 'privacy@ckconflux.com', mailto: 'mailto:privacy@ckconflux.com' },
    });
  });
});
