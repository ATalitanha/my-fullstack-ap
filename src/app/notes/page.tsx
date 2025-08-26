"use client";

import LoadingDots from "@/components/loading";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Header from "@/components/ui/header";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Note = { id: string; title: string; content: string; createdAt: string };
type ResponseMessage = { text: string; type: "success" | "error" | "info" };

const fetcher = async (url: string, token: string) => {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
};

export default function DashboardPage() {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<{ id: string; username: string } | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(false);
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

    const fetchNotes = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const data = await fetcher("/api/notes", token);
            setNotes(data.notes || []);
        } catch {
            showResponse({ text: "❌ خطا در دریافت یادداشت‌ها", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccessToken();
    }, []);

    useEffect(() => {
        if (token) fetchNotes();
    }, [token]);

    const showResponse = (resp: ResponseMessage) => {
        setResponse(resp);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setResponse(null), 4000);
    };

    const saveNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || !token) {
            showResponse({ text: "❌ لطفا همه فیلدها را پر کنید.", type: "error" });
            return;
        }

        setLoading(true);
        try {
            const url = editingNote ? `/api/notes/${editingNote.id}` : "/api/notes";
            const method = editingNote ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ title, content }),
            });
            const data = await res.json();
            if (res.ok) {
                showResponse({ text: editingNote ? "✅ یادداشت بروز شد" : "✅ یادداشت اضافه شد", type: "success" });
                setTitle("");
                setContent("");
                setEditingNote(null);
                fetchNotes();
            } else {
                showResponse({ text: `❌ خطا: ${data.message || "ناموفق"}`, type: "error" });
            }
        } catch {
            showResponse({ text: "❌ خطا در ارتباط با سرور", type: "error" });
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
        if (!toDeleteId || !token) return;
        setDeletingId(toDeleteId);
        setDeleteModalOpen(false);
        try {
            const res = await fetch(`/api/notes/${toDeleteId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                showResponse({ text: "✅ یادداشت حذف شد", type: "success" });
                fetchNotes();
            } else {
                showResponse({ text: `❌ خطا: ${data.message || "ناموفق"}`, type: "error" });
            }
        } catch {
            showResponse({ text: "❌ خطا در ارتباط با سرور", type: "error" });
        } finally {
            setDeletingId(null);
            setToDeleteId(null);
        }
    };

    const startEdit = (note: Note) => {
        setEditingNote(note);
        setTitle(note.title);
        setContent(note.content);
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
    };

    if (!user)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
            </div>
        );

    return (
        <>
            <Header />
            <div className="min-h-screen mt-16 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
                <div className="container mx-auto max-w-2xl flex flex-col gap-6">
                    {/* فرم یادداشت */}
                    <form onSubmit={saveNote} className="rounded-2xl p-6 bg-white/10 backdrop-blur-md shadow-xl space-y-4">
                        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200">{editingNote ? "ویرایش یادداشت" : "افزودن یادداشت"}</h2>
                        <div className="w-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-2xl p-4 min-h-[70px] shadow-inner flex items-center">
                            <input
                            type="text"
                            placeholder="عنوان"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`
                                w-full max-h-9 bg-transparent border-none focus:outline-none
                                text-right text-black dark:text-gray-100
                                font-['Major_Mono_Display'] text-2xl sm:text-3xl md:text-4xl
                                placeholder:text-gray-400 dark:placeholder:text-gray-500
                            `}
                        />
                        </div>
                        <div className="w-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-2xl p-4 shadow-inner">
                            <textarea
                            placeholder="متن یادداشت"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className={`
                  w-full min-h-10 bg-transparent border-none focus:outline-none
                  text-right text-black dark:text-gray-100
                  font-['Major_Mono_Display'] text-xl sm:text-2xl md:text-3xl
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                `}
                            rows={4}
                        />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex-1">
                                {loading ? "در حال ارسال..." : editingNote ? "بروز رسانی" : "افزودن"}
                            </button>
                            {editingNote && (
                                <button type="button" onClick={() => { setEditingNote(null); setTitle(""); setContent(""); }} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex-1">
                                    لغو
                                </button>
                            )}
                        </div>
                    </form>

                    {/* لیست یادداشت‌ها */}
                    <div className="p-4 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-xl max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70 scrollbar-thumb-rounded scrollbar-track-transparent hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80 transition-all">
                        {loading ? (
                            <div className="flex justify-center items-center h-24"><LoadingDots /></div>
                        ) : notes.length === 0 ? (
                            <p className="text-center text-gray-500">هیچ یادداشتی وجود ندارد.</p>
                        ) : (
                            <AnimatePresence>
                                {notes.map((note) => (
                                    <motion.div
                                        key={note.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="p-4 mb-3 rounded-lg bg-white/10 dark:bg-black/30 flex justify-between items-start shadow"
                                    >
                                        <div>
                                            <h3 className="font-bold text-indigo-300">{note.title}</h3>
                                            <p className="text-gray-200 mt-1 whitespace-pre-wrap">{note.content}</p>
                                            <small className="text-gray-400 block mt-1">{new Date(note.createdAt).toLocaleString()}</small>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <button onClick={() => startEdit(note)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs">ویرایش</button>
                                            <button onClick={() => onDeleteClick(note.id)} disabled={deletingId === note.id} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs">
                                                {deletingId === note.id ? "در حال حذف..." : "حذف"}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>

            {/* پاسخ‌ها */}
            <AnimatePresence>
                {response && (
                    <motion.div
                        initial={{ opacity: 0, x: 50, y: 50 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: 50, y: 50 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed bottom-6 right-6 max-w-xs rounded-lg px-4 py-3 shadow-lg font-semibold z-50
              ${response.type === "success" ? "bg-green-100 text-green-800" : response.type === "error" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}
                    >
                        <div className="flex justify-between items-center">
                            <span>{response.text}</span>
                            <button onClick={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setResponse(null); }}>&times;</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal حذف */}
            <DeleteConfirmModal isOpen={deleteModalOpen} onCancel={cancelDelete} onConfirm={confirmDelete} message="آیا مطمئن هستید که می‌خواهید این یادداشت را حذف کنید؟" />
        </>
    );
}
