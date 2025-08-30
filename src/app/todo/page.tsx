"use client";

import LoadingDots from "@/components/loading";
import ConfirmModal from "@/components/DeleteConfirmModal";
import Header from "@/components/ui/header";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Todo = { id: string; title: string; completed: boolean; createdAt: string };
type ResponseMessage = { text: string; type: "success" | "error" | "info" };

const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
};

export default function TodosPage() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [completed, setCompleted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [response, setResponse] = useState<ResponseMessage | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | number | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const fetchAccessToken = async () => {
    const res = await fetch("/api/auth/refresh");
    const data = await res.json();
    if (res.ok) {
      setToken(data.accessToken);
      const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
      setUser({ id: payload.id, username: payload.username });
    } else {
      router.push("/login");
    }
  };

  const fetchTodos = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await fetcher("/api/todo", token);
      setTodos(data.todos || []);
    } catch {
      showResponse({ text: "❌ خطا در دریافت تودوها", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccessToken(); }, []);
  useEffect(() => { if (token) fetchTodos(); }, [token]);

  const showResponse = (resp: ResponseMessage) => {
    setResponse(resp);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setResponse(null), 4000);
  };

  const saveTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !token) {
      showResponse({ text: "❌ لطفا عنوان را وارد کنید.", type: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const url = editingTodo ? `/api/todo/${editingTodo.id}` : "/api/todo";
      const method = editingTodo ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, completed }),
      });
      const data = await res.json();
      if (res.ok) {
        showResponse({ text: editingTodo ? "✅ تودو بروز شد" : "✅ تودو اضافه شد", type: "success" });
        setTitle(""); setCompleted(false); setEditingTodo(null);
        fetchTodos();
      } else {
        showResponse({ text: `❌ خطا: ${data.message || "ناموفق"}`, type: "error" });
      }
    } catch {
      showResponse({ text: "❌ خطا در ارتباط با سرور", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const onDeleteClick = (id: string | number) => { setToDeleteId(id); setDeleteModalOpen(true); };
  const confirmDelete = async () => {
    if (!toDeleteId || !token) return;
    setDeletingId(toDeleteId);
    setDeleteModalOpen(false);
    try {
      const res = await fetch(`/api/todo/${toDeleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) showResponse({ text: "✅ تودو حذف شد", type: "success" });
      else showResponse({ text: `❌ خطا: ${data.message || "ناموفق"}`, type: "error" });
      fetchTodos();
    } catch {
      showResponse({ text: "❌ خطا در ارتباط با سرور", type: "error" });
    } finally {
      setDeletingId(null);
      setToDeleteId(null);
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setCompleted(todo.completed);
  };

  if (!user) return <div className="flex items-center justify-center min-h-screen"><LoadingDots /></div>;

  return (
    <>
      <Header />
      <div className="min-h-screen mt-16 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="container mx-auto max-w-2xl flex flex-col gap-6">

          {/* فرم تودو */}
          <form onSubmit={saveTodo} className="rounded-2xl p-6 bg-white/10 backdrop-blur-md shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200">
              {editingTodo ? "ویرایش تودو" : "افزودن تودو"}
            </h2>

            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="عنوان تودو"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 bg-transparent border-b border-gray-400 dark:border-gray-600 focus:outline-none text-black dark:text-gray-100 text-xl placeholder:text-gray-400"
              />
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} />
                انجام‌شده
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                {submitting ? "در حال ارسال..." : editingTodo ? "بروز رسانی" : "افزودن"}
              </button>
              {editingTodo && (
                <button type="button" onClick={() => { setEditingTodo(null); setTitle(""); setCompleted(false); }} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                  لغو
                </button>
              )}
            </div>
          </form>

          {/* لیست تودوها */}
          <div className="py-2.5 px-0.5 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-xl">
            <div className="p-4 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-24"><LoadingDots /></div>
              ) : todos.length === 0 ? (
                <p className="text-center text-gray-500">هیچ تودویی وجود ندارد.</p>
              ) : (
                <AnimatePresence>
                  {todos.map((todo) => (
                    <motion.div key={todo.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                      className="p-4 mb-3 gap-2 rounded-lg bg-white/10 dark:bg-black/30 flex justify-between items-center shadow">
                      <div className="text-right">
                        <h3 className={`font-bold ${todo.completed ? "line-through text-green-600" : "text-gray-700 dark:text-indigo-300"}`}>
                          {todo.title}
                        </h3>
                        <small className="text-gray-400 block mt-1">{new Date(todo.createdAt).toLocaleString()}</small>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => startEdit(todo)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs">ویرایش</button>
                        <button onClick={() => onDeleteClick(todo.id)} disabled={deletingId === todo.id} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs">
                          {deletingId === todo.id ? "..." : "حذف"}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* پاسخ‌ها */}
      <AnimatePresence>
        {response && (
          <motion.div initial={{ opacity: 0, x: 50, y: 50 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: 50, y: 50 }} transition={{ duration: 0.3 }}
            className={`fixed bottom-6 right-6 max-w-xs rounded-lg px-4 py-3 shadow-lg font-semibold z-50 ${
              response.type === "success" ? "bg-green-100 text-green-800" :
              response.type === "error" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
            <div className="flex justify-between items-center">
              <span>{response.text}</span>
              <button onClick={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setResponse(null); }}>&times;</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* مودال حذف */}
      <ConfirmModal isOpen={deleteModalOpen} onCancel={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} message="آیا مطمئن هستید که می‌خواهید این تودو را حذف کنید؟" confirmText="حذف" confirmColor="bg-red-600 hover:bg-red-700" />
    </>
  );
}
