"use client";

import ConfirmModal from "@/components/DeleteConfirmModal";
import Header from "@/components/ui/header";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, CheckCircle, Circle, Edit3, Trash2, ListTodo, AlertCircle, X } from "lucide-react";

type Todo = { id: string; title: string; completed: boolean; createdAt: string };
type ResponseMessage = { text: string; type: "success" | "error" };

const fetcher = async (url: string, token: string) => {
	const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
	if (!res.ok) throw new Error("Unauthorized");
	return res.json();
};

export default function TodosPage() {
	const [token, setToken] = useState<string | null>(null);
	const [todos, setTodos] = useState<Todo[]>([]);
	const [title, setTitle] = useState("");
	const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
	const [loading, setLoading] = useState(true);
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

	const fetchTodos = useCallback(async () => {
		if (!token) return;
		setLoading(true);
		try {
			const data = await fetcher("/api/todo", token);
			setTodos(data.todos || []);
		} catch {
			showResponse({ text: "❌ خطا در دریافت کارها", type: "error" });
		} finally {
			setLoading(false);
		}
	}, [token]);

	useEffect(() => {
		fetchAccessToken();
	}, [fetchAccessToken]);
	useEffect(() => {
		if (token) fetchTodos();
	}, [token, fetchTodos]);

	const saveTodo = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || !token) {
			showResponse({ text: "❌ لطفاً عنوان را وارد کنید.", type: "error" });
			return;
		}

		setSubmitting(true);
		try {
			const url = editingTodo ? `/api/todo/${editingTodo.id}` : "/api/todo";
			const method = editingTodo ? "PUT" : "POST";
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ title, completed: editingTodo?.completed || false }),
			});
			if (res.ok) {
				showResponse({ text: editingTodo ? "✅ کار ویرایش شد" : "✅ کار اضافه شد", type: "success" });
				setTitle("");
				setEditingTodo(null);
				fetchTodos();
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

	const toggleComplete = async (todo: Todo) => {
		if (!token) return;
		try {
			const res = await fetch(`/api/todo/${todo.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ completed: !todo.completed }),
			});
			if (res.ok) {
				showResponse({ text: "✅ وضعیت کار تغییر کرد", type: "success" });
				fetchTodos();
			} else {
				const data = await res.json();
				showResponse({ text: `❌ خطا: ${data.message || "ناموفق"}`, type: "error" });
			}
		} catch {
			showResponse({ text: "❌ خطای اتصال به سرور", type: "error" });
		}
	};

	const confirmDelete = async () => {
		if (!toDeleteId || !token) return;
		setDeleteModalOpen(false);
		try {
			const res = await fetch(`/api/todo/${toDeleteId}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (res.ok) {
				showResponse({ text: "✅ کار حذف شد", type: "success" });
				fetchTodos();
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

	if (loading) return <main className="min-h-screen flex items-center justify-center"><p>در حال بارگذاری...</p></main>;

	return (
		<>
			<Header />
			<main className="min-h-screen p-4">
				<div className="container mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl font-extrabold mb-4">لیست کارها</h1>
						<p className="text-gray-600 dark:text-gray-400 text-xl">
							کارهای خود را سازماندهی و مدیریت کنید ✨
						</p>
					</div>
					<div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
						<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
							<h2 className="text-2xl font-bold mb-6">{editingTodo ? "ویرایش کار" : "افزودن کار جدید"}</h2>
							<form onSubmit={saveTodo} className="space-y-4">
								<input
									type="text"
									placeholder="چه کاری می‌خواهید انجام دهید؟"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700"
								/>
								<div className="flex gap-3">
									<button type="submit" disabled={submitting} className="flex-1 py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
										{submitting ? "در حال ارسال..." : (editingTodo ? "ویرایش" : "افزودن")}
									</button>
									{editingTodo && (
										<button type="button" onClick={() => { setEditingTodo(null); setTitle(""); }} className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 font-semibold">
											لغو
										</button>
									)}
								</div>
							</form>
						</div>
						<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
							<div className="p-6 border-b border-gray-200 dark:border-gray-700">
								<h2 className="text-xl font-bold">کارهای من</h2>
							</div>
							<div className="p-4 h-[600px] overflow-y-auto">
								{todos.length === 0 ? (
									<div className="text-center py-16 text-gray-500">
										<ListTodo size={48} className="mx-auto mb-4 opacity-50" />
										<p>هنوز کاری وجود ندارد</p>
									</div>
								) : (
									<div className="space-y-4">
										{todos.map(todo => (
											<div key={todo.id} className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center gap-4">
												<button onClick={() => toggleComplete(todo)}>
													{todo.completed ? <CheckCircle className="text-success" size={24} /> : <Circle size={24} />}
												</button>
												<p className={`flex-1 ${todo.completed ? "line-through text-gray-500" : ""}`}>{todo.title}</p>
												<button onClick={() => { setEditingTodo(todo); setTitle(todo.title); }} className="p-2 text-warning"><Edit3 size={16} /></button>
												<button onClick={() => { setToDeleteId(todo.id); setDeleteModalOpen(true); }} className="p-2 text-danger"><Trash2 size={16} /></button>
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
			<ConfirmModal isOpen={deleteModalOpen} onCancel={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} message="آیا از حذف این کار مطمئن هستید؟" />
		</>
	);
}
