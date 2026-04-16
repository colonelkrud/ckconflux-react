import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

void App;

describe('CK Conflux site IA', () => {
  it('renders home onboarding by default', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Private community chat and calls/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Help Center/i })).toBeInTheDocument();
  });

  it('renders help page with policy links', () => {
    window.history.pushState({}, '', '/help');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Matrix onboarding, FAQ, and support resources/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Terms of Use/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Server Rules/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Privacy Policy/i }).length).toBeGreaterThan(0);
  });

  it('renders terms and privacy legal pages', () => {
    window.history.pushState({}, '', '/terms');
    const { unmount } = render(<App />);
    expect(screen.getByRole('heading', { name: /CK Conflux Terms of Use/i })).toBeInTheDocument();
    expect(screen.getByText(/Last updated April 16, 2026/i)).toBeInTheDocument();

    unmount();
    window.history.pushState({}, '', '/privacy');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getByText(/Last updated Mar 16, 2025/i)).toBeInTheDocument();
  });
});
