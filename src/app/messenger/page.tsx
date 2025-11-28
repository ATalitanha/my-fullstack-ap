"use client";

import LoadingDots from "@/components/loading";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/ui/header";
import { Send, MessageCircle, Trash2, AlertCircle, CheckCircle, X, Loader2 } from "lucide-react";

type Message = { id: string | number; title: string; body: string };
type ResponseMessage = { text: string; type: "success" | "error" | "info" };

export default function MessageForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResponseMessage | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | number | null>(null);
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

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
      showResponse({ text: "Error fetching messages.", type: "error" });
    }
  }, [showResponse]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleBlur = (field: string) => setTouchedFields(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedFields({ title: true, body: true });
    if (!title.trim() || !body.trim()) {
      showResponse({ text: "Please fill out all fields.", type: "error" });
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
        showResponse({ text: "Message sent successfully.", type: "success" });
        setTitle(""); setBody(""); setTouchedFields({});
        fetchMessages();
        listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        showResponse({ text: data.message || "Failed to send message.", type: "error" });
      }
    } catch {
      showResponse({ text: "Server connection error.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onDeleteClick = (id: string | number) => { setToDeleteId(id); setDeleteModalOpen(true); };
  const cancelDelete = () => { setDeleteModalOpen(false); setToDeleteId(null); };
  const confirmDelete = async () => {
    if (toDeleteId === null) return;
    setDeletingId(toDeleteId);
    setDeleteModalOpen(false);
    try {
      const res = await fetch("/api/massage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toDeleteId === "all" ? { deleteAll: true } : { id: toDeleteId }),
      });
      const data = await res.json();
      if (res.ok) {
        showResponse({ text: toDeleteId === "all" ? "All messages deleted." : "Message deleted.", type: "success" });
        fetchMessages();
      } else {
        showResponse({ text: data.message || "Failed to delete.", type: "error" });
      }
    } catch {
      showResponse({ text: "Server connection error.", type: "error" });
    } finally {
      setDeletingId(null);
      setToDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            <span className="text-gradient">ارسال پیام</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            ارسال و مدیریت پیام‌های خود در یک محیط زیبا و کاربرپسند ✨
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
            <div className="glass-effect rounded-2xl soft-shadow p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-500/10 rounded-lg"><Send className="text-cyan-600 dark:text-cyan-400" size={24} /></div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">ارسال پیام جدید</h2>
              </div>
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">عنوان پیام</label>
                  <input type="text" placeholder="عنوان پیام خود را وارد کنید..." value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => handleBlur('title')} className="w-full px-4 py-2 rounded-lg bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-zinc-900 dark:text-zinc-50" />
                  {touchedFields.title && !title.trim() && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={16} /> لطفا عنوان را وارد کنید</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">متن پیام</label>
                  <textarea placeholder="متن پیام خود را وارد کنید..." value={body} onChange={(e) => setBody(e.target.value)} onBlur={() => handleBlur('body')} rows={5} className="w-full px-4 py-2 rounded-lg bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-zinc-900 dark:text-zinc-50 resize-none scrollbar-custom" />
                  {touchedFields.body && !body.trim() && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={16} /> لطفا متن پیام را وارد کنید.</p>}
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20 dark:shadow-cyan-500/10 flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />} ارسال پیام
                </motion.button>
              </form>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1">
            <div className="glass-effect rounded-2xl soft-shadow h-full">
              <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-50"><MessageCircle size={20} /> پیام‌های ثبت‌شده</div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onDeleteClick("all")} disabled={messages.length === 0 || deletingId === "all"} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold disabled:opacity-50 flex items-center gap-2">
                  {deletingId === "all" ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />} حذف همه
                </motion.button>
              </div>
              <div ref={listRef} className="p-4 h-[500px] overflow-y-auto scrollbar-custom">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-500 dark:text-zinc-400">
                    <MessageCircle size={48} className="mb-3 opacity-50" />
                    <p className="font-semibold">هیچ پیامی وجود ندارد</p>
                    <p className="text-sm mt-1">اولین پیام را ارسال کنید!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {messages.map((msg, index) => (
                        <motion.div key={msg.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.05 }} className="p-4 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 group">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-zinc-900 dark:text-white text-lg mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">{msg.title}</h3>
                              <p className="text-zinc-600 dark:text-zinc-300 text-sm whitespace-pre-wrap">{msg.body}</p>
                            </div>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onDeleteClick(msg.id)} disabled={deletingId === msg.id} className="p-2 text-zinc-400 hover:text-red-500 shrink-0 opacity-0 group-hover:opacity-100" title="Delete message">
                              {deletingId === msg.id ? <Loader2 className="animate-spin" size={16}/> : <Trash2 size={16} />}
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
          <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }} className="fixed bottom-6 left-1/2 rounded-2xl p-4 shadow-2xl z-50 glass-effect soft-shadow w-full max-w-md">
            <div className="flex items-center gap-3">
              {response.type === "success" && <CheckCircle className="text-green-500" size={20} />}
              {response.type === "error" && <AlertCircle className="text-red-500" size={20} />}
              <span className={`flex-1 font-semibold ${response.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>{response.text}</span>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setResponse(null)} className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 p-1 rounded-full"><X size={18} /></motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DeleteConfirmModal isOpen={deleteModalOpen} onCancel={cancelDelete} onConfirm={confirmDelete} message={toDeleteId === "all" ? "Are you sure you want to delete all messages?" : "Are you sure you want to delete this message?"} />
    </div>
  );
}
