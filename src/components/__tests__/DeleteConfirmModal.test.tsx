import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '../DeleteConfirmModal';

describe('ConfirmModal', () => {
  const onCancel = jest.fn();
  const onConfirm = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    onCancel.mockClear();
    onConfirm.mockClear();
  });

  it('does not render when isOpen is false', () => {
    render(
      <ConfirmModal
        isOpen={false}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );
    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('calls onCancel when the cancel button is clicked', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when the confirm button is clicked', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );
    fireEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the Escape key is pressed', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when the Enter key is pressed', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );
    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
