"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
	isOpen: boolean;
	onCancel: () => void;
	onConfirm: () => void;
	title?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
}

/**
 * A modal dialog to confirm a delete action.
 * It overlays the screen and requires the user to confirm or cancel.
 * @param {DeleteConfirmModalProps} props - The component props.
 * @returns {JSX.Element | null} The modal component or null if not open.
 */
export default function DeleteConfirmModal({
	isOpen,
	onCancel,
	onConfirm,
	title = "تایید حذف",
	message = "آیا از انجام این عمل مطمئن هستید؟ این عمل غیرقابل بازگشت است.",
	confirmText = "حذف کن",
	cancelText = "انصراف",
}: DeleteConfirmModalProps) {
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onCancel();
			} else if (e.key === "Enter") {
				onConfirm();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onCancel, onConfirm]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
			onClick={onCancel}
			role="dialog"
			aria-modal="true"
			aria-labelledby="confirm-dialog-title"
		>
			<div
				className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-gray-800"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex flex-col items-center text-center">
					<div className="p-3 mb-4 bg-red-100 rounded-full dark:bg-red-900/50">
						<AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
					</div>
					<h2
						id="confirm-dialog-title"
						className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100"
					>
						{title}
					</h2>
					<p className="mb-6 text-gray-600 dark:text-gray-300">{message}</p>
				</div>
				<div className="flex justify-center gap-4">
					<button
						onClick={onCancel}
						className="flex-1 px-6 py-2 font-semibold text-gray-800 transition-colors bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
					>
						{cancelText}
					</button>
					<button
						onClick={onConfirm}
						className="flex-1 px-6 py-2 font-semibold text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
}
