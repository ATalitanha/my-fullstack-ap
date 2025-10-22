import { useState, useCallback, useEffect } from "react";

/**
 * Represents a single item in the calculator's history.
 * @property {string} id - The unique identifier of the history item.
 * @property {string} expression - The mathematical expression.
 * @property {string} result - The result of the expression.
 * @property {string} createdAt - The timestamp of when the item was created.
 */
export interface HistoryItem {
  id: string;
  expression: string; // رشته عملیات (مثل "5 + 3")
  result: string;     // نتیجه عملیات
  createdAt: string;  // زمان ایجاد
}

/**
 * A custom hook for managing the calculator's history.
 * It handles fetching, saving, and deleting history items from the server.
 * @param {any} trigger - A value that, when changed, triggers a refetch of the history.
 * @returns {{
 *  history: HistoryItem[],
 *  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>,
 *  loading: boolean,
 *  error: string | null,
 *  fetchHistory: () => Promise<void>,
 *  saveHistory: (expression: string, result: string) => Promise<void>,
 *  deleteServerHistory: () => Promise<void>
 * }} - An object containing the history state and functions to manage it.
 */
export function useCalculatorHistory(trigger: any) {
  const [history, setHistory] = useState<HistoryItem[]>([]); // آرایه تاریخچه
  const [loading, setLoading] = useState<boolean>(false);     // وضعیت بارگذاری
  const [error, setError] = useState<string | null>(null);    // خطاها

  // دریافت تاریخچه از سرور
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/history");
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const data1 = await res.json();

      // مرتب‌سازی معکوس (جدیدترین‌ها اول)
      const data = data1.reverse();

      if (Array.isArray(data)) setHistory(data);
      else setHistory([]);
    } catch {
      setError("گرفتن تاریخچه با خطا روبرو شد");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // حذف کل تاریخچه از سرور
  const deleteServerHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history", { method: "DELETE" });
      if (!res.ok) throw new Error("حذف تاریخچه سرور ناموفق بود");

      // پاک کردن محلی
      setHistory([]);
    } catch {
      setError("خطا در حذف از سرور");
    }
  }, []);

  // ذخیره یک عملیات جدید در سرور
  const saveHistory = useCallback(async (expression: string, result: string) => {
    try {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression, result }),
      });
    } catch {
      // در صورت خطا می‌توان لاگ گرفت یا پیام داد
    }
  }, []);

  // واکنش به trigger: وقتی trigger تغییر کند تاریخچه دوباره بارگذاری می‌شود
  useEffect(() => {
    fetchHistory();
  }, [trigger, fetchHistory]);

  return {
    history,
    setHistory,           // امکان مدیریت مستقیم آرایه تاریخچه
    loading,
    error,
    fetchHistory,         // فراخوانی دستی برای بروزرسانی
    saveHistory,          // ذخیره عملیات جدید
    deleteServerHistory,  // حذف کل تاریخچه از سرور
  };
}
