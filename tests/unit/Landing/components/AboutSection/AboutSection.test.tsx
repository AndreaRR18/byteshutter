import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AboutSection from '../../../../../src/Landing/components/AboutSection/AboutSection';

describe('AboutSection', () => {
  it('renders heading and paragraph', () => {
    render(<AboutSection />);

    expect(screen.getByRole('heading', { name: 'About Me' })).toBeInTheDocument();
    expect(
      screen.getByText(/By the way, I'm Andrea, nice to meet you!/)
    ).toBeInTheDocument();
  });
});
