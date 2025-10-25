import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSwitcher from '../ThemeToggle';

// Mock browser APIs that are not available in JSDOM
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
});

describe('ThemeSwitcher', () => {
  it('renders the sun icon by default', () => {
    render(<ThemeSwitcher />);
    // Use a more robust selector to find the button, then check its content
    const button = screen.getByRole('button', { name: /تغییر تم/i });
    // Check for an element with the class 'lucide-sun' within the button
    const sunIcon = button.querySelector('.lucide-sun');
    expect(sunIcon).toBeInTheDocument();
  });

  it('toggles to the moon icon on click', () => {
    render(<ThemeSwitcher />);
    const button = screen.getByRole('button', { name: /تغییر تم/i });
    fireEvent.click(button);
    // After clicking, check for the moon icon
    const moonIcon = button.querySelector('.lucide-moon');
    expect(moonIcon).toBeInTheDocument();
  });
});
