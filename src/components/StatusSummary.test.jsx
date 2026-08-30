import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Router } from '../router/Router';
import StatusSummary from './StatusSummary';

const response = (body) => ({ ok: true, json: async () => body });

function renderSummary() {
  return render(<Router><StatusSummary /></Router>);
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('StatusSummary', () => {
  it('does not claim messaging and sign-in are operational without evidence for both', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ checks: { calls: 'degraded', matrix: 'mystery', login: 'ok' } })));
    renderSummary();

    expect(await screen.findByText('Voice & video is degraded')).toBeInTheDocument();
    expect(screen.queryByText('Messaging and sign-in remain operational.')).not.toBeInTheDocument();
    expect(screen.getByText('Other services may remain operational; view details for the full status.')).toBeInTheDocument();
  });

  it('derives freshness from the payload timestamp instead of permanently saying updated recently', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ generated_at: '2000-01-01T00:00:00Z', checks: { matrix: 'ok', login: 'ok' } })));
    renderSummary();

    expect(await screen.findByText('All systems operational')).toBeInTheDocument();
    expect(screen.queryByText('Updated recently')).not.toBeInTheDocument();
    expect(screen.getByText(/^Updated \d+ hours ago$/)).toBeInTheDocument();
  });
});