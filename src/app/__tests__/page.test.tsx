import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../page';

// Mock the ThemeToggle and ChangeLog components as they are not the focus of this test
jest.mock('@/components/ThemeToggle', () => () => <div data-testid="theme-toggle" />);
jest.mock('@/components/change-log', () => ({
  ChangeLog: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? <div data-testid="change-log" onClick={onClose} /> : null,
}));

describe('HomePage', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('renders the main heading and welcome message', () => {
    render(<HomePage />);
    // Use getByRole to handle text split across elements
    expect(screen.getByRole('heading', { name: /به TanhaApp خوش آمدید/i })).toBeInTheDocument();
    expect(screen.getByText(/مجموعه ای کامل از ابزارهای کاربردی/i)).toBeInTheDocument();
  });

  it('renders the search input and allows typing', () => {
    render(<HomePage />);
    const searchInput = screen.getByPlaceholderText('جستجوی ابزارها...');
    expect(searchInput).toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: 'ماشین حساب' } });
    expect(searchInput).toHaveValue('ماشین حساب');
  });

  it('filters the links based on search term', async () => {
    render(<HomePage />);
    const searchInput = screen.getByPlaceholderText('جستجوی ابزارها...');

    // Initially, all links should be visible
    expect(screen.getByText('ماشین حساب')).toBeInTheDocument();
    expect(screen.getByText('انتقال متن')).toBeInTheDocument();

    // Search for "ماشین حساب"
    fireEvent.change(searchInput, { target: { value: 'ماشین حساب' } });

    // "ماشین حساب" should be visible
    expect(screen.getByText('ماشین حساب')).toBeInTheDocument();

    // Wait for "انتقال متن" to be removed after animation
    await waitFor(() => {
      expect(screen.queryByText('انتقال متن')).not.toBeInTheDocument();
    });
  });

  it('shows "not found" message when no links match the search', () => {
    render(<HomePage />);
    const searchInput = screen.getByPlaceholderText('جستجوی ابزارها...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent tool' } });

    expect(screen.getByText('نتیجه ای یافت نشد')).toBeInTheDocument();
  });

  it('opens and closes the change log modal', () => {
    render(<HomePage />);
    const openButton = screen.getByText('تغییرات نسخه');

    // Modal should not be visible initially
    expect(screen.queryByTestId('change-log')).not.toBeInTheDocument();

    // Open the modal
    fireEvent.click(openButton);
    expect(screen.getByTestId('change-log')).toBeInTheDocument();

    // Close the modal (simulating a click on the modal's close functionality)
    fireEvent.click(screen.getByTestId('change-log'));
    expect(screen.queryByTestId('change-log')).not.toBeInTheDocument();
  });
});
