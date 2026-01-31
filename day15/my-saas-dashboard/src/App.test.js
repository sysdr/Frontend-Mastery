import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App';
import { useUserProfileStore } from './stores/userProfileStore';

// Clean up between tests to reset state
beforeEach(() => {
  // Reset Zustand store before each test
  useUserProfileStore.getState().reset();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

describe('SaaS Dashboard', () => {
  test('renders SaaS Dashboard header', () => {
    render(<App />);
    const headerElement = screen.getByRole('heading', { level: 1, name: /SaaS Dashboard/i });
    expect(headerElement).toBeInTheDocument();
  });

  test('renders Overview panel', () => {
    render(<App />);
    const overviewPanel = screen.getByRole('heading', { level: 2, name: /Overview/i });
    expect(overviewPanel).toBeInTheDocument();
  });

  test('renders User Profile panel', () => {
    render(<App />);
    const userProfilePanel = screen.getByRole('heading', { level: 2, name: /User Profile/i });
    expect(userProfilePanel).toBeInTheDocument();
  });

  test('renders Settings panel', () => {
    render(<App />);
    const settingsPanel = screen.getByRole('heading', { level: 2, name: /Settings/i });
    expect(settingsPanel).toBeInTheDocument();
  });

  test('renders theme toggle button', () => {
    render(<App />);
    const themeButton = screen.getByText(/Switch to Dark Mode/i);
    expect(themeButton).toBeInTheDocument();
  });

  test('renders login button when not logged in', () => {
    render(<App />);
    const loginButton = screen.getByRole('button', { name: /^Login$/i });
    expect(loginButton).toBeInTheDocument();
  });

  test('toggles theme when button is clicked', () => {
    render(<App />);
    const themeButton = screen.getByText(/Switch to Dark Mode/i);
    fireEvent.click(themeButton);
    expect(screen.getByText(/Switch to Light Mode/i)).toBeInTheDocument();
  });

  test('shows user info after login', () => {
    render(<App />);
    const loginButton = screen.getByRole('button', { name: /^Login$/i });
    fireEvent.click(loginButton);
    expect(screen.getByText(/Welcome, Alice Smith!/i)).toBeInTheDocument();
  });

  test('shows logout button and user details after login', () => {
    render(<App />);
    const loginButton = screen.getByRole('button', { name: /^Login$/i });
    fireEvent.click(loginButton);
    expect(screen.getByText(/alice@example.com/i)).toBeInTheDocument();
    const logoutButtons = screen.getAllByRole('button', { name: /^Logout$/i });
    expect(logoutButtons.length).toBeGreaterThan(0);
  });
});
