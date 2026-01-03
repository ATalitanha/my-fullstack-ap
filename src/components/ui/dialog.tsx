"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <DialogPrimitive.Content className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-6 shadow-2xl border border-white/40 dark:border-gray-700/40 ${className ?? ""}`}>{children}</DialogPrimitive.Content>
    </>
  );
}
