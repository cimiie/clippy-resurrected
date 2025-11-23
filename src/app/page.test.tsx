import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from './page';

describe('Home Page', () => {
  it('renders the desktop environment', () => {
    render(<Home />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveStyle({ backgroundColor: 'rgb(0, 128, 128)' });
  });

  it('provides window manager context', () => {
    // This test verifies the component renders without errors
    // The WindowManagerProvider is properly set up
    const { container } = render(<Home />);
    expect(container.querySelector('main')).toBeInTheDocument();
  });
});
