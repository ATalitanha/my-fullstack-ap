import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmModal from "../DeleteConfirmModal";

describe("ConfirmModal", () => {
	it("should not be visible when isOpen is false", () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn();
		render(
			<ConfirmModal isOpen={false} onCancel={onCancel} onConfirm={onConfirm} />,
		);

		expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
	});

	it("should be visible when isOpen is true", () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn();
		render(
			<ConfirmModal isOpen={true} onCancel={onCancel} onConfirm={onConfirm} />,
		);

		expect(screen.getByText("Are you sure?")).toBeInTheDocument();
	});

	it("should call onCancel when the cancel button is clicked", () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn();
		render(
			<ConfirmModal isOpen={true} onCancel={onCancel} onConfirm={onConfirm} />,
		);

		fireEvent.click(screen.getByText("Cancel"));
		expect(onCancel).toHaveBeenCalled();
	});

	it("should call onConfirm when the confirm button is clicked", () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn();
		render(
			<ConfirmModal isOpen={true} onCancel={onCancel} onConfirm={onConfirm} />,
		);

		fireEvent.click(screen.getByText("Confirm"));
		expect(onConfirm).toHaveBeenCalled();
	});

	it("should call onCancel when the escape key is pressed", () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn();
		render(
			<ConfirmModal isOpen={true} onCancel={onCancel} onConfirm={onConfirm} />,
		);

		fireEvent.keyDown(window, { key: "Escape" });
		expect(onCancel).toHaveBeenCalled();
	});

	it("should call onConfirm when the enter key is pressed", () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn();
		render(
			<ConfirmModal isOpen={true} onCancel={onCancel} onConfirm={onConfirm} />,
		);

		fireEvent.keyDown(window, { key: "Enter" });
		expect(onConfirm).toHaveBeenCalled();
	});

	it("should display a custom message and button text", () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn();
		render(
			<ConfirmModal
				isOpen={true}
				onCancel={onCancel}
				onConfirm={onConfirm}
				message="Delete this item?"
				confirmText="Delete"
			/>,
		);

		expect(screen.getByText("Delete this item?")).toBeInTheDocument();
		expect(screen.getByText("Delete")).toBeInTheDocument();
	});
});
