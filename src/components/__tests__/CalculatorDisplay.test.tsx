import { render, screen } from '@testing-library/react';
import CalculatorDisplay from '../CalculatorDisplay';

describe('CalculatorDisplay', () => {
  it('renders the expression and result correctly', () => {
    render(
      <CalculatorDisplay
        first="10"
        op="+"
        second="5"
        result="15"
      />
    );

    // Check if the numbers, operator, and result are displayed
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('= 15')).toBeInTheDocument();

    // Check the title attribute for the full expression
    const displayElement = screen.getByTitle('10 + 5 = 15');
    expect(displayElement).toBeInTheDocument();
  });

  it('handles the square root operator correctly', () => {
    render(
      <CalculatorDisplay
        first="25"
        op="√"
        second=""
        result="5"
      />
    );

    // Check if the number, operator, and result are displayed
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('√')).toBeInTheDocument();
    expect(screen.getByText('= 5')).toBeInTheDocument();

    // The second number should not be rendered
    expect(screen.queryByText(' ')).not.toBeInTheDocument();

    // Check the title attribute for the full expression
    const displayElement = screen.getByTitle('25 √ = 5');
    expect(displayElement).toBeInTheDocument();
  });
});
