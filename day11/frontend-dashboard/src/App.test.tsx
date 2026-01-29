import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { useAppStore } from './store';

beforeEach(() => {
  useAppStore.setState({ theme: 'light', themeTogglesCount: 0, notificationTogglesCount: 0, totalActions: 0 });
});

test('renders SaaS Dashboard title', () => {
  render(<App />);
  const title = screen.getByText(/SaaS Dashboard/i);
  expect(title).toBeInTheDocument();
});

test('renders dashboard metrics', () => {
  render(<App />);
  expect(screen.getByText(/Theme Toggles:/i)).toBeInTheDocument();
  expect(screen.getByText(/Total Actions:/i)).toBeInTheDocument();
});
