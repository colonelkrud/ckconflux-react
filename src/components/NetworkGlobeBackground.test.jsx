import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NetworkGlobeBackground from './NetworkGlobeBackground';

describe('NetworkGlobeBackground', () => {
  it('renders as decorative content with lightweight SVG flow routes', () => {
    const { container } = render(<NetworkGlobeBackground />);
    const background = container.querySelector('.network-globe-background');

    expect(background).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('svg')).toHaveAttribute('focusable', 'false');
    expect(container.querySelectorAll('.network-globe__flow')).toHaveLength(4);
    expect(container.querySelectorAll('.network-globe__node')).toHaveLength(8);
  });
});
