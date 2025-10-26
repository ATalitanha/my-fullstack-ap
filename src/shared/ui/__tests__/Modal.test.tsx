import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';
import '@testing-library/jest-dom';

describe('Modal', () => {
  const ModalTestComponent = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Test Modal">
      <p>This is the modal content.</p>
    </Modal>
  );

  it('does not render when isOpen is false', () => {
    const handleClose = vi.fn();
    render(<ModalTestComponent isOpen={false} onClose={handleClose} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the title and children when isOpen is true', () => {
    const handleClose = vi.fn();
    render(<ModalTestComponent isOpen={true} onClose={handleClose} />);

    // Headless UI renders the dialog role
    const dialog = screen.getByRole('dialog', { hidden: false });
    expect(dialog).toBeVisible();

    // Check for title and children
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('This is the modal content.')).toBeInTheDocument();
  });

  it('calls onClose when the escape key is pressed', () => {
    const handleClose = vi.fn();
    render(<ModalTestComponent isOpen={true} onClose={handleClose} />);

    const dialog = screen.getByRole('dialog');

    // Simulate pressing the Escape key
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
