"use client";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { useEffect } from "react";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastPrimitive.Provider swipeDirection="right">{children}</ToastPrimitive.Provider>
  );
}

export function ToastViewport() {
  return (
    <ToastPrimitive.Viewport className="fixed bottom-6 left-6 right-6 max-w-md mx-auto z-50" />
  );
}

export function Toast({ title, description, open, onOpenChange }: { title: string; description?: string; open?: boolean; onOpenChange?: (o: boolean) => void }) {
  return (
    <ToastPrimitive.Root open={open} onOpenChange={onOpenChange} className="rounded-2xl p-4 shadow-2xl backdrop-blur-lg border bg-white/90 dark:bg-gray-800/90 border-white/40 dark:border-gray-700/40">
      <ToastPrimitive.Title className="font-semibold text-gray-800 dark:text-gray-100">{title}</ToastPrimitive.Title>
      {description && (
        <ToastPrimitive.Description className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</ToastPrimitive.Description>
      )}
      <ToastPrimitive.Close className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">×</ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

