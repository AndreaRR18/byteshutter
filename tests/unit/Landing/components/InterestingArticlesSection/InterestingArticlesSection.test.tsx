import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import InterestingArticlesSection from '../../../../../src/Landing/components/InterestingArticlesSection/InterestingArticlesSection';

describe('InterestingArticlesSection', () => {
  it('renders heading and links', () => {
    render(<InterestingArticlesSection />);

    expect(screen.getByRole('heading', { name: 'Interesting Articles' })).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    expect(screen.getByText('Stack overflow is almost dead')).toHaveAttribute(
      'href',
      'https://blog.pragmaticengineer.com/stack-overflow-is-almost-dead/'
    );
    expect(screen.getByText('Canon TDD')).toHaveAttribute(
      'href',
      'https://tidyfirst.substack.com/p/canon-tdd'
    );
    expect(screen.getByText('LLMs bring new nature of abstraction')).toHaveAttribute(
      'href',
      'https://martinfowler.com/articles/2025-nature-abstraction.html'
    );
  });
});
