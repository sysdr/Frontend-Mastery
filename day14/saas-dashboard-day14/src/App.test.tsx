import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('SaaS Dashboard - Day 14', () => {
  test('renders dashboard header', () => {
    render(<App />);
    expect(screen.getByText('SaaS Dashboard - Day 14')).toBeInTheDocument();
  });

  test('renders form with all fields', () => {
    render(<App />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
  });

  test('shows initial metrics as zero', () => {
    render(<App />);
    expect(screen.getByTestId('submission-count')).toHaveTextContent('0');
    expect(screen.getByTestId('profiles-count')).toHaveTextContent('0');
  });

  test('shows validation errors for invalid input', async () => {
    render(<App />);
    const nameInput = screen.getByLabelText(/name/i);
    
    await userEvent.type(nameInput, 'ab');
    await userEvent.tab();
    
    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toHaveTextContent('Name must be at least 3 characters');
    });
  });

  test('shows error for invalid email', async () => {
    render(<App />);
    const emailInput = screen.getByLabelText(/email/i);
    
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.tab();
    
    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toHaveTextContent('Invalid email address');
    });
  });

  test('shows error for underage user', async () => {
    render(<App />);
    const ageInput = screen.getByLabelText(/age/i);
    
    await userEvent.type(ageInput, '15');
    await userEvent.tab();
    
    await waitFor(() => {
      expect(screen.getByTestId('age-error')).toHaveTextContent('You must be at least 18 years old');
    });
  });

  test('submits form with valid data and updates metrics', async () => {
    render(<App />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const ageInput = screen.getByLabelText(/age/i);
    
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(ageInput, '25');
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save profile/i })).not.toBeDisabled();
    });
    
    const submitButton = screen.getByRole('button', { name: /save profile/i });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('submission-count')).toHaveTextContent('1');
      expect(screen.getByTestId('profiles-count')).toHaveTextContent('1');
    });
  });

  test('displays submitted profile card', async () => {
    render(<App />);
    
    await userEvent.type(screen.getByLabelText(/name/i), 'Jane Smith');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@test.com');
    await userEvent.type(screen.getByLabelText(/age/i), '30');
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save profile/i })).not.toBeDisabled();
    });
    
    await userEvent.click(screen.getByRole('button', { name: /save profile/i }));
    
    await waitFor(() => {
      expect(screen.getByTestId('profile-card')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@test.com')).toBeInTheDocument();
    });
  });

  test('live preview updates as user types', async () => {
    render(<App />);
    
    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.type(nameInput, 'Test User');
    
    expect(screen.getByText(/Test User/)).toBeInTheDocument();
  });
});
