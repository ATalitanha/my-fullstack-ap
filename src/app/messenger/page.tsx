"use client";

import LoadingDots from "@/components/loading";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useEffect, useState, useRef, useCallback } from "react";
import Header from "@/components/ui/header";
import {
	Sparkles,
	Send,
	MessageCircle,
	Trash2,
	AlertCircle,
	CheckCircle,
} from "lucide-react";

type Message = {
	id: string | number;
	title: string;
	body: string;
};

type ResponseMessage = {
	text: string;
	type: "success" | "error" | "info";
};

export default function MessageForm() {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<ResponseMessage | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [deletingId, setDeletingId] = useState<string | number | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [toDeleteId, setToDeleteId] = useState<string | number | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const listRef = useRef<HTMLDivElement>(null);

	const showResponse = useCallback((resp: ResponseMessage) => {
		setResponse(resp);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => setResponse(null), 4000);
	}, []);

	const fetchMessages = useCallback(async () => {
		try {
			const res = await fetch("/api/message");
			const data = await res.json();
			setMessages(data || []);
		} catch {
			showResponse({ text: "❌ Error fetching messages", type: "error" });
		}
	}, [showResponse]);

	useEffect(() => {
		fetchMessages();
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [fetchMessages]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setResponse(null);

		if (!title.trim() || !body.trim()) {
			showResponse({ text: "❌ Please fill out all fields.", type: "error" });
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/message", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, body }),
			});
			const data = await res.json();
			if (res.ok) {
				showResponse({ text: "✅ Message sent successfully", type: "success" });
				setTitle("");
				setBody("");
				fetchMessages();
				setTimeout(() => {
					listRef.current?.scrollIntoView({ behavior: "smooth" });
				}, 200);
			} else {
				showResponse({
					text: `❌ Error: ${data.message || "Failed to send"}`,
					type: "error",
				});
			}
		} catch {
			showResponse({ text: "❌ Server connection error", type: "error" });
		} finally {
			setLoading(false);
		}
	};

	const onDeleteClick = (id: string | number) => {
		setToDeleteId(id);
		setDeleteModalOpen(true);
	};

	const cancelDelete = () => {
		setDeleteModalOpen(false);
		setToDeleteId(null);
	};

	const confirmDelete = async () => {
		if (toDeleteId === null) return;

		setDeletingId(toDeleteId);
		setDeleteModalOpen(false);

		try {
			let res;
			if (toDeleteId === "all") {
				res = await fetch("/api/message", {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ deleteAll: true }),
				});
			} else {
				res = await fetch("/api/message", {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id: toDeleteId }),
				});
			}

			const data = await res.json();
			if (res.ok) {
				showResponse({
					text:
						toDeleteId === "all"
							? "✅ All messages deleted"
							: "✅ Message deleted",
					type: "success",
				});
				fetchMessages();
			} else {
				showResponse({
					text: `❌ Error deleting: ${data.message || "Failed"}`,
					type: "error",
				});
			}
		} catch {
			showResponse({ text: "❌ Server connection error", type: "error" });
		} finally {
			setDeletingId(null);
			setToDeleteId(null);
		}
	};

	return (
		<>
			<Header />
			<div className="min-h-screen pt-16 bg-gray-100 dark:bg-gray-900">
				<div className="container px-4 py-12 mx-auto">
					<div className="mb-12 text-center">
						<h1 className="mb-6 text-4xl font-extrabold text-gray-800 dark:text-gray-100 md:text-5xl">
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
								Send Message
							</span>
						</h1>
						<p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
							Send and manage your messages in a beautiful and user-friendly
							environment ✨
						</p>
					</div>
					<div className="grid max-w-6xl gap-8 mx-auto lg:grid-cols-2">
						<div className="lg:col-span-1">
							<div className="p-8 bg-white border-2 border-gray-200 rounded-3xl dark:bg-gray-800 dark:border-gray-700">
								<div className="flex items-center gap-3 mb-6">
									<div className="p-2 rounded-lg bg-blue-500/10">
										<Send
											className="text-blue-600 dark:text-blue-400"
											size={24}
										/>
									</div>
									<h2 className="text-2xl font-bold text-gray-800 dark:text-white">
										Send New Message
									</h2>
								</div>
								<form onSubmit={handleSubmit} noValidate className="space-y-6">
									<div>
										<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
											Message Title
										</label>
										<div className="relative">
											<input
												type="text"
												placeholder="Enter your message title..."
												value={title}
												onChange={(e) => setTitle(e.target.value)}
												className="w-full px-4 py-3 text-gray-800 placeholder-gray-500 transition-all duration-200 bg-gray-100 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
											/>
										</div>
									</div>
									<div>
										<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
											Message Body
										</label>
										<div className="relative">
											<textarea
												placeholder="Enter your message body..."
												value={body}
												onChange={(e) => setBody(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter" && !e.shiftKey) {
														e.preventDefault();
														handleSubmit(e as unknown as React.FormEvent);
													}
												}}
												rows={4}
												className="w-full px-4 py-3 text-gray-800 placeholder-gray-500 transition-all duration-200 bg-gray-100 border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
											/>
										</div>
									</div>
									<button
										type="submit"
										disabled={loading}
										className="flex items-center justify-center w-full gap-2 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-2xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
									>
										{loading ? (
											<>
												<LoadingDots />
												Sending...
											</>
										) : (
											<>
												<Send size={20} />
												Send Message
											</>
										)}
									</button>
								</form>
							</div>
						</div>
						<div className="lg:col-span-1">
							<div className="h-full bg-white border-2 border-gray-200 rounded-3xl dark:bg-gray-800 dark:border-gray-700">
								<div className="p-6 border-b border-gray-200/60 dark:border-gray-700/60">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="p-2 rounded-lg bg-blue-500/10">
												<MessageCircle
													className="text-blue-600 dark:text-blue-400"
													size={20}
												/>
											</div>
											<div>
												<h2 className="text-xl font-bold text-gray-800 dark:text-white">
													Stored Messages
												</h2>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													{messages.length} messages
												</p>
											</div>
										</div>
										<button
											onClick={() => {
												setToDeleteId("all");
												setDeleteModalOpen(true);
											}}
											disabled={messages.length === 0 || deletingId === "all"}
											className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-all bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{deletingId === "all" ? (
												<LoadingDots />
											) : (
												<Trash2 size={16} />
											)}
											Delete All
										</button>
									</div>
								</div>
								<div ref={listRef} className="p-4 h-[500px] overflow-y-auto">
									{loading && messages.length === 0 ? (
										<div className="flex flex-col items-center justify-center h-32">
											<div className="w-8 h-8 mb-3 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
											<p className="text-gray-500 dark:text-gray-400">
												Loading...
											</p>
										</div>
									) : messages.length === 0 ? (
										<div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
											<MessageCircle size={48} className="mb-3 opacity-50" />
											<p>No messages yet</p>
											<p className="mt-1 text-sm">Send the first message!</p>
										</div>
									) : (
										<div className="space-y-4">
											{messages.map((msg) => (
												<div
													key={msg.id}
													className="p-4 transition-all bg-gray-100 border-2 border-gray-200 rounded-2xl group hover:shadow-lg dark:bg-gray-700 dark:border-gray-600"
												>
													<div className="flex items-start justify-between gap-4">
														<div className="flex-1">
															<h3 className="mb-2 text-lg font-bold text-gray-800 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
																{msg.title}
															</h3>
															<p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap dark:text-gray-300">
																{msg.body}
															</p>
														</div>
														<button
															onClick={() => onDeleteClick(msg.id)}
															disabled={deletingId === msg.id}
															className="flex-shrink-0 p-2 text-red-500 transition-colors rounded-lg hover:bg-red-100 disabled:opacity-50 dark:hover:bg-red-500/10"
															title="Delete message"
														>
															{deletingId === msg.id ? (
																<LoadingDots />
															) : (
																<Trash2 size={16} />
															)}
														</button>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{response && (
				<div
					className={`fixed bottom-6 left-6 right-6 max-w-md p-4 mx-auto border rounded-2xl shadow-2xl z-50 ${
						response.type === "success"
							? "bg-green-100 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-800 dark:text-green-200"
							: response.type === "error"
							? "bg-red-100 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-800 dark:text-red-200"
							: "bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-200"
					}`}
				>
					<div className="flex items-center gap-3">
						{response.type === "success" ? (
							<CheckCircle
								className="text-green-600 dark:text-green-400"
								size={20}
							/>
						) : response.type === "error" ? (
							<AlertCircle
								className="text-red-600 dark:text-red-400"
								size={20}
							/>
						) : (
							<MessageCircle
								className="text-blue-600 dark:text-blue-400"
								size={20}
							/>
						)}
						<span className="flex-1 font-semibold">{response.text}</span>
						<button
							onClick={() => {
								if (timeoutRef.current) clearTimeout(timeoutRef.current);
								setResponse(null);
							}}
							className="p-1 text-lg font-bold leading-none text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
						>
							&times;
						</button>
					</div>
				</div>
			)}
			<DeleteConfirmModal
				isOpen={deleteModalOpen}
				onCancel={cancelDelete}
				onConfirm={confirmDelete}
				message={
					toDeleteId === "all"
						? "Are you sure you want to delete all messages? This action is irreversible."
						: "Are you sure you want to delete this message?"
				}
			/>
		</>
	);
}
