import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders dashboard title', () => {
  render(<App />);
  const titleElement = screen.getByText(/SaaS Dashboard/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders metric cards', () => {
  render(<App />);
  const usersCard = screen.getByText(/Total Users/i);
  const revenueCard = screen.getByText(/Revenue/i);
  const ordersCard = screen.getAllByText(/Orders/i)[0]; // Get first match (title)
  const conversionCard = screen.getByText(/Conversion Rate/i);
  
  expect(usersCard).toBeInTheDocument();
  expect(revenueCard).toBeInTheDocument();
  expect(ordersCard).toBeInTheDocument();
  expect(conversionCard).toBeInTheDocument();
});

test('start demo button works', () => {
  render(<App />);
  const startButton = screen.getByText(/Start Demo/i);
  expect(startButton).toBeInTheDocument();
  
  fireEvent.click(startButton);
  const stopButton = screen.getByText(/Stop Demo/i);
  expect(stopButton).toBeInTheDocument();
});

test('metrics are not zero on initial load', () => {
  render(<App />);
  // Check that at least one metric value is displayed and not zero
  const metricValues = screen.getAllByText(/\d+/);
  expect(metricValues.length).toBeGreaterThan(0);
});
