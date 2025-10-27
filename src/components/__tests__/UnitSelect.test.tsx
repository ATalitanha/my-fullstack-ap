import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UnitSelect from '../UnitSelect';
import { Unit } from '@/lib/type';

const mockUnits: Unit[] = [
  { category: 'length', label: 'Meters', value: 'm' },
  { category: 'length', label: 'Centimeters', value: 'cm' },
];

describe('UnitSelect', () => {
  it('should render with the initial unit', () => {
    const setValue = vi.fn();
    render(<UnitSelect value="m" setValue={setValue} units={mockUnits} />);

    expect(screen.getByText('Meters')).toBeInTheDocument();
  });

  it('should open the select menu on click', () => {
    const setValue = vi.fn();
    render(<UnitSelect value="m" setValue={setValue} units={mockUnits} />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    expect(screen.getByText('Centimeters')).toBeInTheDocument();
  });

  it('should call setValue when a new unit is selected', () => {
    const setValue = vi.fn();
    render(<UnitSelect value="m" setValue={setValue} units={mockUnits} />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const cmOption = screen.getByText('Centimeters');
    fireEvent.click(cmOption);

    expect(setValue).toHaveBeenCalledWith('cm');
  });
});
