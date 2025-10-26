"use client";

import LoadingDots from "@/components/loading";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
	const [formTouched, setFormTouched] = useState(false);
	const [touchedTitle, setTouchedTitle] = useState(false);
	const [touchedBody, setTouchedBody] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	const showResponse = useCallback((resp: ResponseMessage) => {
		setResponse(resp);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => setResponse(null), 4000);
	}, []);

	const fetchMessages = useCallback(async () => {
		try {
			const res = await fetch("/api/massage");
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
		setFormTouched(true);
		setTouchedTitle(true);
		setTouchedBody(true);
		setResponse(null);

		if (!title.trim() || !body.trim()) {
			showResponse({ text: "❌ Please fill out all fields.", type: "error" });
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/massage", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, body }),
			});
			const data = await res.json();
			if (res.ok) {
				showResponse({ text: "✅ Message sent successfully", type: "success" });
				setTitle("");
				setBody("");
				setFormTouched(false);
				setTouchedTitle(false);
				setTouchedBody(false);
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
				res = await fetch("/api/massage", {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ deleteAll: true }),
				});
			} else {
				res = await fetch("/api/massage", {
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
			<div
				className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
				style={{
					background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.15) 0%, transparent 80%)`,
				}}
			/>
			<div className="min-h-screen pt-16 transition-colors duration-700 relative z-10 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
					<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
				</div>
				<div className="container mx-auto px-4 py-12 relative z-10">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center mb-12"
					>
						<motion.div
							whileHover={{ scale: 1.02 }}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm mb-6"
						>
							<Sparkles size={16} />
							<span>Messaging and Management System</span>
						</motion.div>
						<h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 leading-tight">
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
								Send Message
							</span>
						</h1>
						<p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
							Send and manage your messages in a beautiful and user-friendly
							environment ✨
						</p>
					</motion.div>
					<div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							className="lg:col-span-1"
						>
							<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 p-8">
								<div className="flex items-center gap-3 mb-6">
									<div className="p-2 bg-blue-500/10 rounded-lg">
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
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Message Title
										</label>
										<div className="relative">
											<input
												type="text"
												placeholder="Enter your message title..."
												value={title}
												onChange={(e) => setTitle(e.target.value)}
												onBlur={() => setTouchedTitle(true)}
												className="w-full px-4 py-3 rounded-2xl bg-white/80 dark:bg-gray-700/80 border border-white/40 dark:border-gray-600/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
												aria-invalid={
													(touchedTitle || formTouched) && !title.trim()
												}
												aria-describedby="title-error"
											/>
										</div>
										<AnimatePresence>
											{(touchedTitle || formTouched) && !title.trim() && (
												<motion.p
													initial={{ opacity: 0, height: 0 }}
													animate={{ opacity: 1, height: "auto" }}
													exit={{ opacity: 0, height: 0 }}
													id="title-error"
													className="text-red-600 text-sm mt-2 flex items-center gap-1"
													role="alert"
												>
													<AlertCircle size={16} />
													Please enter a title.
												</motion.p>
											)}
										</AnimatePresence>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Message Body
										</label>
										<div className="relative">
											<textarea
												placeholder="Enter your message body..."
												value={body}
												onChange={(e) => setBody(e.target.value)}
												onBlur={() => setTouchedBody(true)}
												onKeyDown={(e) => {
													if (e.key === "Enter" && !e.shiftKey) {
														e.preventDefault();
														handleSubmit(e as unknown as React.FormEvent);
													}
												}}
												rows={4}
												className="w-full px-4 py-3 rounded-2xl bg-white/80 dark:bg-gray-700/80 border border-white/40 dark:border-gray-600/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-all duration-200"
												aria-invalid={
													(touchedBody || formTouched) && !body.trim()
												}
												aria-describedby="body-error"
											/>
										</div>
										<AnimatePresence>
											{(touchedBody || formTouched) && !body.trim() && (
												<motion.p
													initial={{ opacity: 0, height: 0 }}
													animate={{ opacity: 1, height: "auto" }}
													exit={{ opacity: 0, height: 0 }}
													id="body-error"
													className="text-red-600 text-sm mt-2 flex items-center gap-1"
													role="alert"
												>
													<AlertCircle size={16} />
													Please enter a message body.
												</motion.p>
											)}
										</AnimatePresence>
									</div>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										type="submit"
										disabled={loading}
										className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
									</motion.button>
								</form>
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							className="lg:col-span-1"
						>
							<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 h-full">
								<div className="p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-t-3xl">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-blue-500/10 rounded-lg">
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
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={() => {
												setToDeleteId("all");
												setDeleteModalOpen(true);
											}}
											disabled={messages.length === 0 || deletingId === "all"}
											className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
										>
											{deletingId === "all" ? (
												<LoadingDots />
											) : (
												<Trash2 size={16} />
											)}
											Delete All
										</motion.button>
									</div>
								</div>
								<div ref={listRef} className="p-4 h-[500px] overflow-y-auto">
									{loading && messages.length === 0 ? (
										<div className="flex flex-col items-center justify-center h-32">
											<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
											<p className="text-gray-500 dark:text-gray-400">
												Loading...
											</p>
										</div>
									) : messages.length === 0 ? (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400"
										>
											<MessageCircle size={48} className="mb-3 opacity-50" />
											<p>No messages yet</p>
											<p className="text-sm mt-1">Send the first message!</p>
										</motion.div>
									) : (
										<div className="space-y-4">
											<AnimatePresence>
												{messages.map((msg, index) => (
													<motion.div
														key={msg.id}
														initial={{ opacity: 0, y: 10 }}
														animate={{ opacity: 1, y: 0 }}
														exit={{ opacity: 0, y: -10 }}
														transition={{ delay: index * 0.1 }}
														className="p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 border border-white/40 dark:border-gray-600/40 hover:shadow-lg transition-all group"
													>
														<div className="flex justify-between items-start gap-4">
															<div className="flex-1">
																<h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
																	{msg.title}
																</h3>
																<p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
																	{msg.body}
																</p>
															</div>
															<motion.button
																whileHover={{ scale: 1.1 }}
																whileTap={{ scale: 0.9 }}
																onClick={() => onDeleteClick(msg.id)}
																disabled={deletingId === msg.id}
																className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
																title="Delete message"
															>
																{deletingId === msg.id ? (
																	<LoadingDots />
																) : (
																	<Trash2 size={16} />
																)}
															</motion.button>
														</div>
													</motion.div>
												))}
											</AnimatePresence>
										</div>
									)}
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
			<AnimatePresence>
				{response && (
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						className={`fixed bottom-6 left-6 right-6 max-w-md mx-auto rounded-2xl p-4 shadow-2xl backdrop-blur-lg border z-50 ${
							response.type === "success"
								? "bg-green-50/90 dark:bg-green-900/90 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
								: response.type === "error"
									? "bg-red-50/90 dark:bg-red-900/90 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
									: "bg-blue-50/90 dark:bg-blue-900/90 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
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
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={() => {
									if (timeoutRef.current) clearTimeout(timeoutRef.current);
									setResponse(null);
								}}
								className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-bold text-lg leading-none p-1"
							>
								&times;
							</motion.button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
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
