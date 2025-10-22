import { useState, useEffect, useRef, useCallback } from "react";

type Message = {
  id: string | number;
  title: string;
  body: string;
};

type ResponseMessage = {
  text: string;
  type: "success" | "error" | "info";
};

export const useMessenger = () => {
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
      showResponse({ text: "❌ خطا در دریافت پیام‌ها", type: "error" });
    }
  }, [showResponse]);

  useEffect(() => {
    fetchMessages();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [fetchMessages]);

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
      let res;
      if (toDeleteId === "all") {
        res = await fetch("/api/massage", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deleteAll: true }),
        });
      } else {
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

  return {
    title,
    setTitle,
    body,
    setBody,
    loading,
    response,
    messages,
    deletingId,
    deleteModalOpen,
    toDeleteId,
    formTouched,
    touchedTitle,
    touchedBody,
    handleSubmit,
    onDeleteClick,
    cancelDelete,
    confirmDelete,
    setTouchedTitle,
    setTouchedBody,
  };
};
