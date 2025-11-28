"use client";

import ConfirmModal from "@/components/DeleteConfirmModal";
import Header from "@/components/ui/header";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus, CheckCircle, Circle, Edit3, Trash2, ListTodo, AlertCircle, X, Loader2 } from "lucide-react";
import HybridLoading from "../loading";

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
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<ResponseMessage | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | number | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [uncompleteModalOpen, setUncompleteModalOpen] = useState(false);
  const [targetTodo, setTargetTodo] = useState<Todo | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [targetEditTodo, setTargetEditTodo] = useState<Todo | null>(null);
  const [touchedTitle, setTouchedTitle] = useState(false);
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
      const data = await res.json();
      if (res.ok) {
        setToken(data.accessToken);
        const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
        setUser({ id: payload.id, username: payload.username });
      } else {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    }
  }, [router]);

  const fetchTodos = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await fetcher("/api/todo", token);
      setTodos(data.todos || []);
    } catch {
      showResponse({ text: "Error fetching todos.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAccessToken(); }, [fetchAccessToken]);
  useEffect(() => { if (token) fetchTodos(); }, [token, fetchTodos]);

  const saveTodo = async () => {
    setTouchedTitle(true);
    if (!title.trim() || !token) {
      showResponse({ text: "Please enter a title.", type: "error" });
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
      const data = await res.json();
      if (res.ok) {
        showResponse({ text: editingTodo ? "Todo updated." : "Todo added.", type: "success" });
        setTitle("");
        setEditingTodo(null);
        setTouchedTitle(false);
        fetchTodos();
      } else {
        showResponse({ text: data.message || "An error occurred.", type: "error" });
      }
    } catch {
      showResponse({ text: "Server connection error.", type: "error" });
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
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) showResponse({ text: "Todo deleted.", type: "success" });
      else showResponse({ text: data.message || "Failed to delete.", type: "error" });
      fetchTodos();
    } catch {
      showResponse({ text: "Server connection error.", type: "error" });
    } finally {
      setDeletingId(null);
      setToDeleteId(null);
    }
  };

  const onCompleteClick = (todo: Todo) => { setTargetTodo(todo); setCompleteModalOpen(true); };
  const confirmComplete = async () => {
    if (!targetTodo || !token) return;
    try {
      await fetch(`/api/todo/${targetTodo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ completed: true })
      });
      showResponse({ text: "Todo marked as complete.", type: "success" });
      fetchTodos();
    } catch {
      showResponse({ text: "Server connection error.", type: "error" });
    }
    finally {
      setCompleteModalOpen(false);
      setTargetTodo(null);
    }
  };

  const onUncompleteClick = (todo: Todo) => { setTargetTodo(todo); setUncompleteModalOpen(true); };
  const confirmUncomplete = async () => {
    if (!targetTodo || !token) return;
    try {
      await fetch(`/api/todo/${targetTodo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ completed: false })
      });
      showResponse({ text: "Todo marked as incomplete.", type: "success" });
      fetchTodos();
    } catch {
      showResponse({ text: "Server connection error.", type: "error" });
    }
    finally {
      setUncompleteModalOpen(false);
      setTargetTodo(null);
    }
  };

  const startEdit = (todo: Todo) => { setTargetEditTodo(todo); setEditModalOpen(true); };
  const confirmEdit = () => {
    if (!targetEditTodo) return;
    setEditingTodo(targetEditTodo);
    setTitle(targetEditTodo.title);
    setEditModalOpen(false);
    setTargetEditTodo(null);
  };
  const cancelEdit = () => { setEditModalOpen(false); setTargetEditTodo(null); };

  if (!user || loading) return <HybridLoading />;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            <span className="text-gradient">To-Do List</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            Organize and manage your tasks ✨
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="glass-effect rounded-2xl soft-shadow p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex-1">
                {editingTodo ? "Edit Todo" : "Add New Todo"}
              </h2>
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="What do you need to do?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setTouchedTitle(true)}
                className="flex-1 px-4 py-2 rounded-lg bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-900 dark:text-zinc-50 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveTodo} disabled={submitting}
                className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white shadow-lg shadow-cyan-500/20 dark:shadow-cyan-500/10 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : editingTodo ? <Edit3 size={20} /> : <Plus size={20} />}
                {editingTodo ? "Update" : "Add"}
              </motion.button>
              {editingTodo && (
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setEditingTodo(null); setTitle(""); setTouchedTitle(false); }}
                  className="px-4 py-2 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50 transition-colors font-semibold"
                >
                  Cancel
                </motion.button>
              )}
            </div>
            {touchedTitle && !title.trim() && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle size={16} /> Please enter a title.
              </p>
            )}
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <div className="glass-effect rounded-2xl soft-shadow min-h-[400px]">
              <div className="p-6 border-b border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">My Tasks</h2>
                <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded-md">
                  {todos.filter(t => !t.completed).length} tasks left
                </div>
              </div>
              <div className="p-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-48">
                    <Loader2 className="animate-spin text-cyan-500" size={32} />
                    <p className="text-zinc-500 dark:text-zinc-400 mt-3">Loading tasks...</p>
                  </div>
                ) : todos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-zinc-500 dark:text-zinc-400">
                    <ListTodo size={48} className="mb-3 opacity-50" />
                    <p className="font-semibold">No tasks yet</p>
                    <p className="text-sm mt-1">Add your first task to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {todos.map((todo, index) => (
                        <motion.div
                          key={todo.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 group flex items-center gap-4"
                        >
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => todo.completed ? onUncompleteClick(todo) : onCompleteClick(todo)}
                            className={`p-1 rounded-full transition-colors ${todo.completed ? 'text-green-500' : 'text-zinc-400 group-hover:text-cyan-500'}`}
                          >
                            {todo.completed ? <CheckCircle size={22} /> : <Circle size={22} />}
                          </motion.button>
                          <div className="flex-1">
                            <h3 className={`font-medium text-base ${todo.completed ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-800 dark:text-white"} transition-colors`}>
                              {todo.title}
                            </h3>
                            <small className="text-zinc-500 dark:text-zinc-400 text-xs">
                              {new Date(todo.createdAt).toLocaleString('en-US')}
                            </small>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => startEdit(todo)}
                              className="p-2 text-zinc-500 hover:text-cyan-500 hover:bg-cyan-500/10 rounded-lg transition-colors" title="Edit"
                            >
                              <Edit3 size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onDeleteClick(todo.id)} disabled={deletingId === todo.id}
                              className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50" title="Delete"
                            >
                              {deletingId === todo.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 size={16} />}
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
      </main>

      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 rounded-2xl p-4 shadow-2xl z-50 glass-effect soft-shadow w-full max-w-md`}
          >
            <div className="flex items-center gap-3">
              {response.type === "success" && <CheckCircle className="text-green-500" size={20} />}
              {response.type === "error" && <AlertCircle className="text-red-500" size={20} />}
              {response.type === "info" && <ListTodo className="text-cyan-500" size={20} />}
              <span className={`flex-1 font-semibold ${response.type === 'success' ? 'text-green-700 dark:text-green-300' : response.type === 'error' ? 'text-red-700 dark:text-red-300' : 'text-cyan-700 dark:text-cyan-300'}`}>
                {response.text}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setResponse(null); }}
                className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 p-1 rounded-full"
              >
                <X size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal isOpen={deleteModalOpen} onCancel={cancelDelete} onConfirm={confirmDelete} message="Are you sure you want to delete this task?" confirmText="Delete" confirmColor="bg-red-600 hover:bg-red-700" />
      <ConfirmModal isOpen={completeModalOpen} onCancel={() => setCompleteModalOpen(false)} onConfirm={confirmComplete} message="Are you sure you want to complete this task?" confirmText="Complete" confirmColor="bg-green-500 hover:bg-green-600" />
      <ConfirmModal isOpen={uncompleteModalOpen} onCancel={() => setUncompleteModalOpen(false)} onConfirm={confirmUncomplete} message="Are you sure you want to uncomplete this task?" confirmText="Uncomplete" confirmColor="bg-yellow-500 hover:bg-yellow-600" />
      <ConfirmModal isOpen={editModalOpen} onCancel={cancelEdit} onConfirm={confirmEdit} message="Do you want to edit this task?" confirmText="Edit" confirmColor="bg-yellow-500 hover:bg-yellow-600" />
    </div>
  );
}
