import { AnimatePresence, motion } from "framer-motion";

export default function DeleteConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
  message = "آیا مطمئن هستید که می‌خواهید حذف کنید؟",
}: {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  message?: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 z-50 w-80 max-w-full -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gray-900 p-6 shadow-2xl text-gray-100 select-none"
          >
            <p className="mb-5 text-center text-lg font-bold">
              {message}
            </p>
            <div className="flex justify-center gap-5">
              <button
                onClick={onCancel}
                className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              >
                لغو
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition shadow-md"
              >
                حذف
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}