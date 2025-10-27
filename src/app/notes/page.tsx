"use client";

import ConfirmModal from "@/components/DeleteConfirmModal";
import Header from "@/components/ui/header";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit3, Trash2, FileText, AlertCircle, CheckCircle, X } from "lucide-react";

type Note = { id: string; title: string; content: string; createdAt: string };
type ResponseMessage = { text: string; type: "success" | "error" };

const fetcher = async (url: string, token: string) => {
	const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
	if (!res.ok) throw new Error("Unauthorized");
	return res.json();
};

export default function NotesPage() {
	const [token, setToken] = useState<string | null>(null);
	const [notes, setNotes] = useState<Note[]>([]);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [editingNote, setEditingNote] = useState<Note | null>(null);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [response, setResponse] = useState<ResponseMessage | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [toDeleteId, setToDeleteId] = useState<string | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const router = useRouter();

	const showResponse = (resp: ResponseMessage) => {
		setResponse(resp);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => setResponse(null), 4000);
	};

	const fetchAccessToken = useCallback(async () => {
		try {
			const res = await fetch("/api/auth/refresh");
			if (!res.ok) throw new Error();
			const data = await res.json();
			setToken(data.accessToken);
		} catch {
			router.push("/login");
		}
	}, [router]);

	const fetchNotes = useCallback(async () => {
		if (!token) return;
		setLoading(true);
		try {
			const data = await fetcher("/api/notes", token);
			setNotes(data.notes || []);
		} catch {
			showResponse({ text: "❌ خطا در دریافت یادداشت‌ها", type: "error" });
		} finally {
			setLoading(false);
		}
	}, [token]);

	useEffect(() => {
		fetchAccessToken();
	}, [fetchAccessToken]);
	useEffect(() => {
		if (token) fetchNotes();
	}, [token, fetchNotes]);

	const saveNote = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || !content.trim() || !token) {
			showResponse({ text: "❌ لطفاً تمام فیلدها را پر کنید.", type: "error" });
			return;
		}

		setSubmitting(true);
		try {
			const url = editingNote ? `/api/notes/${editingNote.id}` : "/api/notes";
			const method = editingNote ? "PUT" : "POST";
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ title, content }),
			});
			if (res.ok) {
				showResponse({ text: editingNote ? "✅ یادداشت ویرایش شد" : "✅ یادداشت اضافه شد", type: "success" });
				setTitle("");
				setContent("");
				setEditingNote(null);
				fetchNotes();
			} else {
				const data = await res.json();
				showResponse({ text: `❌ خطا: ${data.message || "ناموفق"}`, type: "error" });
			}
		} catch {
			showResponse({ text: "❌ خطای اتصال به سرور", type: "error" });
		} finally {
			setSubmitting(false);
		}
	};

	const confirmDelete = async () => {
		if (!toDeleteId || !token) return;
		setDeleteModalOpen(false);
		try {
			const res = await fetch(`/api/notes/${toDeleteId}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (res.ok) {
				showResponse({ text: "✅ یادداشت حذف شد", type: "success" });
				fetchNotes();
			} else {
				const data = await res.json();
				showResponse({ text: `❌ خطا: ${data.message || "ناموفق"}`, type: "error" });
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
						<h1 className="text-4xl md:text-5xl font-extrabold mb-4">یادداشت‌ها</h1>
						<p className="text-gray-600 dark:text-gray-400 text-xl">
							یادداشت‌های خود را مدیریت و سازماندهی کنید ✨
						</p>
					</div>
					<div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
						<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
							<h2 className="text-2xl font-bold mb-6">{editingNote ? "ویرایش یادداشت" : "افزودن یادداشت جدید"}</h2>
							<form onSubmit={saveNote} className="space-y-6">
								<div>
									<label className="block text-sm font-medium mb-2">عنوان یادداشت</label>
									<input
										type="text"
										placeholder="عنوان را وارد کنید..."
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">محتوای یادداشت</label>
									<textarea
										placeholder="محتوا را بنویسید..."
										value={content}
										onChange={(e) => setContent(e.target.value)}
										rows={6}
										className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 resize-none"
									/>
								</div>
								<div className="flex gap-3">
									<button type="submit" disabled={submitting} className="flex-1 py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
										{submitting ? "در حال ارسال..." : (editingNote ? "ویرایش" : "افزودن")}
									</button>
									{editingNote && (
										<button type="button" onClick={() => { setEditingNote(null); setTitle(""); setContent(""); }} className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 font-semibold">
											لغو
										</button>
									)}
								</div>
							</form>
						</div>
						<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
							<div className="p-6 border-b border-gray-200 dark:border-gray-700">
								<h2 className="text-xl font-bold">یادداشت‌های من</h2>
							</div>
							<div className="p-4 h-[600px] overflow-y-auto">
								{loading ? <p>در حال بارگذاری...</p> : notes.length === 0 ? (
									<div className="text-center py-16 text-gray-500">
										<FileText size={48} className="mx-auto mb-4 opacity-50" />
										<p>هنوز یادداشتی وجود ندارد</p>
									</div>
								) : (
									<div className="space-y-4">
										{notes.map(note => (
											<div key={note.id} className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700">
												<h3 className="font-bold text-lg mb-2">{note.title}</h3>
												<p className="text-sm whitespace-pre-wrap mb-3">{note.content}</p>
												<div className="flex justify-between items-center">
													<small className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleString("fa-IR")}</small>
													<div className="flex gap-2">
														<button onClick={() => { setEditingNote(note); setTitle(note.title); setContent(note.content); }} className="p-2 text-warning"><Edit3 size={16} /></button>
														<button onClick={() => { setToDeleteId(note.id); setDeleteModalOpen(true); }} className="p-2 text-danger"><Trash2 size={16} /></button>
													</div>
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
			<ConfirmModal isOpen={deleteModalOpen} onCancel={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} message="آیا از حذف این یادداشت مطمئن هستید؟" />
		</>
	);
}
