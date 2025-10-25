import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CategorySelect, { CATEGORIES } from '../CategorySelect';

describe('CategorySelect', () => {
  it('should render with the initial category', () => {
    const setCategory = vi.fn();
    render(<CategorySelect category="length" setCategory={setCategory} />);

    expect(screen.getByText(CATEGORIES.find(c => c.value === 'length').label)).toBeInTheDocument();
  });

  it('should open the select menu on click', () => {
    const setCategory = vi.fn();
    render(<CategorySelect category="length" setCategory={setCategory} />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    expect(screen.getByText(CATEGORIES.find(c => c.value === 'weight').label)).toBeInTheDocument();
  });

  it('should call setCategory when a new category is selected', () => {
    const setCategory = vi.fn();
    render(<CategorySelect category="length" setCategory={setCategory} />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const weightOption = screen.getByText(CATEGORIES.find(c => c.value === 'weight').label);
    fireEvent.click(weightOption);

    expect(setCategory).toHaveBeenCalledWith('weight');
  });
});
