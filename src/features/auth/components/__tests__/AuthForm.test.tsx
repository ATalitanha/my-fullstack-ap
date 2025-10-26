import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthForm from '../AuthForm';
import { useAuth } from '../../hooks/useAuth';

vi.mock('../../hooks/useAuth');

const mockLogin = vi.fn();
const mockSignup = vi.fn();

describe('AuthForm', () => {
  beforeEach(() => {
    (useAuth as vi.Mock).mockReturnValue({
      login: mockLogin,
      signup: mockSignup,
      isLoading: false,
      error: null,
    });
  });

  it('should render the login form', () => {
    render(<AuthForm isLogin={true} />);
    expect(screen.getByPlaceholderText('ایمیل')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('رمز عبور')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('نام کاربری')).not.toBeInTheDocument();
  });

  it('should render the signup form', () => {
    render(<AuthForm isLogin={false} />);
    expect(screen.getByPlaceholderText('نام کاربری')).toBeInTheDocument();
  });

  it('should call the login function on form submission', () => {
    render(<AuthForm isLogin={true} />);
    fireEvent.submit(screen.getByRole('button'));
    expect(mockLogin).toHaveBeenCalled();
  });

  it('should call the signup function on form submission', () => {
    render(<AuthForm isLogin={false} />);
    fireEvent.submit(screen.getByRole('button'));
    expect(mockSignup).toHaveBeenCalled();
  });

  it('should display an error message', () => {
    (useAuth as vi.Mock).mockReturnValue({
      login: mockLogin,
      signup: mockSignup,
      isLoading: false,
      error: 'Test error',
    });
    render(<AuthForm isLogin={true} />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('should display the loading state', () => {
    (useAuth as vi.Mock).mockReturnValue({
      login: mockLogin,
      signup: mockSignup,
      isLoading: true,
      error: null,
    });
    render(<AuthForm isLogin={true} />);
    expect(screen.getByText('در حال بارگذاری...')).toBeInTheDocument();
  });
});
