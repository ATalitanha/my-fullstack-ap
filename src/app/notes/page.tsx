"use client";

import LoadingDots from "@/components/loading";
import ConfirmModal from "@/components/DeleteConfirmModal";
import Header from "@/components/ui/header";
import theme from "@/lib/theme";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, Plus, Edit3, Trash2, FileText, AlertCircle, CheckCircle, X } from "lucide-react";

// نوع داده برای یادداشت‌ها
type Note = { id: string; title: string; content: string; createdAt: string };
// نوع داده برای پیام‌های پاسخ به کاربر
type ResponseMessage = { text: string; type: "success" | "error" | "info" };

// تابع fetcher برای گرفتن یادداشت‌ها با JWT
const fetcher = async (url: string, token: string) => {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
};

export default function NotesPage() {
    // توکن JWT
    const [token, setToken] = useState<string | null>(null);
    // اطلاعات کاربر
    const [user, setUser] = useState<{ id: string; username: string } | null>(null);
    // لیست یادداشت‌ها
    const [notes, setNotes] = useState<Note[]>([]);
    // مقادیر فرم
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    // وضعیت‌ها
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [response, setResponse] = useState<ResponseMessage | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // مودال‌های حذف و ویرایش
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState<string | number | null>(null);
    const [deletingId, setDeletingId] = useState<string | number | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);

    // مدیریت فرم و خطاها
    const [touchedTitle, setTouchedTitle] = useState(false);
    const [touchedContent, setTouchedContent] = useState(false);
    const [formTouched, setFormTouched] = useState(false);

    // رفرنس تایمر برای پیام‌ها
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const router = useRouter();

    // ردیابی موقعیت ماوس
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // گرفتن توکن از سرور (refresh)
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

    // گرفتن لیست یادداشت‌ها
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

    // فراخوانی توکن هنگام mount
    useEffect(() => { fetchAccessToken(); }, []);
    // فراخوانی یادداشت‌ها وقتی توکن موجود است
    useEffect(() => { if (token) fetchNotes(); }, [token]);

    // نمایش پیام به کاربر
    const showResponse = (resp: ResponseMessage) => {
        setResponse(resp);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setResponse(null), 4000);
    };

    // ذخیره یا ویرایش یادداشت
    const saveNote = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormTouched(true);
        setTouchedTitle(true);
        setTouchedContent(true);

        if (!title.trim() || !content.trim() || !token) {
            showResponse({ text: "❌ لطفا همه فیلدها را پر کنید.", type: "error" });
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

    // مدیریت حذف یادداشت
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

    // شروع ویرایش یادداشت
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

    // نمایش لودینگ اگر کاربر هنوز بارگذاری نشده
    if (!user)
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300 animate-pulse">
                    در حال بارگذاری...
                </p>
            </div>
        );

    return (
        <>
            <Header />

            {/* افکت دنبال کننده ماوس */}
            <div 
                className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.1) 0%, transparent 80%)`
                }}
            />

            {/* بخش اصلی */}
            <div className={`min-h-screen pt-16 transition-colors duration-700 relative z-10 ${theme} bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}>
                
                {/* افکت‌های پس‌زمینه */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 py-12 relative z-10">
                    
                    {/* هدر صفحه */}
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
                            <span>مدیریت یادداشت‌های شخصی</span>
                        </motion.div>
                        
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                یادداشت‌ها
                            </span>
                        </h1>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
                            یادداشت‌های خود را مدیریت و سازماندهی کنید ✨
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        
                        {/* فرم یادداشت */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {editingNote ? "ویرایش یادداشت" : "افزودن یادداشت جدید"}
                                    </h2>
                                </div>

                                <form onSubmit={saveNote} className="space-y-6">
                                    
                                    {/* فیلد عنوان */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                                            عنوان یادداشت
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="عنوان یادداشت را وارد کنید..."
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            onBlur={() => setTouchedTitle(true)}
                                            className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-gray-700/60 border border-white/40 dark:border-gray-600/40 
                                            text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                                            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                                            transition-all duration-200 text-right"
                                        />
                                        <AnimatePresence>
                                            {(touchedTitle || formTouched) && !title.trim() && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="text-red-600 text-sm mt-2 text-right flex items-center gap-1"
                                                >
                                                    <AlertCircle size={16} />
                                                    لطفا عنوان را وارد کنید.
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* فیلد محتوا */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                                            متن یادداشت
                                        </label>
                                        <textarea
                                            placeholder="متن یادداشت خود را بنویسید..."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            onBlur={() => setTouchedContent(true)}
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-gray-700/60 border border-white/40 dark:border-gray-600/40 
                                            text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                                            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                                            transition-all duration-200 text-right resize-none"
                                        />
                                        <AnimatePresence>
                                            {(touchedContent || formTouched) && !content.trim() && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="text-red-600 text-sm mt-2 text-right flex items-center gap-1"
                                                >
                                                    <AlertCircle size={16} />
                                                    لطفا متن یادداشت را وارد کنید.
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* دکمه‌ها */}
                                    <div className="flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 py-3 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                                            text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 
                                            transition-all duration-200 flex items-center justify-center gap-2 
                                            disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {submitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    در حال ارسال...
                                                </>
                                            ) : (
                                                <>
                                                    {editingNote ? <Edit3 size={20} /> : <Plus size={20} />}
                                                    {editingNote ? "بروزرسانی" : "افزودن یادداشت"}
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
                                                لغو
                                            </motion.button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </motion.div>

                        {/* لیست یادداشت‌ها */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 h-full">
                                
                                {/* هدر لیست */}
                                <div className="p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-t-3xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                                <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">یادداشت‌های من</h2>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {notes.length} یادداشت
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* محتوای لیست */}
                                <div className="p-4 h-[600px] overflow-y-auto">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center h-32">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                                            <p className="text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
                                        </div>
                                    ) : notes.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400"
                                        >
                                            <FileText size={48} className="mb-3 opacity-50" />
                                            <p>هیچ یادداشتی وجود ندارد</p>
                                            <p className="text-sm mt-1">اولین یادداشت را ایجاد کنید!</p>
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
                                                        className="p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 border border-white/40 dark:border-gray-600/40 hover:shadow-lg transition-all group"
                                                    >
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="flex-1 text-right">
                                                                <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                    {note.title}
                                                                </h3>
                                                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-3">
                                                                    {note.content}
                                                                </p>
                                                                <small className="text-gray-400 text-xs">
                                                                    {new Date(note.createdAt).toLocaleString('fa-IR')}
                                                                </small>
                                                            </div>
                                                            <div className="flex flex-col gap-2 flex-shrink-0">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => startEdit(note)}
                                                                    className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors"
                                                                    title="ویرایش یادداشت"
                                                                >
                                                                    <Edit3 size={16} />
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => onDeleteClick(note.id)}
                                                                    disabled={deletingId === note.id}
                                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                                    title="حذف یادداشت"
                                                                >
                                                                    {deletingId === note.id ? (
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

            {/* پیام‌های پاسخ */}
            <AnimatePresence>
                {response && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className={`fixed bottom-6 left-6 right-6 max-w-md mx-auto rounded-2xl p-4 shadow-2xl backdrop-blur-lg border z-50 ${
                            response.type === "success"
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

            {/* مودال‌ها */}
            <ConfirmModal 
                isOpen={deleteModalOpen} 
                onCancel={cancelDelete} 
                onConfirm={confirmDelete} 
                message="آیا مطمئن هستید که می‌خواهید این یادداشت را حذف کنید؟" 
                confirmText="حذف" 
                confirmColor="bg-red-600 hover:bg-red-700" 
            />
            <ConfirmModal 
                isOpen={editModalOpen} 
                onCancel={cancelEdit} 
                onConfirm={confirmEdit} 
                message="آیا مطمئن هستید که می‌خواهید این یادداشت را ویرایش کنید؟" 
                confirmText="ویرایش" 
                confirmColor="bg-yellow-500 hover:bg-yellow-600" 
            />
        </>
    );
}