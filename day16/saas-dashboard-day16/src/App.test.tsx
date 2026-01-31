import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders dashboard header', () => {
    render(<App />);
    expect(screen.getByText('SaaS Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Real-time metrics with live updates')).toBeInTheDocument();
  });

  it('renders all 8 metric widgets', () => {
    render(<App />);
    expect(screen.getByText('Total Sales')).toBeInTheDocument();
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
    expect(screen.getByText('Support Tickets')).toBeInTheDocument();
    expect(screen.getByText('System Uptime')).toBeInTheDocument();
    expect(screen.getByText('Page Views')).toBeInTheDocument();
    expect(screen.getByText('Orders Today')).toBeInTheDocument();
  });

  it('displays non-zero initial values', () => {
    render(<App />);
    // Check that values are displayed (not zero) by finding value elements
    const valueElements = document.querySelectorAll('.value');
    expect(valueElements.length).toBe(8); // 8 widgets
    
    // Verify Total Sales shows ~$124.5K (prefix + value)
    expect(valueElements[0].textContent).toContain('124.5K');
    // Verify Active Users shows ~2.8K 
    expect(valueElements[2].textContent).toContain('2.8K');
    
    // Ensure no values are zero
    valueElements.forEach((el) => {
      expect(el.textContent).not.toBe('0');
      expect(el.textContent).not.toBe('$0');
    });
  });
});
