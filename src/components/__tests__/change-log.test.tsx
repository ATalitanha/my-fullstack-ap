import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ChangeLog } from '../change-log';
import * as db from '@/lib/db';

const mockChangeLogs = [
  { version: '1.0.0', changes: ['Initial release'] },
  { version: '1.0.1', changes: ['Bug fixes'] },
];

vi.mock('@/lib/db', () => ({
  getChangeLogs: vi.fn(() => mockChangeLogs),
}));

// Mock window.scrollTo
window.scrollTo = vi.fn();

describe('ChangeLog', () => {
  it('should not be visible when isOpen is false', () => {
    const onClose = vi.fn();
    render(<ChangeLog isOpen={false} onClose={onClose} />);
    expect(screen.queryByText('Change Log')).not.toBeInTheDocument();
  });

  it('should be visible when isOpen is true', () => {
    const onClose = vi.fn();
    render(<ChangeLog isOpen={true} onClose={onClose} />);
    expect(screen.getByText('Change Log')).toBeInTheDocument();
  });

  it('should call onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<ChangeLog isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should display the changelogs', () => {
    const onClose = vi.fn();
    render(<ChangeLog isOpen={true} onClose={onClose} />);
    expect(screen.getByText('Version 1.0.0')).toBeInTheDocument();
    expect(screen.getByText('Version 1.0.1')).toBeInTheDocument();
  });

  it('should expand and collapse the accordion', async () => {
    const onClose = vi.fn();
    render(<ChangeLog isOpen={true} onClose={onClose} />);

    // Initially, the content is not visible
    expect(screen.queryByText('- Initial release')).not.toBeInTheDocument();

    // Click to expand
    await act(async () => {
      fireEvent.click(screen.getByText('Version 1.0.0'));
    });
    await screen.findByText('- Initial release');
    expect(screen.getByText('- Initial release')).toBeInTheDocument();

    // Click to collapse
    await act(async () => {
      fireEvent.click(screen.getByText('Version 1.0.0'));
    });
    await vi.waitFor(() => {
      expect(screen.queryByText('- Initial release')).not.toBeInTheDocument();
    });
  });
});
