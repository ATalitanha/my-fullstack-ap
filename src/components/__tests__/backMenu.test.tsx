import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BackMenu from "../backMenu";

const mockBack = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		back: mockBack,
	}),
}));

describe("BackMenu", () => {
	it("should call router.back when clicked", () => {
		render(<BackMenu />);
		fireEvent.click(screen.getByRole("button"));
		expect(mockBack).toHaveBeenCalled();
	});
});
