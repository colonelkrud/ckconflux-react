import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

void App;

describe('CK Conflux landing page', () => {
  it('renders home onboarding by default', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByText('CK Conflux')).toBeInTheDocument();
    expect(screen.getByText(/Begin with Element on Matrix/i)).toBeInTheDocument();
  });

  it('renders major home CTAs', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByRole('link', { name: /^Start with Element$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Mastodon/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Download TeamSpeak$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Help Center/i })).toBeInTheDocument();
  });

  it('renders help page content and official docs link', () => {
    window.history.pushState({}, '', '/help');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Matrix onboarding, FAQ, and support resources/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open official Element FAQ/i })).toBeInTheDocument();
    expect(screen.getByText(/Beeper/i)).toBeInTheDocument();
  });
});
