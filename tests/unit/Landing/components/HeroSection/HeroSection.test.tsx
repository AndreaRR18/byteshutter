import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HeroSection from '../../../../../src/Landing/components/HeroSection/HeroSection';

const heroImage = 'hero.jpg';

describe('HeroSection', () => {
  it('renders heading and description', () => {
    render(<HeroSection heroImage={heroImage} />);

    expect(
      screen.getByText('Hey there, web surfer! Welcome to this little corner of the internet.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No analytics, no tracking, just a private place to explore./)
    ).toBeInTheDocument();
  });

  it('renders the hero image with correct src and alt', () => {
    render(<HeroSection heroImage={heroImage} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', heroImage);
    expect(img).toHaveAttribute('alt', 'Hero - Tech and Photography');
  });

  it('updates hero image when prop changes', () => {
    const { rerender } = render(<HeroSection heroImage={heroImage} />);

    const newImage = 'new-hero.jpg';
    rerender(<HeroSection heroImage={newImage} />);

    expect(screen.getByRole('img')).toHaveAttribute('src', newImage);
  });
});
