import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Register } from './page';
import RegisterPage from './RegisterPage';

const { mockNavigate, mockToastError, mockToastSuccess, mockedAxiosPost, mockedAxiosIsAxiosError, mockedAxiosCreate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockToastError: vi.fn(),
  mockToastSuccess: vi.fn(),
  mockedAxiosPost: vi.fn(),
  mockedAxiosIsAxiosError: vi.fn(),
  mockedAxiosCreate: vi.fn(() => ({
    post: mockedAxiosPost,
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  })),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: mockToastError,
    success: mockToastSuccess,
  },
}));

vi.mock('axios', () => ({
  default: {
    create: mockedAxiosCreate,
    post: mockedAxiosPost,
    isAxiosError: mockedAxiosIsAxiosError,
  },
}));

import axios from 'axios';

const mockedAxios = vi.mocked(axios, true);

if (typeof HTMLFormElement.prototype.requestSubmit !== 'function') {
  HTMLFormElement.prototype.requestSubmit = function requestSubmitPolyfill() {
    this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  };
}

afterEach(() => {
  cleanup();
});

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxiosIsAxiosError.mockReturnValue(false);
    vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:5000');
  });

  it('renders the registration form fields and actions', () => {
    const setAuth = vi.fn();
    const onRegister = vi.fn();

    render(
      <RegisterPage
        auth={{ username: '', email: '', password: '', confirmPassword: '' }}
        setAuth={setAuth}
        onRegister={onRegister}
        isSubmitting={false}
      />,
    );

    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('updates the auth state when the input values change', () => {
    const setAuth = vi.fn();
    const onRegister = vi.fn();

    render(
      <RegisterPage
        auth={{ username: '', email: '', password: '', confirmPassword: '' }}
        setAuth={setAuth}
        onRegister={onRegister}
        isSubmitting={false}
      />,
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i);

    fireEvent.change(usernameInput, { target: { value: 'john' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '123456' } });

    expect(setAuth).toHaveBeenCalled();
    expect(setAuth).toHaveBeenLastCalledWith({ username: '', email: '', password: '', confirmPassword: '123456' });
  });

  it('uses the provided auth props as the input values', () => {
    const setAuth = vi.fn();
    const onRegister = vi.fn();

    render(
      <RegisterPage
        auth={{ username: 'jane', email: 'jane@example.com', password: '654321', confirmPassword: '654321' }}
        setAuth={setAuth}
        onRegister={onRegister}
        isSubmitting={false}
      />,
    );

    expect(screen.getByLabelText(/username/i)).toHaveValue('jane');
    expect(screen.getByLabelText(/email/i)).toHaveValue('jane@example.com');
    expect(screen.getByLabelText(/^password$/i)).toHaveValue('654321');
    expect(screen.getByLabelText(/^confirm password$/i)).toHaveValue('654321');
  });

  it('submits the form through the provided onRegister callback', async () => {
    const user = userEvent.setup();
    const setAuth = vi.fn();
    const onRegister = vi.fn();

    render(
      <RegisterPage
        auth={{ username: '', email: '', password: '', confirmPassword: '' }}
        setAuth={setAuth}
        onRegister={onRegister}
        isSubmitting={false}
      />,
    );

    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(onRegister).toHaveBeenCalledTimes(1);
  });

  it('renders a password field with password masking and the login link target', () => {
    const setAuth = vi.fn();
    const onRegister = vi.fn();

    render(
      <RegisterPage
        auth={{ username: '', email: '', password: '', confirmPassword: '' }}
        setAuth={setAuth}
        onRegister={onRegister}
        isSubmitting={false}
      />,
    );

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i);
    const loginLink = screen.getByRole('link', { name: /login/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    expect(loginLink).toHaveAttribute('href', '/auth/login');
  });
});

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxiosIsAxiosError.mockReturnValue(false);
    vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:5000');
  });

  it('shows a validation error when required fields are empty', async () => {
    render(<Register />);

    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockToastError).toHaveBeenCalledWith('Please fill all the fields');
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('shows a validation error for invalid usernames', async () => {
    const user = userEvent.setup();

    render(<Register />);

    await user.type(screen.getByLabelText(/username/i), 'ab');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), '123456');
    await user.type(screen.getByLabelText(/^confirm password$/i), '123456');

    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockToastError).toHaveBeenCalledWith('Username must be between 3 and 30 characters');
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('shows a validation error for non-alphanumeric usernames', async () => {
    const user = userEvent.setup();

    render(<Register />);

    await user.type(screen.getByLabelText(/username/i), 'john_doe');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), '12345678');
    await user.type(screen.getByLabelText(/^confirm password$/i), '12345678');

    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockToastError).toHaveBeenCalledWith('Username can only contain letters and numbers');
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('shows a validation error for non-numeric passwords', async () => {
    const user = userEvent.setup();

    render(<Register />);

    await user.type(screen.getByLabelText(/username/i), 'johndoe');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'abcdef');
    await user.type(screen.getByLabelText(/^confirm password$/i), 'abcdef');

    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockToastError).toHaveBeenCalledWith('Password can only contain numbers');
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('shows a validation error for invalid emails', async () => {
    const user = userEvent.setup();

    render(<Register />);

    await user.type(screen.getByLabelText(/username/i), 'johndoe');
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.type(screen.getByLabelText(/^password$/i), '123456');
    await user.type(screen.getByLabelText(/^confirm password$/i), '123456');

    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockToastError).toHaveBeenCalledWith('Please enter a valid email address');
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('shows a validation error for mismatched passwords', async () => {
    const user = userEvent.setup();

    render(<Register />);

    await user.type(screen.getByLabelText(/username/i), 'johndoe');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), '12345678');
    await user.type(screen.getByLabelText(/^confirm password$/i), '12345679');

    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockToastError).toHaveBeenCalledWith('Passwords do not match');
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('submits valid credentials and navigates after a successful registration', async () => {
    const user = userEvent.setup();
    mockedAxiosPost.mockResolvedValueOnce({ status: 200, data: {} });

    render(<Register />);

    await user.type(screen.getByLabelText(/username/i), 'johndoe');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), '12345678');
    await user.type(screen.getByLabelText(/^confirm password$/i), '12345678');

    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockedAxiosPost).toHaveBeenCalledWith(
        '/api/auth/register',
        {
          username: 'johndoe',
          email: 'test@example.com',
          password: '12345678',
          confirmPassword: '12345678',
        },
      );
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Registration successful.');
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login', { replace: true });
    });
  });
});
