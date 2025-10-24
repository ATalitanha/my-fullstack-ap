"use client";

import ConfirmModal from "@/components/DeleteConfirmModal";
import Header from "@/components/ui/header";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, Plus, CheckCircle, Circle, Edit3, Trash2, ListTodo, AlertCircle, X } from "lucide-react";

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | number | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [uncompleteModalOpen, setUncompleteModalOpen] = useState(false);
  const [targetTodo, setTargetTodo] = useState<Todo | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [targetEditTodo, setTargetEditTodo] = useState<Todo | null>(null);
  const [touchedTitle, setTouchedTitle] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
      showResponse({ text: "❌ Error fetching todos", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAccessToken(); }, [fetchAccessToken]);
  useEffect(() => { if (token) fetchTodos(); }, [token, fetchTodos]);

  const saveTodo = async () => {
    if (!title.trim() || !token) {
      showResponse({ text: "❌ Please enter a title.", type: "error" });
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
        showResponse({
          text: editingTodo ? "✅ Todo updated" : "✅ Todo added",
          type: "success"
        });
        setTitle("");
        setEditingTodo(null);
        setFormTouched(false);
        setTouchedTitle(false);
        fetchTodos();
      } else {
        showResponse({ text: `❌ Error: ${data.message || "Failed"}`, type: "error" });
      }
    } catch {
      showResponse({ text: "❌ Server connection error", type: "error" });
    } finally {
      setSubmitting(false);
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
    if (!toDeleteId || !token) return;
    setDeletingId(toDeleteId);
    setDeleteModalOpen(false);
    try {
      const res = await fetch(`/api/todo/${toDeleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) showResponse({ text: "✅ Todo deleted", type: "success" });
      else showResponse({ text: `❌ Error: ${data.message || "Failed"}`, type: "error" });
      fetchTodos();
    } catch {
      showResponse({ text: "❌ Server connection error", type: "error" });
    } finally {
      setDeletingId(null);
      setToDeleteId(null);
    }
  };

  const onCompleteClick = (todo: Todo) => {
    setTargetTodo(todo);
    setCompleteModalOpen(true);
  };

  const confirmComplete = async () => {
    if (!targetTodo || !token) return;
    try {
      const res = await fetch(`/api/todo/${targetTodo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ completed: true })
      });
      const data = await res.json();
      if (res.ok) showResponse({ text: "✅ Todo completed", type: "success" });
      else showResponse({ text: `❌ Error: ${data.message || "Failed"}`, type: "error" });
      fetchTodos();
    } catch {
      showResponse({ text: "❌ Server connection error", type: "error" });
    }
    finally {
      setCompleteModalOpen(false);
      setTargetTodo(null);
    }
  };

  const onUncompleteClick = (todo: Todo) => {
    setTargetTodo(todo);
    setUncompleteModalOpen(true);
  };

  const confirmUncomplete = async () => {
    if (!targetTodo || !token) return;
    try {
      const res = await fetch(`/api/todo/${targetTodo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ completed: false })
      });
      const data = await res.json();
      if (res.ok) showResponse({ text: "✅ Todo uncompleted", type: "success" });
      else showResponse({ text: `❌ Error: ${data.message || "Failed"}`, type: "error" });
      fetchTodos();
    } catch {
      showResponse({ text: "❌ Server connection error", type: "error" });
    }
    finally {
      setUncompleteModalOpen(false);
      setTargetTodo(null);
    }
  };

  const startEdit = (todo: Todo) => {
    setTargetEditTodo(todo);
    setEditModalOpen(true);
  };

  const confirmEdit = () => {
    if (!targetEditTodo) return;
    setEditingTodo(targetEditTodo);
    setTitle(targetEditTodo.title);
    setEditModalOpen(false);
    setTargetEditTodo(null);
  };

  const cancelEdit = () => {
    setEditModalOpen(false);
    setTargetEditTodo(null);
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.1) 0%, transparent 80%)`
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
              <span>Daily Task Management</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                To-Do List
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
              Organize and manage your tasks ✨
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
                    <ListTodo className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {editingTodo ? "Edit Todo" : "Add New Todo"}
                  </h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Task Title
                    </label>
                    <input
                      type="text"
                      placeholder="What do you want to do..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onBlur={() => setTouchedTitle(true)}
                      className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-gray-700/60 border border-white/40 dark:border-gray-600/40 
                      text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                      transition-all duration-200"
                    />
                    <AnimatePresence>
                      {(touchedTitle || formTouched) && !title.trim() && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-600 text-sm mt-2 flex items-center gap-1"
                        >
                          <AlertCircle size={16} />
                          Please enter a title.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={saveTodo}
                      disabled={submitting}
                      className="flex-1 py-3 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                      text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 
                      transition-all duration-200 flex items-center justify-center gap-2 
                      disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          {editingTodo ? <Edit3 size={20} /> : <Plus size={20} />}
                          {editingTodo ? "Update" : "Add"}
                        </>
                      )}
                    </motion.button>
                    {editingTodo && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setEditingTodo(null);
                          setTitle("");
                          setFormTouched(false);
                          setTouchedTitle(false);
                        }}
                        className="px-6 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                        text-gray-700 dark:text-gray-300 transition-all duration-200 font-semibold"
                      >
                        Cancel
                      </motion.button>
                    )}
                  </div>
                </div>
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
                        <ListTodo className="text-blue-600 dark:text-blue-400" size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">My Tasks</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {todos.filter(t => !t.completed).length} tasks left
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 h-[600px] overflow-y-auto">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                      <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                    </div>
                  ) : todos.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400"
                    >
                      <ListTodo size={48} className="mb-3 opacity-50" />
                      <p>No tasks yet</p>
                      <p className="text-sm mt-1">Add your first task!</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {todos.map((todo, index) => (
                          <motion.div
                            key={todo.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 border border-white/40 dark:border-gray-600/40 hover:shadow-lg transition-all group"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <button
                                    onClick={() => todo.completed ? onUncompleteClick(todo) : onCompleteClick(todo)}
                                    className={`p-1 rounded-full transition-colors ${todo.completed
                                        ? 'text-green-500 hover:text-green-600'
                                        : 'text-gray-400 hover:text-blue-500'
                                      }`}
                                  >
                                    {todo.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                                  </button>
                                  <h3 className={`font-bold text-lg flex-1 ${todo.completed
                                      ? "line-through text-gray-400 dark:text-gray-500"
                                      : "text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                    } transition-colors`}>
                                    {todo.title}
                                  </h3>
                                </div>
                                <small className="text-gray-400 text-xs ml-9">
                                  {new Date(todo.createdAt).toLocaleString('en-US')}
                                </small>
                              </div>
                              <div className="flex flex-col gap-2 flex-shrink-0">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => startEdit(todo)}
                                  className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit3 size={16} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => onDeleteClick(todo.id)}
                                  disabled={deletingId === todo.id}
                                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                  title="Delete"
                                >
                                  {deletingId === todo.id ? (
                                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Trash2 size={16} />
                                  )}
                                </motion.button>
                              </div>
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
            className={`fixed bottom-6 left-6 right-6 max-w-md mx-auto rounded-2xl p-4 shadow-2xl backdrop-blur-lg border z-50 ${response.type === "success"
                ? "bg-green-50/90 dark:bg-green-900/90 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                : response.type === "error"
                  ? "bg-red-50/90 dark:bg-red-900/90 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                  : "bg-blue-50/90 dark:bg-blue-900/90 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
              }`}
          >
            <div className="flex items-center gap-3">
              {response.type === "success" ? (
                <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
              ) : response.type === "error" ? (
                <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
              ) : (
                <ListTodo className="text-blue-600 dark:text-blue-400" size={20} />
              )}
              <span className="flex-1 font-semibold">{response.text}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setResponse(null); }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-bold text-lg leading-none p-1"
              >
                <X size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmModal
        isOpen={deleteModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this task?"
        confirmText="Delete"
        confirmColor="bg-red-600 hover:bg-red-700"
      />
      <ConfirmModal
        isOpen={completeModalOpen}
        onCancel={() => setCompleteModalOpen(false)}
        onConfirm={confirmComplete}
        message="Are you sure you want to complete this task?"
        confirmText="Complete"
        confirmColor="bg-green-500 hover:bg-green-600"
      />
      <ConfirmModal
        isOpen={uncompleteModalOpen}
        onCancel={() => setUncompleteModalOpen(false)}
        onConfirm={confirmUncomplete}
        message="Are you sure you want to uncomplete this task?"
        confirmText="Uncomplete"
        confirmColor="bg-yellow-500 hover:bg-yellow-600"
      />
      <ConfirmModal
        isOpen={editModalOpen}
        onCancel={cancelEdit}
        onConfirm={confirmEdit}
        message="Do you want to edit this task?"
        confirmText="Edit"
        confirmColor="bg-yellow-500 hover:bg-yellow-600"
      />
    </>
  );
}
