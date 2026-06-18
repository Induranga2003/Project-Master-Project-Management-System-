import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../pages/Login';
import { AuthProvider } from '../../context/AuthContext';

// Mock the API service
jest.mock('../../services/api', () => ({
  api: {
    post: jest.fn()
  }
}));

// Mock socket service
jest.mock('../../services/socketService', () => ({
  connectSocket: jest.fn(),
  disconnectSocket: jest.fn()
}));

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('displays email input field', () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput.type).toBe('email');
  });

  it('displays password input field', () => {
    renderWithProviders(<Login />);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput.type).toBe('password');
  });

  it('allows user to type in email field', () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('allows user to type in password field', () => {
    renderWithProviders(<Login />);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  it('shows error message for invalid email format', async () => {
    const { api } = require('../../services/api');
    api.post.mockRejectedValue({
      response: { data: { message: 'Invalid email format' } }
    });

    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('shows error message for empty fields', async () => {
    renderWithProviders(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid credentials', async () => {
    const { api } = require('../../services/api');
    const mockResponse = {
      data: {
        token: 'mock-token',
        user: {
          _id: '123',
          name: 'Test User',
          email: 'test@example.com'
        }
      }
    };
    api.post.mockResolvedValue(mockResponse);

    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('displays error message on login failure', async () => {
    const { api } = require('../../services/api');
    api.post.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } }
    });

    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('has link to registration page', () => {
    renderWithProviders(<Login />);
    const registerLink = screen.getByRole('link', { name: /register/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.getAttribute('href')).toBe('/register');
  });
});

