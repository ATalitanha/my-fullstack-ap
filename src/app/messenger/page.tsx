"use client";

import LoadingDots from "@/components/loading";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/ui/header";

type Message = {
  id: string | number;
  title: string;
  body: string;
};

type ResponseMessage = {
  text: string;
  type: "success" | "error" | "info";
};

export default function MessageForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResponseMessage | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | number | null>(null);

  const [formTouched, setFormTouched] = useState(false);
  const [touchedTitle, setTouchedTitle] = useState(false);
  const [touchedBody, setTouchedBody] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/massage");
      const data = await res.json();
      setMessages(data || []);
    } catch {
      showResponse({ text: "❌ خطا در دریافت پیام‌ها", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const showResponse = (resp: ResponseMessage) => {
    setResponse(resp);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setResponse(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);
    setTouchedTitle(true);
    setTouchedBody(true);
    setResponse(null);

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

  const onDeleteClick = (id: string | number) => {
    setToDeleteId(id);
    setDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setToDeleteId(null);
  };

  const confirmDelete = async () => {
    if (toDeleteId === null) return;

    setDeletingId(toDeleteId);
    setDeleteModalOpen(false);

    try {
      const res = await fetch("/api/massage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: toDeleteId }),
      });

      const data = await res.json();

      if (res.ok) {
        showResponse({ text: "✅ پیام حذف شد", type: "success" });
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
      <Header />
      <div
        className="min-h-screen mt-16 transition-colors duration-300
        bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        <div className="container mx-auto max-w-2xl px-4 py-12 flex flex-col gap-6">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-6 bg-white/10 backdrop-blur-md shadow-xl space-y-6"
            noValidate
          >
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
              ارسال پیام جدید
            </h2>

            <input
              type="text"
              placeholder="عنوان پیام"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouchedTitle(true)}
              className="w-full rounded-lg border border-gray-300 bg-white/90 dark:bg-gray-800 dark:border-gray-600
                px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-invalid={(touchedTitle || formTouched) && !title.trim()}
              aria-describedby="title-error"
            />
            {(touchedTitle || formTouched) && !title.trim() && (
              <p
                id="title-error"
                className="text-red-600 text-sm mt-1 select-none"
                role="alert"
              >
                لطفا عنوان را وارد کنید.
              </p>
            )}

            <textarea
              placeholder="متن پیام"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onBlur={() => setTouchedBody(true)}
              className="w-full rounded-lg border border-gray-300 bg-white/90 dark:bg-gray-800 dark:border-gray-600
                px-4 py-3 h-28 resize-none text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-invalid={(touchedBody || formTouched) && !body.trim()}
              aria-describedby="body-error"
            />
            {(touchedBody || formTouched) && !body.trim() && (
              <p
                id="body-error"
                className="text-red-600 text-sm mt-1 select-none"
                role="alert"
              >
                لطفا متن پیام را وارد کنید.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold
                rounded-lg py-3 transition disabled:opacity-60"
            >
              {loading ? "در حال ارسال..." : "ارسال"}
            </button>
          </form>

          {/* لیست پیام‌ها */}
          <section
            ref={listRef}
            id="messages-section"
            className="rounded-2xl p-6 bg-white/10 backdrop-blur-md shadow-xl"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              پیام‌های ثبت‌شده
            </h3>

            {loading ? (
              <LoadingDots />
            ) : (
              <AnimatePresence>
                <motion.ul
                  className="max-h-80 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thumb-rounded-md"
                  initial={false}
                >
                  {messages.length === 0 && (
                    <motion.li
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-gray-500 select-none"
                    >
                      هیچ پیامی وجود ندارد.
                    </motion.li>
                  )}

                  {messages.map((msg) => (
                    <motion.li
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-between items-start bg-white/30 dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                    >
                      <div>
                        <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                          {msg.title}
                        </div>
                        <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {msg.body}
                        </p>
                      </div>
                      <button
                        onClick={() => onDeleteClick(msg.id)}
                        disabled={deletingId === msg.id}
                        className="ml-4 text-red-600 hover:text-red-800 font-semibold"
                        title="حذف پیام"
                      >
                        {deletingId === msg.id ? "در حال حذف..." : "حذف"}
                      </button>
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            )}
          </section>
        </div>
      </div>

      {/* پیام واکنش پایین صفحه */}
      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50, y: 50 }}
            transition={{ duration: 0.3 }}
            role="alert"
            className={`fixed bottom-6 right-6 max-w-xs rounded-lg px-4 py-3 shadow-lg font-semibold select-none z-50
              ${
                response.type === "success"
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
                onClick={() => {
                  if (timeoutRef.current) clearTimeout(timeoutRef.current);
                  setResponse(null);
                }}
                className="text-gray-600 hover:text-gray-800 font-bold text-lg leading-none"
              >
                &times;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* مودال تأیید حذف */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        message="آیا مطمئن هستید که می‌خواهید این پیام را حذف کنید؟"
      />
    </>
  );
}
