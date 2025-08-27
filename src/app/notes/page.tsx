"use client";

import LoadingDots from "@/components/loading";
import ConfirmModal from "@/components/DeleteConfirmModal";
import Header from "@/components/ui/header";
import theme from "@/lib/theme";
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

    const [loading, setLoading] = useState(false); // برای لودینگ داده‌ها
    const [submitting, setSubmitting] = useState(false); // برای ارسال فرم

    const [response, setResponse] = useState<ResponseMessage | null>(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState<string | number | null>(null);
    const [deletingId, setDeletingId] = useState<string | number | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);

    const [touchedTitle, setTouchedTitle] = useState(false);
    const [touchedContent, setTouchedContent] = useState(false);
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

    useEffect(() => { fetchAccessToken(); }, []);
    useEffect(() => { if (token) fetchNotes(); }, [token]);

    const showResponse = (resp: ResponseMessage) => {
        setResponse(resp);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setResponse(null), 4000);
    };

    const saveNote = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormTouched(true);
        setTouchedTitle(true);
        setTouchedContent(true);

        if (!title.trim() || !content.trim() || !token) {
            showResponse({ text: "❌ لطفا همه فیلدها را پر کنید.", type: "error" });
            return;
        }

        setSubmitting(true); // فقط فرم در حال ارسال است
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
                setTitle(""); setContent(""); setEditingNote(null);
                setFormTouched(false); setTouchedTitle(false); setTouchedContent(false);
                fetchNotes();
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
            const res = await fetch(`/api/notes/${toDeleteId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) showResponse({ text: "✅ یادداشت حذف شد", type: "success" });
            else showResponse({ text: `❌ خطا: ${data.message || "ناموفق"}`, type: "error" });
            fetchNotes();
        } catch {
            showResponse({ text: "❌ خطا در ارتباط با سرور", type: "error" });
        } finally {
            setDeletingId(null);
            setToDeleteId(null);
        }
    };

    const startEdit = (note: Note) => { setNoteToEdit(note); setEditModalOpen(true); };
    const confirmEdit = () => {
        if (!noteToEdit) return;
        setEditingNote(noteToEdit);
        setTitle(noteToEdit.title);
        setContent(noteToEdit.content);
        setEditModalOpen(false);
        setNoteToEdit(null);
    };
    const cancelEdit = () => { setEditModalOpen(false); setNoteToEdit(null); };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
    };

    if (!user)
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
      </div>
        );

    return (
        <>
            <Header />
            <div className={`min-h-screen mt-16 ${theme} p-6`}>
                <div className="container mx-auto max-w-2xl flex flex-col gap-6">

                    {/* فرم یادداشت */}
                    <form onSubmit={saveNote} className="rounded-2xl p-6 bg-white/10 backdrop-blur-md shadow-xl space-y-4">
                        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200">
                            {editingNote ? "ویرایش یادداشت" : "افزودن یادداشت"}
                        </h2>

                        <div className="w-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-2xl p-4 min-h-[70px] shadow-inner flex items-start">
                            <input
                                type="text"
                                placeholder="عنوان"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={() => setTouchedTitle(true)}
                                className="w-full max-h-9 bg-transparent border-none focus:outline-none text-right text-black dark:text-gray-100 font-['Major_Mono_Display'] text-2xl sm:text-3xl md:text-4xl placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            />
                        </div>
                        {(touchedTitle || formTouched) && !title.trim() && (
                            <p className="text-red-600 text-sm mt-1 text-right">لطفا عنوان را وارد کنید.</p>
                        )}

                        <div className="w-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-2xl p-4 shadow-inner">
                            <textarea
                                placeholder="متن یادداشت"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onBlur={() => setTouchedContent(true)}
                                className="w-full min-h-10 bg-transparent border-none focus:outline-none text-right text-black dark:text-gray-100 font-['Major_Mono_Display'] text-xl sm:text-2xl md:text-3xl placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                rows={4}
                            />
                        </div>
                        {(touchedContent || formTouched) && !content.trim() && (
                            <p className="text-red-600 text-sm mt-1 text-right">لطفا متن یادداشت را وارد کنید.</p>
                        )}

                        <div className="flex items-end justify-end gap-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold whitespace-nowrap inline-block"
                            >
                                {submitting ? "در حال ارسال..." : editingNote ? "بروز رسانی" : "افزودن"}
                            </button>


                            {editingNote && (
                                <button type="button" onClick={() => { setEditingNote(null); setTitle(""); setContent(""); setFormTouched(false); setTouchedTitle(false); setTouchedContent(false); }} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex-1">
                                    لغو
                                </button>
                            )}
                        </div>
                    </form>

                    {/* لیست یادداشت‌ها */}
                    <div className="py-2.5 px-0.5 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-xl">
                        <div className="p-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70 scrollbar-thumb-rounded scrollbar-track-transparent hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80 transition-all">
                            {loading ? <div className="flex justify-center items-center h-24"><LoadingDots /></div> :
                                notes.length === 0 ? <p className="text-center text-gray-500">هیچ یادداشتی وجود ندارد.</p> :
                                    <AnimatePresence>
                                        {notes.map((note) => (
                                            <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="p-4 mb-3 gap-2 rounded-lg bg-white/10 dark:bg-black/30 flex flex-row-reverse justify-between items-start shadow">
                                                <div className="space-y-4 w-full text-right">
                                                    <h3  className="font-bold text-gray-700 dark:text-indigo-300">{note.title}</h3>
                                                    <p  className="text-gray-500 dark:text-gray-200 mt-1 whitespace-pre-wrap">{note.content}</p>
                                                    <small className="text-gray-400 block mt-1 text-left">{new Date(note.createdAt).toLocaleString()}</small>
                                                </div>
                                                <div className="flex flex-col gap-5">
                                                    <button onClick={() => startEdit(note)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs">ویرایش</button>
                                                    <button onClick={() => onDeleteClick(note.id)} disabled={deletingId === note.id} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs">
                                                        {deletingId === note.id ? "در حال حذف..." : "حذف"}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                            }
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
            <ConfirmModal isOpen={deleteModalOpen} onCancel={cancelDelete} onConfirm={confirmDelete} message="آیا مطمئن هستید که می‌خواهید این یادداشت را حذف کنید؟" confirmText="حذف" confirmColor="bg-red-600 hover:bg-red-700" />
            <ConfirmModal isOpen={editModalOpen} onCancel={cancelEdit} onConfirm={confirmEdit} message="آیا مطمئن هستید که می‌خواهید این یادداشت را ویرایش کنید؟" confirmText="ویرایش" confirmColor="bg-yellow-500 hover:bg-yellow-600" />
        </>
    );
}
