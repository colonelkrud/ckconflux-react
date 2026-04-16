import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('CK Conflux landing page', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('CK Conflux')).toBeInTheDocument();
  });

  it('contains key onboarding copy', () => {
    render(<App />);
    expect(screen.getByText(/What is Element and Matrix, and why should you care/i)).toBeInTheDocument();
    expect(screen.getAllByText(/This becomes your permanent Matrix ID/i).length).toBeGreaterThan(0);
  });

  it('renders major CTAs', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /^Start with Element$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Register for Mastodon/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Download TeamSpeak/i })).toBeInTheDocument();
  });
});
