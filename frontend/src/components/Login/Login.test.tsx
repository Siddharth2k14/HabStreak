import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Login } from './page';
import LoginPage from './LoginPage';

const { mockNavigate, mockToastError, mockToastSuccess, mockedAxiosPost, mockedAxiosIsAxiosError, mockedAxiosCreate, mockedLogin } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockToastError: vi.fn(),
  mockToastSuccess: vi.fn(),
  mockedAxiosPost: vi.fn(),
  mockedAxiosIsAxiosError: vi.fn(),
  mockedLogin: vi.fn(),
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

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ login: mockedLogin }),
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

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxiosIsAxiosError.mockReturnValue(false);
    vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:5000');
  });

  it('renders the login form fields and actions', () => {
    const setAuth = vi.fn();
    const onLogin = vi.fn();

    render(
      <LoginPage
        auth={{ email: '', password: '' }}
        setAuth={setAuth}
        onLogin={onLogin}
        isSubmitting={false}
        showResendVerification={false}
        onResendVerification={vi.fn()}
        isResending={false}
      />,
    );

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });

  it('updates the auth state when the email and password fields change', async () => {
    const setAuth = vi.fn();
    const onLogin = vi.fn();

    render(
      <LoginPage
        auth={{ email: '', password: '' }}
        setAuth={setAuth}
        onLogin={onLogin}
        isSubmitting={false}
        showResendVerification={false}
        onResendVerification={vi.fn()}
        isResending={false}
      />,
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    expect(setAuth).toHaveBeenCalled();
    expect(setAuth).toHaveBeenLastCalledWith({ email: '', password: '123456' });
  });

  it('uses the provided auth props as the input values', () => {
    const setAuth = vi.fn();
    const onLogin = vi.fn();

    render(
      <LoginPage
        auth={{ email: 'demo@example.com', password: 'abcdef' }}
        setAuth={setAuth}
        onLogin={onLogin}
        isSubmitting={false}
        showResendVerification={false}
        onResendVerification={vi.fn()}
        isResending={false}
      />,
    );

    expect(screen.getByLabelText(/email/i)).toHaveValue('demo@example.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('abcdef');
  });

  it('submits the form through the provided onLogin callback', async () => {
    const user = userEvent.setup();
    const setAuth = vi.fn();
    const onLogin = vi.fn();

    render(
      <LoginPage
        auth={{ email: '', password: '' }}
        setAuth={setAuth}
        onLogin={onLogin}
        isSubmitting={false}
        showResendVerification={false}
        onResendVerification={vi.fn()}
        isResending={false}
      />,
    );

    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(onLogin).toHaveBeenCalledTimes(1);
  });

  it('renders a password field with password masking and the register link target', () => {
    const setAuth = vi.fn();
    const onLogin = vi.fn();

    render(
      <LoginPage
        auth={{ email: '', password: '' }}
        setAuth={setAuth}
        onLogin={onLogin}
        isSubmitting={false}
        showResendVerification={false}
        onResendVerification={vi.fn()}
        isResending={false}
      />,
    );

    const passwordInput = screen.getByLabelText(/password/i);
    const registerLink = screen.getByRole('link', { name: /register/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(registerLink).toHaveAttribute('href', '/auth/register');
  });
});

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxiosIsAxiosError.mockReturnValue(false);
    vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:5000');
  });

  it('shows a validation error when fields are empty', async () => {
    render(<Login />);

    const form = screen.getByRole('button', { name: /log in/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockToastError).toHaveBeenCalledWith('Please fill all the fields');
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('shows a validation error for invalid email addresses', async () => {
    const user = userEvent.setup();

    render(<Login />);

    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.type(screen.getByLabelText(/password/i), '123456');

    const form = screen.getByRole('button', { name: /log in/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockToastError).toHaveBeenCalledWith('Please enter a valid email address');
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('shows a validation error for passwords outside the allowed length', async () => {
    const user = userEvent.setup();

    render(<Login />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), '12345');

    const form = screen.getByRole('button', { name: /log in/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockToastError).toHaveBeenCalledWith('Password must be between 8 and 32 characters');
    expect(mockedLogin).not.toHaveBeenCalled();
  });

  it('submits valid credentials and navigates after a successful login', async () => {
    const user = userEvent.setup();
    mockedLogin.mockResolvedValueOnce(undefined);

    render(<Login />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), '12345678');

    const form = screen.getByRole('button', { name: /log in/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: '12345678',
      });
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Login successful');
      expect(mockNavigate).toHaveBeenCalledWith('/home-page', { replace: true });
    });
  });
});
