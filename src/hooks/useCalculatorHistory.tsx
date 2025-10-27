import { useState, useCallback, useEffect } from "react";

/**
 * @description Represents a single item in the calculator's history.
 * @property {string} id - The unique identifier of the history item.
 * @property {string} expression - The mathematical expression.
 * @property {string} result - The result of the expression.
 * @property {string} createdAt - The timestamp of when the item was created.
 */
export interface HistoryItem {
  id: string;
  expression: string; // The operation string (e.g., "5 + 3")
  result: string;     // The result of the operation
  createdAt: string;  // The creation timestamp
}

/**
 * @description A custom hook for managing the calculator's history.
 * It handles fetching, saving, and deleting history items from the server.
 * @param {unknown} trigger - A value that, when changed, triggers a refetch of the history.
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
export function useCalculatorHistory(trigger: unknown) {
  const [history, setHistory] = useState<HistoryItem[]>([]); // History array
  const [loading, setLoading] = useState<boolean>(false);     // Loading state
  const [error, setError] = useState<string | null>(null);    // Errors

  // Fetch history from the server
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/history");
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const data = await res.json();

      // Reverse sort (newest first)
      if (Array.isArray(data)) {
        setHistory(data.reverse());
      } else {
        setHistory([]);
      }
    } catch {
      setError("Failed to fetch history");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete all history from the server
  const deleteServerHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete server history");

      // Clear locally
      setHistory([]);
    } catch {
      setError("Error deleting from server");
    }
  }, []);

  // Save a new operation to the server
  const saveHistory = useCallback(async (expression: string, result: string) => {
    try {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression, result }),
      });
    } catch {
      // Can log or show a message on error
    }
  }, []);

  // React to trigger: refetch history when trigger changes
  useEffect(() => {
    fetchHistory();
  }, [trigger, fetchHistory]);

  return {
    history,
    setHistory,           // Allows direct management of the history array
    loading,
    error,
    fetchHistory,         // Manual refetch function
    saveHistory,          // Save a new operation
    deleteServerHistory,  // Delete all history from the server
  };
}
