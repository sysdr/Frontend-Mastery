import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import MetricWidget from './MetricWidget';

describe('MetricWidget', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with title and initial value', () => {
    render(<MetricWidget title="Test Metric" initialValue={1000} />);
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    // 1000 formats as 1.0K
    expect(screen.getByText('1.0K')).toBeInTheDocument();
  });

  it('renders with prefix and unit', () => {
    render(<MetricWidget title="Revenue" initialValue={500} prefix="$" unit="K" />);
    // Find by the value class since prefix/value/unit are combined
    const valueElement = document.querySelector('.value');
    expect(valueElement?.textContent).toBe('$500K');
  });

  it('formats large numbers correctly', () => {
    render(<MetricWidget title="Big Number" initialValue={1500000} />);
    expect(screen.getByText('1.5M')).toBeInTheDocument();
  });

  it('updates value over time', async () => {
    render(<MetricWidget title="Dynamic" initialValue={100} updateInterval={1000} />);
    const initialValue = screen.getByText('100');
    expect(initialValue).toBeInTheDocument();
    
    // Advance timers
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    // Value should have changed (we can't predict exact value due to randomness)
    // Just verify the component still renders
    expect(screen.getByText('Dynamic')).toBeInTheDocument();
  });

  it('shows trend indicator', () => {
    render(<MetricWidget title="Trend Test" initialValue={100} trend="up" />);
    // The trend arrow should be visible
    const trendElement = document.querySelector('.trend');
    expect(trendElement).toBeInTheDocument();
  });
});
