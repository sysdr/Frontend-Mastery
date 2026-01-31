import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardGrid from './DashboardGrid';

describe('DashboardGrid', () => {
  it('renders children correctly', () => {
    render(
      <DashboardGrid>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </DashboardGrid>
    );
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('applies grid container class', () => {
    const { container } = render(
      <DashboardGrid>
        <div>Test</div>
      </DashboardGrid>
    );
    expect(container.querySelector('.dashboard-grid-container')).toBeInTheDocument();
  });
});
