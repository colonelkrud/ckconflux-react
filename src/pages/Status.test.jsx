import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Status from './Status';

const response = (body) => ({ ok: true, json: async () => body });

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Status page', () => {
  it('does not claim absent services are healthy for a partial operational feed', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ checks: { matrix: 'ok', login: 'ok' } })));
    render(<Status />);

    expect(await screen.findByRole('heading', { name: 'All systems operational' })).toBeInTheDocument();
    expect(screen.getByText('All reported services are healthy.')).toBeInTheDocument();
    expect(screen.queryByText('Messaging, sign-in, calls, media, and account services are reporting healthy.')).not.toBeInTheDocument();
    expect(screen.getByText('Messaging')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.queryByText('Voice & video')).not.toBeInTheDocument();
    expect(screen.queryByText('Media & uploads')).not.toBeInTheDocument();
    expect(screen.queryByText('Account & membership')).not.toBeInTheDocument();
  });
});
