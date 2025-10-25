import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryList from '../HistoryList';
import { HistoryItem } from '@/hooks/useCalculatorHistory';

describe('HistoryList', () => {
  const mockHistory: HistoryItem[] = [
    { id: '1', expression: '2+2', result: '4', createdAt: new Date().toISOString() },
    { id: '2', expression: '3*3', result: '9', createdAt: new Date().toISOString() },
  ];

  it('should render the loading state', () => {
    const onClear = vi.fn();
    render(<HistoryList history={[]} loading={true} onClear={onClear} />);

    expect(screen.getByTestId('loading-dots')).toBeInTheDocument();
  });

  it('should render the empty state', () => {
    const onClear = vi.fn();
    render(<HistoryList history={[]} loading={false} onClear={onClear} />);

    expect(screen.getByText('هیچ تاریخی وجود ندارد.')).toBeInTheDocument();
  });

  it('should render the history items', () => {
    const onClear = vi.fn();
    render(<HistoryList history={mockHistory} loading={false} onClear={onClear} />);

    expect(screen.getByText('2+2 = 4')).toBeInTheDocument();
    expect(screen.getByText('3*3 = 9')).toBeInTheDocument();
  });

  it('should call onClear when the clear button is clicked', () => {
    const onClear = vi.fn();
    render(<HistoryList history={mockHistory} loading={false} onClear={onClear} />);

    fireEvent.click(screen.getByText('پاک‌کردن تاریخچه'));
    expect(onClear).toHaveBeenCalled();
  });
});
