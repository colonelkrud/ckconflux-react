import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { getPageMetadata, ROUTE_PATHS } from '../metadata/pageMetadata';

const renderMigration = (path = '/migrate') => { window.history.pushState({}, '', path); return render(<App />); };
afterEach(() => { vi.unstubAllGlobals(); document.head.querySelectorAll('link[rel="canonical"], meta[name="robots"]').forEach((node) => node.remove()); });

describe('legacy migration campaign', () => {
  it('resolves the unlinked route and presents its registration details', async () => {
    renderMigration('/migrate?from=matrix');
    expect(screen.getByRole('heading', { level: 1, name: 'ColonelKrud has moved to CK Conflux' })).toBeInTheDocument();
    expect(screen.getByText('COLONELKRUD-TO-CONFLUX')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create my CK Conflux account' })).toHaveAttribute('href', 'https://element.ckconflux.com/#/register');
    expect(window.location.search).toBe('?from=matrix');
    expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Explore links' })).not.toBeInTheDocument();
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow'));
  });

  it('copies the campaign token with accessible confirmation', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    renderMigration();
    fireEvent.click(screen.getByRole('button', { name: 'Copy migration registration code' }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('COLONELKRUD-TO-CONFLUX'));
    expect(await screen.findByText('Migration code copied.')).toBeInTheDocument();
  });

  it('keeps the code readable when clipboard support is unavailable', async () => {
    vi.stubGlobal('navigator', { ...navigator, clipboard: undefined });
    renderMigration();
    fireEvent.click(screen.getByRole('button', { name: 'Copy migration registration code' }));
    expect(await screen.findByText(/Select and copy the code manually/)).toBeInTheDocument();
    expect(screen.getByText('COLONELKRUD-TO-CONFLUX')).toBeInTheDocument();
  });

  it('declares migrate as prerenderable while normal known routes stay indexable', () => {
    expect(ROUTE_PATHS).toContain('/migrate');
    expect(getPageMetadata('/migrate').robots).toBe('noindex, nofollow');
    expect(getPageMetadata('/join').robots).toBeNull();
    expect(getPageMetadata('/').robots).toBeNull();
  });
});
