"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

// Props کامپوننت
interface ConfirmModalProps {
  isOpen: boolean; // آیا مودال باز است یا نه
  onCancel: () => void; // تابع فراخوانی برای لغو
  onConfirm: () => void; // تابع فراخوانی برای تایید
  message?: string; // پیام نمایش داده شده
  confirmText?: string; // متن دکمه تایید
  confirmColor?: string; // رنگ دکمه تایید
}

export default function ConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
  message = "آیا مطمئن هستید؟",
  confirmText = "تایید",
  confirmColor = "bg-blue-600 hover:bg-blue-700",
}: ConfirmModalProps) {
  // مدیریت کلیدهای Enter و Escape هنگام باز بودن مودال
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onConfirm();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel, onConfirm]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* بک‌دراپ نیمه‌شفاف */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onCancel} // کلیک روی بک‌دراپ لغو می‌کند
          />

          {/* پنجره مودال */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 z-50 w-80 max-w-full -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gray-900 p-6 shadow-2xl text-gray-100 select-none"
          >
            {/* پیام مودال */}
            <p className="mb-5 text-center text-lg font-bold">{message}</p>

            {/* دکمه‌های لغو و تایید */}
            <div className="flex justify-center gap-5">
              <button
                onClick={onCancel}
                className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              >
                لغو
              </button>
              <button
                onClick={onConfirm}
                className={`px-5 py-2 rounded-lg text-white transition shadow-md ${confirmColor}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
