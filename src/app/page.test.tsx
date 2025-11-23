import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from './page';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Windows 95 Emulator');
  });

  it('displays coming soon message', () => {
    render(<Home />);
    expect(screen.getByText('Coming soon...')).toBeInTheDocument();
  });
});
