"use client";

import LoadingDots from "@/components/loading";
import ConfirmModal from "@/components/DeleteConfirmModal";
import Header from "@/components/ui/header";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// نوع داده برای هر انجام دادنی
type Todo = { id: string; title: string; completed: boolean; createdAt: string };
// نوع داده برای پیام‌های پاسخ به کاربر
type ResponseMessage = { text: string; type: "success" | "error" | "info" };

// تابع کمکی برای فراخوانی API با توکن
const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Unauthorized"); // اگر پاسخ ناموفق بود خطا پرتاب می‌کنیم
  return res.json();
};

export default function TodosPage() {
  // توکن JWT برای احراز هویت
  const [token, setToken] = useState<string | null>(null);
  // اطلاعات کاربر
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  // لیست انجام دادنی‌ها
  const [todos, setTodos] = useState<Todo[]>([]);
  // مقادیر فرم
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // وضعیت‌های UI
  const [loading, setLoading] = useState(false); // برای لودینگ صفحه
  const [submitting, setSubmitting] = useState(false); // برای ارسال فرم
  const [response, setResponse] = useState<ResponseMessage | null>(null); // پیام به کاربر

  // مودال حذف
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | number | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // مودال تکمیل و لغو تکمیل
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [uncompleteModalOpen, setUncompleteModalOpen] = useState(false);
  const [targetTodo, setTargetTodo] = useState<Todo | null>(null);

  // مودال ویرایش و بروزرسانی
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [targetEditTodo, setTargetEditTodo] = useState<Todo | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  // وضعیت تعامل کاربر با فرم
  const [touchedTitle, setTouchedTitle] = useState(false); // کاربر روی input کلیک کرده یا خیر
  const [formTouched, setFormTouched] = useState(false); // فرم لمس شده یا خیر

  // رفرنس تایمر برای پیام‌ها
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // گرفتن توکن JWT از سرور (refresh)
  const fetchAccessToken = async () => {
    const res = await fetch("/api/auth/refresh");
    const data = await res.json();
    if (res.ok) {
      setToken(data.accessToken);
      const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
      setUser({ id: payload.id, username: payload.username });
    } else {
      router.push("/login"); // هدایت به صفحه ورود اگر توکن معتبر نباشد
    }
  };

  // گرفتن لیست انجام دادنی‌ها
  const fetchTodos = async () => {
    if (!token) return;
    try {
      setLoading(true); // شروع لودینگ
      const data = await fetcher("/api/todo", token);
      setTodos(data.todos || []); // ذخیره داده‌ها در state
    } catch {
      showResponse({ text: "❌ خطا در دریافت انجام دادنیها", type: "error" });
    } finally {
      setLoading(false); // پایان لودینگ
    }
  };

  // اجرا در mount برای گرفتن توکن
  useEffect(() => { fetchAccessToken(); }, []);
  // اجرای fetchTodos وقتی توکن موجود است
  useEffect(() => { if (token) fetchTodos(); }, [token]);

  // نمایش پیام به کاربر
  const showResponse = (resp: ResponseMessage) => {
    setResponse(resp);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setResponse(null), 4000); // پیام بعد از 4 ثانیه حذف می‌شود
  };

  // ذخیره یا بروزرسانی انجام دادنی
  const saveTodo = async () => {
    if (!title.trim() || !token) {
      showResponse({ text: "❌ لطفا عنوان را وارد کنید.", type: "error" });
      return;
    }

    setSubmitting(true); // شروع ارسال فرم
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
        showResponse({ text: editingTodo ? "✅ انجام دادنی بروز شد" : "✅ انجام دادنی اضافه شد", type: "success" });
        // ریست فرم بعد از اضافه/ویرایش
        setTitle(""); setCompleted(false); setEditingTodo(null); setFormTouched(false); setTouchedTitle(false);
        fetchTodos(); // بروزرسانی لیست
      } else {
        showResponse({ text: `❌ خطا: ${data.message || "ناموفق"}`, type: "error" });
      }
    } catch {
      showResponse({ text: "❌ خطا در ارتباط با سرور", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // عملیات بروزرسانی
  const handleUpdate = async (id: string) => {
    setSubmitting(true);
    await saveTodo(); // ذخیره انجام دادنی
    setUpdateModalOpen(false); // بستن مودال
  };

  // عملیات حذف
  const onDeleteClick = (id: string | number) => { setToDeleteId(id); setDeleteModalOpen(true); };
  const cancelDelete = () => { setDeleteModalOpen(false); setToDeleteId(null); };
  const confirmDelete = async () => {
    if (!toDeleteId || !token) return;
    setDeletingId(toDeleteId); setDeleteModalOpen(false);
    try {
      const res = await fetch(`/api/todo/${toDeleteId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) showResponse({ text: "✅ انجام دادنی حذف شد", type: "success" });
      else showResponse({ text: `❌ خطا: ${data.message || "ناموفق"}`, type: "error" });
      fetchTodos();
    } catch {
      showResponse({ text: "❌ خطا در ارتباط با سرور", type: "error" });
    } finally { setDeletingId(null); setToDeleteId(null); }
  };

  // عملیات تکمیل
  const onCompleteClick = (todo: Todo) => { setTargetTodo(todo); setCompleteModalOpen(true); };
  const confirmComplete = async () => {
    if (!targetTodo || !token) return;
    try {
      const res = await fetch(`/api/todo/${targetTodo.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ completed: true }) });
      const data = await res.json();
      if (res.ok) showResponse({ text: "✅ انجام دادنی تکمیل شد", type: "success" });
      else showResponse({ text: `❌ خطا: ${data.message || "ناموفق"}`, type: "error" });
      fetchTodos();
    } catch { showResponse({ text: "❌ خطا در ارتباط با سرور", type: "error" }); }
    finally { setCompleteModalOpen(false); setTargetTodo(null); }
  };

  // عملیات لغو تکمیل
  const onUncompleteClick = (todo: Todo) => { setTargetTodo(todo); setUncompleteModalOpen(true); };
  const confirmUncomplete = async () => {
    if (!targetTodo || !token) return;
    try {
      const res = await fetch(`/api/todo/${targetTodo.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ completed: false }) });
      const data = await res.json();
      if (res.ok) showResponse({ text: "✅ انجام دادنی لغو تکمیل شد", type: "success" });
      else showResponse({ text: `❌ خطا: ${data.message || "ناموفق"}`, type: "error" });
      fetchTodos();
    } catch { showResponse({ text: "❌ خطا در ارتباط با سرور", type: "error" }); }
    finally { setUncompleteModalOpen(false); setTargetTodo(null); }
  };

  // نمایش لودینگ اگر کاربر هنوز بارگذاری نشده
  if (!user || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300 animate-pulse">
        در حال بارگذاری...
      </p>
    </div>
    );
  }

  return (
    <>
      {/* هدر صفحه */}
      <Header />

      {/* کانتینر اصلی */}
      <div className="min-h-screen mt-16 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="container mx-auto max-w-2xl flex flex-col gap-6">

          {/* فرم انجام دادنی */}
          <form onSubmit={(e) => e.preventDefault()} className="rounded-2xl p-6 bg-white/10 backdrop-blur-md shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200">
              {editingTodo ? "ویرایش انجام دادنی" : "افزودن انجام دادنی"}
            </h2>

            {/* ورودی عنوان */}
            <div className="w-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-2xl p-4 shadow-inner flex items-center">
              <input
                type="text"
                placeholder="عنوان انجام دادنی"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setTouchedTitle(true)}
                className="w-full bg-transparent border-none focus:outline-none text-right text-black dark:text-gray-100 font-['Major_Mono_Display'] text-xl sm:text-2xl md:text-3xl placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg transition-all"
              />
            </div>
            {/* پیام خطای فرم */}
            {(touchedTitle || formTouched) && !title.trim() && (
              <p className="text-red-600 text-sm mt-1 text-right">لطفا عنوان را وارد کنید.</p>
            )}

            {/* دکمه‌های افزودن و لغو */}
            <div className="flex items-end justify-end gap-2">
              {editingTodo ? (
                <button type="button" onClick={() => setUpdateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                  بروزرسانی
                </button>
              ) : (
                <button type="button" onClick={saveTodo} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                  افزودن
                </button>
              )}
              {editingTodo && (
                <button type="button" onClick={() => { setEditingTodo(null); setTitle(""); setCompleted(false); setFormTouched(false); setTouchedTitle(false); }} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                  لغو
                </button>
              )}
            </div>
          </form>

          {/* لیست انجام دادنی‌ها */}
          <div className="py-2.5 px-0.5 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-xl">
            <div className="p-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70 scrollbar-thumb-rounded scrollbar-track-transparent hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80 transition-all">
              {loading ? (
                <div className="flex justify-center items-center h-24"><LoadingDots /></div>
              ) : todos.length === 0 ? (
                <p className="text-center text-gray-500">هیچ انجام دادنییی وجود ندارد.</p>
              ) : (
                <AnimatePresence>
                  {todos.map((todo) => (
                    <motion.div key={todo.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="p-4 mb-3 gap-2 rounded-lg bg-white/10 dark:bg-black/30 flex flex-row-reverse justify-between items-start shadow">
                      {/* عنوان و تاریخ انجام دادنی */}
                      <div className="space-y-4 w-full text-right">
                        <h3 className={`font-bold ${todo.completed ? "line-through text-green-600" : "text-gray-700 dark:text-indigo-300"} text-xl`}>
                          {todo.title}
                        </h3>
                        <small className="text-gray-400 block mt-1 text-left text-sm">{new Date(todo.createdAt).toLocaleString()}</small>
                      </div>

                      {/* دکمه‌های عملیات */}
                      <div className="flex flex-col gap-3">
                        <button onClick={() => { setTargetEditTodo(todo); setEditModalOpen(true); }} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs">ویرایش</button>
                        {todo.completed ? (
                          <button onClick={() => onUncompleteClick(todo)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs">لغو</button>
                        ) : (
                          <button onClick={() => onCompleteClick(todo)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs">تکمیل</button>
                        )}
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

      {/* پیام‌های پاسخ */}
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
      {/* حذف */}
      <ConfirmModal isOpen={deleteModalOpen} onCancel={cancelDelete} onConfirm={confirmDelete} message="آیا مطمئن هستید که می‌خواهید این انجام دادنی را حذف کنید؟" confirmText="حذف" confirmColor="bg-red-600 hover:bg-red-700" />
      {/* تکمیل */}
      <ConfirmModal isOpen={completeModalOpen} onCancel={() => setCompleteModalOpen(false)} onConfirm={confirmComplete} message="آیا مطمئن هستید که این انجام دادنی تکمیل شود؟" confirmText="تکمیل" confirmColor="bg-green-500 hover:bg-green-600" />
      {/* لغو تکمیل */}
      <ConfirmModal isOpen={uncompleteModalOpen} onCancel={() => setUncompleteModalOpen(false)} onConfirm={confirmUncomplete} message="آیا مطمئن هستید که تکمیل این انجام دادنی لغو شود؟" confirmText="لغو تکمیل" confirmColor="bg-yellow-500 hover:bg-yellow-600" />
      {/* شروع ویرایش */}
      <ConfirmModal isOpen={editModalOpen} onCancel={() => setEditModalOpen(false)} onConfirm={() => { if (targetEditTodo) { setEditingTodo(targetEditTodo); setTitle(targetEditTodo.title); setCompleted(targetEditTodo.completed); } setEditModalOpen(false); }} message="آیا می‌خواهید این انجام دادنی را ویرایش کنید؟" confirmText="ویرایش" confirmColor="bg-yellow-500 hover:bg-yellow-600" />
      {/* بروزرسانی */}
      <ConfirmModal isOpen={updateModalOpen} onCancel={() => setUpdateModalOpen(false)} onConfirm={() => handleUpdate(editingTodo!.id)} message="آیا مطمئن هستید که تغییرات ذخیره شود؟" confirmText="ذخیره" confirmColor="bg-blue-500 hover:bg-blue-600" />
    </>
  );
}
