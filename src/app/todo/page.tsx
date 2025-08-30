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
  const [completed, setCompleted] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [response, setResponse] = useState<ResponseMessage | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | number | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionTodo, setActionTodo] = useState<Todo | null>(null);
  const [actionType, setActionType] = useState<"edit" | "toggleCompleted" | null>(null);

  const [touchedTitle, setTouchedTitle] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

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
    setFormTouched(true);
    setTouchedTitle(true);

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
        setFormTouched(false); setTouchedTitle(false);
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
  const cancelDelete = () => { setDeleteModalOpen(false); setToDeleteId(null); };
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

  const onActionClick = (todo: Todo, type: "edit" | "toggleCompleted") => {
    setActionTodo(todo);
    setActionType(type);
    setActionModalOpen(true);
    if (type === "edit") startEdit(todo);
  };

  const confirmAction = async () => {
    if (!actionTodo || !token || !actionType) return;

    setSubmitting(true);
    setActionModalOpen(false);

    try {
      const url = `/api/todo/${actionTodo.id}`;
      const method = "PUT";
      let body: any = {};

      if (actionType === "edit") body = { title, completed };
      else if (actionType === "toggleCompleted") body = { completed: !actionTodo.completed };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        showResponse({ text: actionType === "edit" ? "✅ تودو بروز شد" : "✅ وضعیت تکمیل تغییر کرد", type: "success" });
        if (actionType === "edit") { setTitle(""); setCompleted(false); setEditingTodo(null); }
        fetchTodos();
      } else {
        showResponse({ text: `❌ خطا: ${data.message || "ناموفق"}`, type: "error" });
      }
    } catch {
      showResponse({ text: "❌ خطا در ارتباط با سرور", type: "error" });
    } finally {
      setSubmitting(false);
      setActionTodo(null);
      setActionType(null);
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
      </div>
    );
  }


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

            <div className="w-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-2xl p-4 shadow-inner flex items-center">
              <input
                type="text"
                placeholder="عنوان تودو..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setTouchedTitle(true)}
                className="w-full bg-transparent border-none focus:outline-none text-right text-black dark:text-gray-100 font-['Major_Mono_Display'] text-xl sm:text-2xl md:text-3xl placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-lg transition-all"
              />
            </div>
            {(touchedTitle || formTouched) && !title.trim() && (
              <p className="text-red-600 text-sm mt-1 text-right">لطفا عنوان را وارد کنید.</p>
            )}

            <div className="flex items-end justify-end gap-2">
              <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                {submitting ? "در حال ارسال..." : editingTodo ? "بروز رسانی" : "افزودن"}
              </button>
              {editingTodo && (
                <button type="button" onClick={() => { setEditingTodo(null); setTitle(""); setCompleted(false); setFormTouched(false); setTouchedTitle(false); }} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                  لغو
                </button>
              )}
            </div>

          </form>

          {/* لیست تودوها */}
          <div className="py-2.5 px-0.5 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-xl">
            <div className="p-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70 scrollbar-thumb-rounded scrollbar-track-transparent hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80 transition-all">
              {loading ? (
                <div className="flex justify-center items-center h-24"><LoadingDots /></div>
              ) : todos.length === 0 ? (
                <p className="text-center text-gray-500">هیچ تودویی وجود ندارد.</p>
              ) : (
                <AnimatePresence>
                  {todos.map((todo) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 mb-3 gap-2 rounded-lg bg-white/10 dark:bg-black/30 flex flex-row-reverse justify-between items-start shadow"
                    >
                      <div className="space-y-4 w-full text-right">
                        <h3 className={`font-bold ${todo.completed ? "line-through text-green-600" : "text-gray-700 dark:text-indigo-300"} text-xl  `}>
                          {todo.title}
                        </h3>
                        <small className="text-gray-400 block mt-1 text-left text-sm">{new Date(todo.createdAt).toLocaleString()}</small>
                      </div>
                      <div className="flex flex-col gap-3">
                        <button onClick={() => onActionClick(todo, "edit")} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs">ویرایش</button>
                        <button onClick={() => onActionClick(todo, "toggleCompleted")} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs">
                          {todo.completed ? "لغو" : "تکمیل"}
                        </button>
                        <button onClick={() => onDeleteClick(todo.id)} disabled={deletingId === todo.id} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs">
                          {deletingId === todo.id ? "در حال حذف..." : "حذف"}
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
          <motion.div initial={{ opacity: 0, x: 50, y: 50 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: 50, y: 50 }} transition={{ duration: 0.3 }} className={`fixed bottom-6 right-6 max-w-xs rounded-lg px-4 py-3 shadow-lg font-semibold z-50 ${response.type === "success" ? "bg-green-100 text-green-800" : response.type === "error" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
            <div className="flex justify-between items-center">
              <span>{response.text}</span>
              <button onClick={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setResponse(null); }}>&times;</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* مودال‌ها */}
      <ConfirmModal isOpen={deleteModalOpen} onCancel={cancelDelete} onConfirm={confirmDelete} message="آیا مطمئن هستید که می‌خواهید این تودو را حذف کنید؟" confirmText="حذف" confirmColor="bg-red-600 hover:bg-red-700" />
      <ConfirmModal isOpen={actionModalOpen} onCancel={() => setActionModalOpen(false)} onConfirm={confirmAction} message={
        actionType === "edit" ? "آیا مطمئن هستید که این تودو را ویرایش می‌کنید؟" : "آیا مطمئن هستید که وضعیت تکمیل این تودو تغییر کند؟"
      } confirmText={actionType === "edit" ? "ویرایش" : "تکمیل"} confirmColor={actionType === "edit" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"} />
    </>
  );
}
