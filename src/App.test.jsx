import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

void App;

describe('CK Conflux landing page', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('CK Conflux')).toBeInTheDocument();
  });

  it('contains start-here onboarding copy', () => {
    render(<App />);
    expect(screen.getByText(/Begin with Element on Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Simple step-by-step onboarding/i)).toBeInTheDocument();
  });

  it('renders major CTAs', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /^Start with Element$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Mastodon/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Download TeamSpeak$/i })).toBeInTheDocument();
  });
});
