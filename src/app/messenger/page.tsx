"use client";

import LoadingDots from "@/components/loading";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/ui/header";

/**
 * نوع پیام
 */
type Message = {
  id: string | number;
  title: string;
  body: string;
};

/**
 * نوع پیام پاسخ از سرور
 */
type ResponseMessage = {
  text: string;
  type: "success" | "error" | "info";
};

export default function MessageForm() {
  // State فرم
  const [title, setTitle] = useState("");  // عنوان پیام
  const [body, setBody] = useState("");    // متن پیام
  const [loading, setLoading] = useState(false); // وضعیت ارسال
  const [response, setResponse] = useState<ResponseMessage | null>(null); // پیام پاسخ
  const [messages, setMessages] = useState<Message[]>([]); // لیست پیام‌ها

  // State حذف پیام
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | number | null>(null);

  // State مدیریت تعامل با فرم
  const [formTouched, setFormTouched] = useState(false);
  const [touchedTitle, setTouchedTitle] = useState(false);
  const [touchedBody, setTouchedBody] = useState(false);

  // Ref ها
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /**
   * دریافت پیام‌ها از سرور
   */
  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/massage");
      const data = await res.json();
      setMessages(data || []);
    } catch {
      showResponse({ text: "❌ خطا در دریافت پیام‌ها", type: "error" });
    }
  };

  // بارگذاری اولیه پیام‌ها و پاکسازی timeout
  useEffect(() => {
    fetchMessages();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  /**
   * نمایش پیام پاسخ (با timeout خودکار)
   */
  const showResponse = (resp: ResponseMessage) => {
    setResponse(resp);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setResponse(null), 4000);
  };

  /**
   * ارسال فرم
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);
    setTouchedTitle(true);
    setTouchedBody(true);
    setResponse(null);

    // اعتبارسنجی فرم
    if (!title.trim() || !body.trim()) {
      showResponse({ text: "❌ لطفا همه فیلدها را پر کنید.", type: "error" });
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
        showResponse({ text: "✅ پیام با موفقیت ارسال شد", type: "success" });
        setTitle("");
        setBody("");
        setFormTouched(false);
        setTouchedTitle(false);
        setTouchedBody(false);
        fetchMessages();
        setTimeout(() => {
          listRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 200);
      } else {
        showResponse({
          text: `❌ خطا: ${data.message || "ارسال ناموفق بود"}`,
          type: "error",
        });
      }
    } catch {
      showResponse({ text: "❌ خطا در ارتباط با سرور", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /** کلیک روی دکمه حذف یک پیام */
  const onDeleteClick = (id: string | number) => {
    setToDeleteId(id);
    setDeleteModalOpen(true);
  };

  /** لغو حذف */
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setToDeleteId(null);
  };

  /** تایید حذف پیام */
  const confirmDelete = async () => {
    if (toDeleteId === null) return;

    setDeletingId(toDeleteId);
    setDeleteModalOpen(false);

    try {
      let res;
      if (toDeleteId === "all") {
        // حذف همه پیام‌ها
        res = await fetch("/api/massage", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deleteAll: true }),
        });
      } else {
        // حذف پیام مشخص
        res = await fetch("/api/massage", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: toDeleteId }),
        });
      }

      const data = await res.json();

      if (res.ok) {
        showResponse({
          text: toDeleteId === "all" ? "✅ همه پیام‌ها حذف شدند" : "✅ پیام حذف شد",
          type: "success",
        });
        fetchMessages();
      } else {
        showResponse({
          text: `❌ خطا در حذف: ${data.message || "ناموفق بود"}`,
          type: "error",
        });
      }
    } catch {
      showResponse({ text: "❌ خطا در ارتباط با سرور", type: "error" });
    } finally {
      setDeletingId(null);
      setToDeleteId(null);
    }
  };

  return (
    <>
      {/* هدر سایت */}
      <Header />

      <div className="min-h-screen mt-16 transition-colors duration-300 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto max-w-2xl px-4 py-12 flex flex-col gap-6">

          {/* فرم ارسال پیام */}
          <form
            dir="rtl"
            onSubmit={handleSubmit}
            className="rounded-2xl p-6 bg-white/10 backdrop-blur-md shadow-xl space-y-6"
            noValidate
          >
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
              ارسال پیام جدید
            </h2>

            {/* عنوان پیام */}
            <div className="w-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-2xl p-4 min-h-[70px] shadow-inner flex items-center">
              <input
                type="text"
                placeholder="عنوان پیام"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setTouchedTitle(true)}
                className="w-full max-h-9 bg-transparent border-none focus:outline-none text-right text-black dark:text-gray-100 font-['Major_Mono_Display'] text-2xl sm:text-3xl md:text-4xl placeholder:text-gray-400 dark:placeholder:text-gray-500"
                aria-invalid={(touchedTitle || formTouched) && !title.trim()}
                aria-describedby="title-error"
              />
            </div>
            {(touchedTitle || formTouched) && !title.trim() && (
              <p id="title-error" className="text-red-600 text-sm mt-1 text-right" role="alert">
                لطفا عنوان را وارد کنید.
              </p>
            )}

            {/* متن پیام */}
            <div className="w-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-2xl p-4 shadow-inner">
              <textarea
                dir="rtl"
                placeholder="متن پیام"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onBlur={() => setTouchedBody(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as unknown as React.FormEvent);
                  }
                }}
                className="w-full min-h-10 bg-transparent border-none focus:outline-none text-right text-black dark:text-gray-100 font-['Major_Mono_Display'] text-xl sm:text-2xl md:text-3xl placeholder:text-gray-400 dark:placeholder:text-gray-500"
                aria-invalid={(touchedBody || formTouched) && !body.trim()}
                aria-describedby="body-error"
              />
            </div>
            {(touchedBody || formTouched) && !body.trim() && (
              <p id="body-error" className="text-red-600 text-sm mt-1 text-right" role="alert">
                لطفا متن پیام را وارد کنید.
              </p>
            )}

            {/* دکمه ارسال */}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg px-5 py-3 transition disabled:opacity-60 whitespace-nowrap inline-block"
            >
              {loading ? "در حال ارسال..." : "ارسال"}
            </button>
          </form>

          {/* لیست پیام‌ها */}
          <div className="p-4 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-xl">
            <section
              ref={listRef}
              id="messages-section"
              className="rounded-xl bg-white/10 dark:bg-black/30 backdrop-blur-lg border border-white/20 dark:border-gray-700 p-4 text-sm font-black shadow-lg transition-colors max-h-96 flex flex-col"
            >
              <div className="flex flex-row-reverse justify-between mb-3 items-center">
                <h3 className="text-lg font-black text-black dark:text-gray-300">
                  پیام‌های ثبت‌شده
                </h3>
                <button
                  onClick={() => { setToDeleteId("all"); setDeleteModalOpen(true); }}
                  className="font-black text-red-500 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 text-xs px-3 py-1 rounded-lg transition-colors shadow-md"
                  type="button"
                >
                  {deletingId === "all" ? "در حال حذف..." : "حذف تاریخچه"}
                </button>
              </div>

              {/* محتوای پیام‌ها */}
              <div className="flex-1 overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70 scrollbar-thumb-rounded scrollbar-track-transparent hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80 transition-all">
                {loading ? (
                  <div className="flex justify-center items-center h-28"><LoadingDots /></div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-28 text-black dark:text-gray-500 font-black italic">
                    هیچ پیامی وجود ندارد.
                  </div>
                ) : (
                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 mb-3 rounded-lg bg-white/10 dark:bg-black/30 flex flex-row-reverse text-right justify-between items-start shadow"
                      >
                        <div>
                          <div className="font-bold text-gray-800 dark:text-white text-base">{msg.title}</div>
                          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{msg.body}</p>
                        </div>
                        <button
                          onClick={() => onDeleteClick(msg.id)}
                          disabled={deletingId === msg.id}
                          className="ml-4 text-red-500 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 px-2 py-1 rounded-md text-xs font-bold transition-colors shadow-sm"
                        >
                          {deletingId === msg.id ? "در حال حذف..." : "حذف"}
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* پیام پاسخ */}
      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50, y: 50 }}
            transition={{ duration: 0.3 }}
            role="alert"
            className={`fixed bottom-6 right-6 max-w-xs rounded-lg px-4 py-3 shadow-lg font-semibold select-none z-50
              ${response.type === "success"
                ? "bg-green-100 text-green-800"
                : response.type === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
          >
            <div className="flex items-center justify-between gap-4">
              <span>{response.text}</span>
              <button
                aria-label="بستن پیام"
                onClick={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setResponse(null); }}
                className="text-gray-600 hover:text-gray-800 font-bold text-lg leading-none"
              >
                &times;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* مودال تایید حذف */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        message="آیا مطمئن هستید که می‌خواهید این پیام را حذف کنید؟"
      />
    </>
  );
}
