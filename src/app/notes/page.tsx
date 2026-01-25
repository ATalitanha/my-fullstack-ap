"use client";

import ConfirmModal from "@/components/DeleteConfirmModal";
import Card from "@/shared/ui/Card";
import theme from "@/lib/theme";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, Plus, Edit3, Trash2, FileText, AlertCircle, CheckCircle, X } from "lucide-react";
import HybridLoading from "../loading";

type Note = { id: string; title: string; content: string; createdAt: string };
type ResponseMessage = { text: string; type: "success" | "error" | "info" };

const fetcher = async (url: string, token: string) => {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
};

export default function NotesPage() {
    /**
     * وضعیت احراز هویت و داده‌های صفحه یادداشت‌ها
     */
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<{ id: string; username: string } | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [response, setResponse] = useState<ResponseMessage | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    /**
     * نمایش پیام وضعیت با ناپدید شدن خودکار
     */
    const showResponse = (resp: ResponseMessage) => {
        setResponse(resp);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setResponse(null), 4000);
    };

    /**
     * دریافت توکن دسترسی و تنظیم کاربر از توکن
     */
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

    /**
     * دریافت فهرست یادداشت‌ها از API
     */
    const fetchNotes = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const data = await fetcher("/api/notes", token);
            setNotes(data.notes || []);
        } catch {
            showResponse({ text: "❌ Error fetching notes", type: "error" });
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchAccessToken(); }, [fetchAccessToken]);
    useEffect(() => { if (token) fetchNotes(); }, [token, fetchNotes]);

    /**
     * افزودن یا بروزرسانی یک یادداشت
     */
    const saveNote = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormTouched(true);
        setTouchedTitle(true);
        setTouchedContent(true);

        if (!title.trim() || !content.trim() || !token) {
            showResponse({ text: "❌ Please fill out all fields.", type: "error" });
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
            const data = await res.json();
            if (res.ok) {
                showResponse({ text: editingNote ? "✅ Note updated" : "✅ Note added", type: "success" });
                setTitle(""); setContent(""); setEditingNote(null);
                setFormTouched(false); setTouchedTitle(false); setTouchedContent(false);
                fetchNotes();
            } else {
                showResponse({ text: `❌ Error: ${data.message || "Failed"}`, type: "error" });
            }
        } catch {
            showResponse({ text: "❌ Server connection error", type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    /** باز کردن مودال حذف برای یک یادداشت */
    const onDeleteClick = (id: string | number) => { setToDeleteId(id); setDeleteModalOpen(true); };
    /** بستن مودال حذف */
    const cancelDelete = () => { setDeleteModalOpen(false); setToDeleteId(null); };
    /** تایید حذف و بروزرسانی فهرست */
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
            if (res.ok) showResponse({ text: "✅ Note deleted", type: "success" });
            else showResponse({ text: `❌ Error: ${data.message || "Failed"}`, type: "error" });
            fetchNotes();
        } catch {
            showResponse({ text: "❌ Server connection error", type: "error" });
        } finally {
            setDeletingId(null);
            setToDeleteId(null);
        }
    };

    /** شروع ویرایش یک یادداشت */
    const startEdit = (note: Note) => { setNoteToEdit(note); setEditModalOpen(true); };
    /** تایید انتخاب یادداشت برای ویرایش */
    const confirmEdit = () => {
        if (!noteToEdit) return;
        setEditingNote(noteToEdit);
        setTitle(noteToEdit.title);
        setContent(noteToEdit.content);
        setEditModalOpen(false);
        setNoteToEdit(null);
    };
    /** لغو ویرایش یادداشت */
    const cancelEdit = () => { setEditModalOpen(false); setNoteToEdit(null); };

    if (!user)
        return (
            <HybridLoading/>
        );

    return (
        <>
            
            <div
                className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.1) 0%, transparent 80%)`
                }}
            />
            <div className={`min-h-screen pt-16 transition-colors duration-700 relative z-10 ${theme} bg-linear-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}>
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
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm mb-6"
                        >
                            <Sparkles size={16} />
                            <span>Personal Note Management</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 leading-tight">
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                Notes
                            </span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
                            Manage and organize your notes ✨
                        </p>
                    </motion.div>
                    <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1"
                        >
                            <Card className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {editingNote ? "Edit Note" : "Add New Note"}
                                    </h2>
                                </div>
                                <form onSubmit={saveNote} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Note Title
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter note title..."
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            onBlur={() => setTouchedTitle(true)}
                                            className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-gray-700/60  
                                            text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                                            focus:outline-none 
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Note Content
                                        </label>
                                        <textarea
                                            placeholder="Write your note content..."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            onBlur={() => setTouchedContent(true)}
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-gray-700/60  
                                            text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                                            focus:outline-none  
                                            transition-all duration-200 resize-none"
                                        />
                                        <AnimatePresence>
                                            {(touchedContent || formTouched) && !content.trim() && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="text-red-600 text-sm mt-2 flex items-center gap-1"
                                                >
                                                    <AlertCircle size={16} />
                                                    Please enter note content.
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 py-3 rounded-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                                            text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 
                                            transition-all duration-200 flex items-center justify-center gap-2 
                                            disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {submitting ? (
                                                <>
                                                    <div className="w-5 h-5  rounded-full animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    {editingNote ? <Edit3 size={20} /> : <Plus size={20} />}
                                                    {editingNote ? "Update" : "Add Note"}
                                                </>
                                            )}
                                        </motion.button>
                                        {editingNote && (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="button"
                                                onClick={() => {
                                                    setEditingNote(null);
                                                    setTitle("");
                                                    setContent("");
                                                    setFormTouched(false);
                                                    setTouchedTitle(false);
                                                    setTouchedContent(false);
                                                }}
                                                className="px-6 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                                                text-gray-700 dark:text-gray-300 transition-all duration-200 font-semibold"
                                            >
                                                Cancel
                                            </motion.button>
                                        )}
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1"
                        >
                            <Card className="h-full">
                                <div className="p-6  bg-linear-to-r from-red-500/10 via-gray-50 to-blue-500/10 dark:from-red-500/40 dark:via-gray-700/40 dark:to-blue-500/40 rounded-t-2xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                                <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">My Notes</h2>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {notes.length} notes
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 h-[600px] overflow-y-auto">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center h-32">
                                            <div className="animate-spin rounded-full h-8 w-8  mb-3"></div>
                                            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                                        </div>
                                    ) : notes.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400"
                                        >
                                            <FileText size={48} className="mb-3 opacity-50" />
                                            <p>No notes yet</p>
                                            <p className="text-sm mt-1">Create your first note!</p>
                                        </motion.div>
                                    ) : (
                                        <div className="space-y-4">
                                            <AnimatePresence>
                                                {notes.map((note, index) => (
                                                    <motion.div
                                                        key={note.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="p-4 rounded-2xl bg-linear-to-r from-red-100/10 to-blue-100/15 dark:from-red-500/10 dark:via-gray-500/10 dark:to-blue-500/15 hover:shadow-lg transition-all group"
                                                    >
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="flex-1">
                                                                <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                    {note.title}
                                                                </h3>
                                                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-3">
                                                                    {note.content}
                                                                </p>
                                                                <small className="text-gray-400 text-xs">
                                                                    {new Date(note.createdAt).toLocaleString('en-US')}
                                                                </small>
                                                            </div>
                                                            <div className="flex flex-col gap-2 shrink-0">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => startEdit(note)}
                                                                    className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors"
                                                                    title="Edit note"
                                                                >
                                                                    <Edit3 size={16} />
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => onDeleteClick(note.id)}
                                                                    disabled={deletingId === note.id}
                                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                                    title="Delete note"
                                                                >
                                                                    {deletingId === note.id ? (
                                                                        <div className="w-4 h-4  rounded-full animate-spin" />
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
                            </Card>
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
                        className={`fixed bottom-6 left-6 right-6 max-w-md mx-auto rounded-2xl p-4 shadow-2xl backdrop-blur-lg  z-50 ${response.type === "success"
                                ? "bg-green-50/90 dark:bg-green-900/90 text-green-800 dark:text-green-200"
                                : response.type === "error"
                                ? "bg-red-50/90 dark:bg-red-900/90  text-red-800 dark:text-red-200"
                                : "bg-blue-50/90 dark:bg-blue-900/90  text-blue-800 dark:text-blue-200"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {response.type === "success" ? (
                                <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                            ) : response.type === "error" ? (
                                <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
                            ) : (
                                <FileText className="text-blue-600 dark:text-blue-400" size={20} />
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
                message="Are you sure you want to delete this note?"
                confirmText="Delete"
                confirmColor="bg-red-600 hover:bg-red-700"
            />
            <ConfirmModal
                isOpen={editModalOpen}
                onCancel={cancelEdit}
                onConfirm={confirmEdit}
                message="Are you sure you want to edit this note?"
                confirmText="Edit"
                confirmColor="bg-yellow-500 hover:bg-yellow-600"
            />
        </>
    );
}
