import { useState, useCallback, useEffect } from "react";

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  createdAt: string;
}

export function useCalculatorHistory(trigger: any) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/history");
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) setHistory(data);
      else setHistory([]);
    } catch {
      setError("گرفتن تاریخچه با خطا روبرو شد");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteServerHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history", { method: "DELETE" });
      if (!res.ok) throw new Error("حذف تاریخچه سرور ناموفق بود");
      setHistory([]);
    } catch {
      setError("خطا در حذف از سرور");
    }
  }, []);

  const saveHistory = useCallback(async (expression: string, result: string) => {
    try {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression, result }),
      });
    } catch {}
  }, []);

  useEffect(() => { fetchHistory(); }, [trigger, fetchHistory]);

  return { history, setHistory, loading, error, fetchHistory, saveHistory, deleteServerHistory };
}