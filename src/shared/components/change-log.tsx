"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ChangeLogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangeLog = ({ isOpen, onClose }: ChangeLogProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="relative w-full max-w-lg p-8 bg-white rounded-t-2xl"
          >
            <h2 className="text-2xl font-bold mb-4">Changelog</h2>
            <p>No changes yet.</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
