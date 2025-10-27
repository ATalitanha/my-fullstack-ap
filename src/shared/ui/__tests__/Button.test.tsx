import { render, screen, fireEvent } from "@testing-library/react";
import Button, { ButtonProps } from "../Button";
import "@testing-library/jest-dom";

describe("Button Component", () => {
	it("should render with default props correctly", () => {
		render(<Button>Default Button</Button>);
		const button = screen.getByRole("button", { name: /Default Button/i });
		expect(button).toBeInTheDocument();
		expect(button).toHaveClass("bg-primary text-primary-foreground");
		expect(button).toHaveClass("h-10 py-2 px-4");
	});

	const variants: Array<ButtonProps["variant"]> = [
		"default",
		"destructive",
		"outline",
		"secondary",
		"ghost",
		"link",
	];

	// Test each variant
	variants.forEach((variant) => {
		it(`should apply correct classes for variant: ${variant}`, () => {
			render(<Button variant={variant}>{variant}</Button>);
			const button = screen.getByRole("button", { name: new RegExp(variant || "default", "i") });
			// Add specific class checks based on cva
			if (variant === "destructive") {
				expect(button).toHaveClass("bg-destructive", "text-destructive-foreground");
			} else if (variant === "outline") {
				expect(button).toHaveClass("border", "border-input");
			}
			// Add more checks for other variants if needed
		});
	});

	const sizes: Array<ButtonProps["size"]> = ["default", "sm", "lg"];

	// Test each size
	sizes.forEach((size) => {
		it(`should apply correct classes for size: ${size}`, () => {
			render(<Button size={size}>{size}</Button>);
			const button = screen.getByRole("button", { name: new RegExp(size || "default", "i") });
			if (size === "sm") {
				expect(button).toHaveClass("h-9", "px-3", "rounded-md");
			} else if (size === "lg") {
				expect(button).toHaveClass("h-11", "px-8", "rounded-md");
			} else {
				expect(button).toHaveClass("h-10", "py-2", "px-4");
			}
		});
	});

	it("should handle click events", () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Clickable</Button>);
		const button = screen.getByRole("button", { name: /Clickable/i });
		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("should be disabled when the disabled prop is true", () => {
		const handleClick = vi.fn();
		render(
			<Button onClick={handleClick} disabled>
				Disabled Button
			</Button>,
		);
		const button = screen.getByRole("button", { name: /Disabled Button/i });
		expect(button).toBeDisabled();
		fireEvent.click(button);
		expect(handleClick).not.toHaveBeenCalled();
	});

	it("should apply custom className", () => {
		render(<Button className="extra-class">Custom</Button>);
		const button = screen.getByRole("button", { name: /Custom/i });
		expect(button).toHaveClass("extra-class");
	});
});
