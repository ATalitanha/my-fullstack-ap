"use client";

import LoadingDots from "@/components/loading";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useEffect, useState, useRef, useCallback } from "react";
import Header from "@/components/ui/header";
import { Send, MessageCircle, Trash2, AlertCircle, CheckCircle } from "lucide-react";

type Message = {
	id: string | number;
	title: string;
	body: string;
};

type ResponseMessage = {
	text: string;
	type: "success" | "error";
};

export default function MessengerPage() {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<ResponseMessage | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [toDeleteId, setToDeleteId] = useState<string | number | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
			showResponse({ text: "❌ خطا در دریافت پیام‌ها", type: "error" });
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
		if (!title.trim() || !body.trim()) {
			showResponse({ text: "❌ لطفاً تمام فیلدها را پر کنید.", type: "error" });
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
				showResponse({ text: "✅ پیام با موفقیت ارسال شد", type: "success" });
				setTitle("");
				setBody("");
				fetchMessages();
			} else {
				showResponse({ text: `❌ خطا: ${data.message || "ارسال ناموفق"}`, type: "error" });
			}
		} catch {
			showResponse({ text: "❌ خطای اتصال به سرور", type: "error" });
		} finally {
			setLoading(false);
		}
	};

	const confirmDelete = async () => {
		if (toDeleteId === null) return;
		setDeleteModalOpen(false);

		try {
			const res = await fetch("/api/massage", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: toDeleteId === "all" ? undefined : toDeleteId, deleteAll: toDeleteId === "all" }),
			});
			const data = await res.json();
			if (res.ok) {
				showResponse({ text: toDeleteId === "all" ? "✅ همه پیام‌ها حذف شدند" : "✅ پیام حذف شد", type: "success" });
				fetchMessages();
			} else {
				showResponse({ text: `❌ خطا در حذف: ${data.message || "ناموفق"}`, type: "error" });
			}
		} catch {
			showResponse({ text: "❌ خطای اتصال به سرور", type: "error" });
		} finally {
			setToDeleteId(null);
		}
	};

	return (
		<>
			<Header />
			<main className="min-h-screen p-4">
				<div className="container mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl font-extrabold mb-4">ارسال پیام</h1>
						<p className="text-gray-600 dark:text-gray-400 text-xl">
							پیام‌های خود را در یک محیط زیبا و کاربرپسند ارسال و مدیریت کنید ✨
						</p>
					</div>
					<div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
						<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
							<form onSubmit={handleSubmit} noValidate className="space-y-6">
								<div>
									<label className="block text-sm font-medium mb-2">عنوان پیام</label>
									<input
										type="text"
										placeholder="عنوان پیام خود را وارد کنید..."
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">متن پیام</label>
									<textarea
										placeholder="متن پیام خود را وارد کنید..."
										value={body}
										onChange={(e) => setBody(e.target.value)}
										rows={4}
										className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 resize-none"
									/>
								</div>
								<button
									type="submit"
									disabled={loading}
									className="w-full py-3 rounded-xl font-bold text-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
								>
									{loading ? <LoadingDots /> : <Send size={20} />}
									ارسال پیام
								</button>
							</form>
						</div>
						<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
							<div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
								<h2 className="text-xl font-bold">پیام‌های ذخیره شده</h2>
								<button
									onClick={() => { setToDeleteId("all"); setDeleteModalOpen(true); }}
									disabled={messages.length === 0}
									className="px-4 py-2 rounded-xl bg-danger text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
								>
									<Trash2 size={16} />
									حذف همه
								</button>
							</div>
							<div className="p-4 h-[500px] overflow-y-auto">
								{messages.length === 0 ? (
									<div className="flex flex-col items-center justify-center h-full text-gray-500">
										<MessageCircle size={48} className="mb-3 opacity-50" />
										<p>هنوز پیامی وجود ندارد</p>
									</div>
								) : (
									<div className="space-y-4">
										{messages.map(msg => (
											<div key={msg.id} className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700">
												<div className="flex justify-between items-start gap-4">
													<div className="flex-1">
														<h3 className="font-bold text-lg mb-2">{msg.title}</h3>
														<p className="text-sm whitespace-pre-wrap">{msg.body}</p>
													</div>
													<button onClick={() => { setToDeleteId(msg.id); setDeleteModalOpen(true); }} className="p-2 text-danger">
														<Trash2 size={16} />
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
			</main>
			{response && (
				<div className={`fixed bottom-6 left-1/2 -translate-x-1/2 max-w-md w-full rounded-2xl p-4 shadow-2xl z-50 ${response.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
					<div className="flex items-center gap-3">
						{response.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
						<span className="flex-1 font-semibold">{response.text}</span>
						<button onClick={() => setResponse(null)} className="font-bold text-lg">&times;</button>
					</div>
				</div>
			)}
			<DeleteConfirmModal
				isOpen={deleteModalOpen}
				onCancel={() => setDeleteModalOpen(false)}
				onConfirm={confirmDelete}
				message={toDeleteId === "all" ? "آیا از حذف همه پیام‌ها مطمئن هستید؟" : "آیا از حذف این پیام مطمئن هستید؟"}
			/>
		</>
	);
}
