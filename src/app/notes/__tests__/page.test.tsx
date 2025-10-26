import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NotesPage from "../page";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

vi.mock("lucide-react", () => ({
	Sparkles: () => <div data-testid="sparkles-icon" />,
	Plus: () => <div data-testid="plus-icon" />,
	Edit3: () => <div data-testid="edit-icon" />,
	Trash2: () => <div data-testid="trash-icon" />,
	FileText: () => <div data-testid="file-text-icon" />,
	AlertCircle: () => <div data-testid="alert-icon" />,
	CheckCircle: () => <div data-testid="check-circle-icon" />,
	X: () => <div data-testid="x-icon" />,
	ArrowLeft: () => <div data-testid="arrow-left-icon" />,
	Sun: () => <div data-testid="sun-icon" />,
	Moon: () => <div data-testid="moon-icon" />,
}));

vi.mock("framer-motion", () => ({
	motion: {
		div: ({ children, ...props }) => <div {...props}>{children}</div>,
		button: ({ children, ...props }) => <button {...props}>{children}</button>,
		a: ({ children, ...props }) => <a {...props}>{children}</a>,
		h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
		p: ({ children, ...props }) => <p {...props}>{children}</p>,
	},
	AnimatePresence: ({ children }) => <>{children}</>,
}));

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

const mockFetch = vi.fn();
global.fetch = mockFetch;
global.atob = (str: string) => Buffer.from(str, "base64").toString("binary");

const mockNotes = [
	{
		id: "1",
		title: "Test Note 1",
		content: "Content 1",
		createdAt: new Date().toISOString(),
	},
	{
		id: "2",
		title: "Test Note 2",
		content: "Content 2",
		createdAt: new Date().toISOString(),
	},
];

describe("NotesPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should fetch and display notes", async () => {
		const accessToken = `.${btoa(JSON.stringify({ id: "1", username: "testuser" }))}.`;
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ accessToken }),
		});
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ notes: mockNotes }),
		});

		render(<NotesPage />);

		await screen.findByText("Test Note 1");
		expect(screen.getByText("Test Note 2")).toBeInTheDocument();
	});

	it("should create a new note", async () => {
		const accessToken = `.${btoa(JSON.stringify({ id: "1", username: "testuser" }))}.`;
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ accessToken }),
		});
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ notes: [] }),
		});
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () =>
				Promise.resolve({
					note: {
						id: "3",
						title: "New Note",
						content: "New Content",
						createdAt: new Date().toISOString(),
					},
				}),
		});
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () =>
				Promise.resolve({
					notes: [
						{
							id: "3",
							title: "New Note",
							content: "New Content",
							createdAt: new Date().toISOString(),
						},
					],
				}),
		});

		render(<NotesPage />);

		await waitFor(() => {
			expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
		});

		fireEvent.change(screen.getByPlaceholderText("Enter note title..."), {
			target: { value: "New Note" },
		});
		fireEvent.change(
			screen.getByPlaceholderText("Write your note content..."),
			{
				target: { value: "New Content" },
			},
		);
		fireEvent.submit(screen.getByRole("button", { name: /Add Note/i }));

		await screen.findByText("✅ Note added");
		await screen.findByText("New Note");
	});

	it("should delete a note", async () => {
		const accessToken = `.${btoa(JSON.stringify({ id: "1", username: "testuser" }))}.`;
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ accessToken }),
		});
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ notes: mockNotes }),
		});
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({}),
		});
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ notes: [mockNotes[1]] }),
		});

		render(<NotesPage />);

		await screen.findByText("Test Note 1");

		fireEvent.click(screen.getAllByTitle("Delete note")[0]);
		fireEvent.click(screen.getByText("Delete"));

		await screen.findByText("✅ Note deleted");
		expect(screen.queryByText("Test Note 1")).not.toBeInTheDocument();
	});
});
