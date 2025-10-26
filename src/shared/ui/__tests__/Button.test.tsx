import { render, screen, fireEvent } from "@testing-library/react";
import Button, { ButtonProps } from "../Button";
import "@testing-library/jest-dom";

describe("Button", () => {
	it("renders with default props", () => {
		render(<Button>Click me</Button>);
		const button = screen.getByRole("button", { name: /click me/i });
		expect(button).toBeInTheDocument();
		expect(button).toHaveClass("bg-primary text-primary-foreground");
		expect(button).toHaveClass("h-10 py-2 px-4");
	});

	it("applies variant and size classes correctly", () => {
		render(
			<Button variant="destructive" size="sm">
				Delete
			</Button>,
		);
		const button = screen.getByRole("button", { name: /delete/i });
		expect(button).toHaveClass("bg-destructive text-destructive-foreground");
		expect(button).toHaveClass("h-9 px-3 rounded-md");
	});

	it("handles click events", () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Submit</Button>);
		const button = screen.getByRole("button", { name: /submit/i });
		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("is disabled when the disabled prop is true", () => {
		const handleClick = vi.fn();
		render(
			<Button onClick={handleClick} disabled>
				Disabled
			</Button>,
		);
		const button = screen.getByRole("button", { name: /disabled/i });
		expect(button).toBeDisabled();
		fireEvent.click(button);
		expect(handleClick).not.toHaveBeenCalled();
	});

	it("applies custom className", () => {
		render(<Button className="custom-class">Custom</Button>);
		const button = screen.getByRole("button", { name: /custom/i });
		expect(button).toHaveClass("custom-class");
	});
});
