import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NetworkGlobeBackground from './NetworkGlobeBackground';

describe('NetworkGlobeBackground', () => {
  it('renders a decorative federated network with homeservers, users, and normalized traffic paths', () => {
    const { container } = render(<NetworkGlobeBackground />);
    const background = container.querySelector('.network-globe-background');
    const federationFlows = container.querySelectorAll('.network-globe__flow');
    const clientFlows = container.querySelectorAll('.network-globe__client-flow');

    expect(background).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('svg')).toHaveAttribute('focusable', 'false');
    expect(container.querySelectorAll('.network-globe__homeserver-core')).toHaveLength(8);
    expect(container.querySelectorAll('.network-globe__user-node')).toHaveLength(24);
    expect(federationFlows).toHaveLength(13);
    expect(clientFlows).toHaveLength(8);
    expect(container.querySelectorAll('.network-globe__flow--reverse').length).toBeGreaterThan(0);
    [...federationFlows, ...clientFlows].forEach((flow) => expect(flow).toHaveAttribute('pathLength', '100'));
  });
});
